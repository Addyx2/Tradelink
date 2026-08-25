import { NextResponse } from "next/server";
import { listShipments } from "@/lib/queries";

export async function GET() {
  return NextResponse.json({ data: await listShipments() });
}
