import { NextResponse } from "next/server";
import { getRoleCopilotConfig } from "@/lib/role-config";
import { resolveCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { role?: string; message?: string };
  const user = await resolveCurrentUser(body.role);
  const config = getRoleCopilotConfig(user);
  const message = typeof body.message === "string" ? body.message : "";

  return NextResponse.json({
    data: {
      role: user.role,
      user: user.name,
      received: message,
      response: `Tradelink Copilot is in scaffold mode. For ${user.role}, I would answer using only permitted shipment, compliance, eBDL, and supplier context within your role scope.`,
      suggestedPrompts: config.prompts,
      safeScope: config.scope,
    },
  });
}
