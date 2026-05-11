import { NextResponse } from "next/server";

import {
  AUTH_COOKIE_NAME,
  createAuthToken,
  getAuthConfig,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { password } = (await request.json()) as { password?: string };
    const { password: expectedPassword, secret } = getAuthConfig();

    if (!expectedPassword || !secret) {
      return NextResponse.json(
        {
          message:
            "Authentication is not configured. Set CREATE_PAGE_PASSWORD and JWT_SECRET.",
        },
        { status: 500 }
      );
    }

    if (!password || password !== expectedPassword) {
      return NextResponse.json(
        { message: "Invalid password." },
        { status: 401 }
      );
    }

    const token = createAuthToken(secret);

    const response = NextResponse.json(
      { message: "Authenticated successfully.", token },
      { status: 200 }
    );

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error("Failed to authenticate create page:", error);
    return NextResponse.json(
      { message: "Failed to authenticate." },
      { status: 500 }
    );
  }
}
