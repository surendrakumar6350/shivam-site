import { NextResponse } from "next/server";

import { connectDb } from "@/dbConnection/connect";
import CertificateModel from "@/dbConnection/Schema/certificate";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "id is required" }, { status: 400 });
    }

    await connectDb();

    const certificate = await CertificateModel.findById(id).lean();

    if (!certificate) {
      return NextResponse.json({ message: "Certificate not found" }, { status: 404 });
    }

    return NextResponse.json({ data: certificate }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch certificate:", error);
    return NextResponse.json({ message: "Failed to fetch certificate" }, { status: 500 });
  }
}
