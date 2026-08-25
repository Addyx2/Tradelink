import { NextResponse } from "next/server";
import { listSuppliers } from "@/lib/queries";

export async function GET() {
  return NextResponse.json({ data: await listSuppliers() });
}
