import { NextResponse } from "next/server";
import { getShipmentDetails } from "@/lib/queries";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const shipment = await getShipmentDetails(params.id);

  if (!shipment) {
    return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
  }

  return NextResponse.json({ data: shipment });
}
