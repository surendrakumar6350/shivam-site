import { NextResponse } from "next/server";

import { connectDb } from "@/dbConnection/connect";
import CertificateModel from "@/dbConnection/Schema/certificate";
import {
  AUTH_COOKIE_NAME,
  getAuthConfig,
  verifyAuthToken,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") ?? "";
    const authToken = cookieHeader
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${AUTH_COOKIE_NAME}=`))
      ?.split("=")
      .slice(1)
      .join("=");
    const { secret } = getAuthConfig();

    if (!authToken || !secret || !verifyAuthToken(authToken, secret)) {
      return NextResponse.json(
        { message: "Unauthorized. Please unlock the create page first." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, fatherName, course, semester, collegeName } = body ?? {};

    if (!name || !fatherName || !course || !semester || !collegeName) {
      return NextResponse.json(
        {
          message:
            "name, fatherName, course, semester, and collegeName are required.",
        },
        { status: 400 }
      );
    }

    await connectDb();

    const certificate = await CertificateModel.create({
      name,
      fatherName,
      course,
      semester,
      collegeName,
    });

    return NextResponse.json(
      {
        message: "Certificate created successfully.",
        data: certificate,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create certificate:", error);

    return NextResponse.json(
      {
        message: "Failed to create certificate.",
      },
      { status: 500 }
    );
  }
}