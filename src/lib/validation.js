const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export function validateEmail(email) {
  if (!email || typeof email !== "string") return false;
  return EMAIL_REGEX.test(email.trim());
}

export function validatePassword(password) {
  if (!password || typeof password !== "string") return false;
  return password.length >= MIN_PASSWORD_LENGTH;
}

export function validateRegisterBody(body) {
  const { email, password, name } = body;
  const trimmedName =
    name != null && typeof name === "string" ? name.trim() : "";
  if (!trimmedName) return { ok: false, message: "İsim alanı zorunludur." };
  if (!validateEmail(email))
    return { ok: false, message: "Geçerli bir e-posta girin." };
  if (!validatePassword(password))
    return { ok: false, message: "Şifre en az 6 karakter olmalıdır." };
  return {
    ok: true,
    email: email.trim().toLowerCase(),
    password,
    name: trimmedName,
  };
}

export function validateLoginBody(body) {
  const { email, password } = body;
  if (!email || !password)
    return { ok: false, message: "E-posta ve şifre gerekli." };
  return { ok: true, email: email.trim().toLowerCase(), password };
}
