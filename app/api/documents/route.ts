import { NextResponse } from "next/server";
import { listDocuments } from "@/lib/queries";

export async function GET() {
  return NextResponse.json({ data: await listDocuments() });
}
