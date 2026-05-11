import { createHmac, timingSafeEqual } from "crypto";

export const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "create_auth_token";

type JwtPayload = {
  sub: string;
  iat: number;
  exp: number;
};

function base64UrlEncode(input: string) {
  return Buffer.from(input).toString("base64url");
}

function base64UrlDecode(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function sign(input: string, secret: string) {
  return createHmac("sha256", secret).update(input).digest("base64url");
}

export function createAuthToken(secret: string, expiresInSeconds = 60 * 60 * 8) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const payload: JwtPayload = {
    sub: "create-page",
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(`${encodedHeader}.${encodedPayload}`, secret);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyAuthToken(token: string, secret: string) {
  const [encodedHeader, encodedPayload, receivedSignature] = token.split(".");

  if (!encodedHeader || !encodedPayload || !receivedSignature) {
    return false;
  }

  const expectedSignature = sign(`${encodedHeader}.${encodedPayload}`, secret);

  const receivedBuffer = Buffer.from(receivedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (receivedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  if (!timingSafeEqual(receivedBuffer, expectedBuffer)) {
    return false;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as JwtPayload;
    const now = Math.floor(Date.now() / 1000);

    return payload.sub === "create-page" && payload.exp > now;
  } catch {
    return false;
  }
}

export function getAuthConfig() {
  const password =
    process.env.CREATE_PAGE_PASSWORD ?? process.env.AUTH_PASSWORD_ENV;
  const secret = process.env.JWT_SECRET ?? process.env.JWT_SECRET_ENV;

  return {
    password,
    secret,
  };
}
