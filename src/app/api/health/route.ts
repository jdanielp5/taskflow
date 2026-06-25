import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    application: "TaskFlow",
    framework: "Next.js App Router",
    timestamp: new Date().toISOString(),
  });
}
