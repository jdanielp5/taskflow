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
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { deleteTasksByUser } from "@/services/task.service";

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export async function registerWithEmail(name: string, email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });
  await sendEmailVerification(credential.user);
  await signOut(auth);
  return credential.user;
}

export async function loginWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);

  if (!credential.user.emailVerified) {
    await sendEmailVerification(credential.user).catch(() => null);
    await signOut(auth);
    throw new Error("Confirme seu e-mail antes de entrar. Enviamos uma nova confirmação para sua caixa de entrada.");
  }

  return credential.user;
}

export async function loginWithGoogle() {
  const credential = await signInWithPopup(auth, googleProvider);
  return credential.user;
}

export async function loginWithGithub() {
  const credential = await signInWithPopup(auth, githubProvider);
  return credential.user;
}

export async function logout() {
  await signOut(auth);
}

export async function deleteCurrentUser(password?: string) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Nenhum usuário está conectado.");
  }

  const providerId = user.providerData[0]?.providerId;

  if (providerId === "password") {
    if (!user.email || !password) {
      throw new Error("Digite sua senha atual para excluir a conta.");
    }

    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  }

  if (providerId === "google.com") {
    await reauthenticateWithPopup(user, googleProvider);
  }

  if (providerId === "github.com") {
    await reauthenticateWithPopup(user, githubProvider);
  }

  await deleteTasksByUser(user.uid);
  await deleteUser(user);
}
