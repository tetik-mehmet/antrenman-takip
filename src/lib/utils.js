export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  ADMIN: "/admin",
  USER: "/user",
};
