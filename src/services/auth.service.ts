import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { deleteTasksByUser } from "@/services/task.service";

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

googleProvider.setCustomParameters({ prompt: "select_account" });
githubProvider.setCustomParameters({ allow_signup: "true" });

async function saveUserProfile(user: User) {
  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      name: user.displayName || "Usuário TaskFlow",
      email: user.email || "",
      provider: user.providerData[0]?.providerId || "password",
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export function getAuthErrorMessage(error: unknown) {
  const code =
    typeof error === "object" && error && "code" in error
      ? String((error as { code: unknown }).code)
      : "";

  const messages: Record<string, string> = {
    "auth/email-already-in-use": "Este e-mail já está cadastrado.",
    "auth/invalid-email": "Informe um e-mail válido.",
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/popup-closed-by-user": "A janela de login foi fechada antes da conclusão.",
    "auth/popup-blocked": "O navegador bloqueou a janela de autenticação.",
    "auth/account-exists-with-different-credential":
      "Este e-mail já está associado a outro método de login.",
    "auth/too-many-requests": "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
    "auth/network-request-failed": "Falha de conexão. Verifique sua internet.",
    "auth/requires-recent-login": "Por segurança, entre novamente antes de excluir a conta.",
  };

  return messages[code] || (error instanceof Error ? error.message : "Ocorreu um erro de autenticação.");
}

export async function registerWithEmail(name: string, email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name.trim() });
  await saveUserProfile(credential.user);
  await sendEmailVerification(credential.user);
  await signOut(auth);
  return credential.user;
}

export async function loginWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);

  if (!credential.user.emailVerified) {
    await sendEmailVerification(credential.user).catch(() => null);
    await signOut(auth);
    throw new Error(
      "Confirme seu e-mail antes de entrar. Uma nova confirmação foi enviada para sua caixa de entrada.",
    );
  }

  await saveUserProfile(credential.user);
  return credential.user;
}

export async function loginWithGoogle() {
  const credential = await signInWithPopup(auth, googleProvider);
  await saveUserProfile(credential.user);
  return credential.user;
}

export async function loginWithGithub() {
  const credential = await signInWithPopup(auth, githubProvider);
  await saveUserProfile(credential.user);
  return credential.user;
}

export async function logout() {
  await signOut(auth);
}

export async function deleteCurrentUser(password?: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("Nenhum usuário está conectado.");

  const providerIds = user.providerData.map((provider) => provider.providerId);

  if (providerIds.includes("password")) {
    if (!user.email || !password) {
      throw new Error("Digite sua senha atual para excluir a conta.");
    }
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  } else if (providerIds.includes("google.com")) {
    await reauthenticateWithPopup(user, googleProvider);
  } else if (providerIds.includes("github.com")) {
    await reauthenticateWithPopup(user, githubProvider);
  }

  await deleteTasksByUser(user.uid);
  await deleteDoc(doc(db, "users", user.uid)).catch(() => null);
  await deleteUser(user);
}
