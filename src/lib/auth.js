import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const isProd = process.env.NODE_ENV === "production";
const COOKIE_NAME = "token";

if (!JWT_SECRET && typeof window === "undefined") {
  console.warn("JWT_SECRET ortam değişkeni tanımlanmalıdır.");
}

export function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET || "fallback-dev-secret", {
    expiresIn: "7d",
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET || "fallback-dev-secret");
  } catch {
    return null;
  }
}

export function setAuthCookie(response, token) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function removeAuthCookie(response) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function getTokenFromCookie(cookieHeader) {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(";").map((c) => c.trim());
  const tokenCookie = cookies.find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!tokenCookie) return null;
  return tokenCookie.slice(COOKIE_NAME.length + 1);
}

export function getAuthFromRequest(request) {
  const cookieHeader = request.headers.get("cookie");
  const token = getTokenFromCookie(cookieHeader);
  if (!token) return { userId: null, role: null, email: null, name: null };
  const decoded = verifyToken(token);
  if (!decoded) return { userId: null, role: null, email: null, name: null };
  return {
    userId: decoded.userId,
    role: decoded.role,
    email: decoded.email,
    name: decoded.name ?? null,
  };
}

export function getAuthFromCookies(cookieStore) {
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return { userId: null, role: null, email: null, name: null };
  const decoded = verifyToken(token);
  if (!decoded) return { userId: null, role: null, email: null, name: null };
  return {
    userId: decoded.userId,
    role: decoded.role,
    email: decoded.email,
    name: decoded.name ?? null,
  };
}

export { COOKIE_NAME };
