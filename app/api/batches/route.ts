import { NextResponse } from "next/server";
import { listBatches } from "@/lib/queries";

export async function GET() {
  return NextResponse.json({ data: await listBatches() });
}
