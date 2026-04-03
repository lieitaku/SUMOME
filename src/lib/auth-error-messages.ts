/**
 * Supabase Auth の英語エラーメッセージを日本語に変換
 */
export function authErrorToJapanese(message: string): string {
  const msg = message.toLowerCase();
  if (
    msg.includes("already been registered") ||
    msg.includes("user already registered") ||
    msg.includes("already exists")
  ) {
    return "このメールアドレスは既に登録されています。";
  }
  if (msg.includes("invalid login credentials")) {
    return "メールアドレスまたはパスワードが正しくありません。";
  }
  if (msg.includes("email not confirmed")) {
    return "メールアドレスの確認が完了していません。受信トレイを確認してください。";
  }
  if (msg.includes("password") && msg.includes("at least")) {
    return "パスワードは8文字以上で入力してください。";
  }
  if (msg.includes("signup requires a valid password")) {
    return "有効なパスワードを入力してください。";
  }
  if (msg.includes("missing email") || msg.includes("email is required")) {
    return "メールアドレスを入力してください。";
  }
  if (msg.includes("invalid email")) {
    return "有効なメールアドレスを入力してください。";
  }
  // 未知のエラーは汎用メッセージ
  return "エラーが発生しました。もう一度お試しください。";
}

/** ログイン用：汎用エラー時に「ログインに失敗」と表示 */
export function loginErrorToJapanese(message: string): string {
  const result = authErrorToJapanese(message);
  if (result === "エラーが発生しました。もう一度お試しください。") {
    return "ログインに失敗しました。もう一度お試しください。";
  }
  return result;
}

export function authErrorToEnglish(message: string): string {
  const msg = message.toLowerCase();
  if (
    msg.includes("already been registered") ||
    msg.includes("user already registered") ||
    msg.includes("already exists")
  ) {
    return "This email is already registered.";
  }
  if (msg.includes("invalid login credentials")) {
    return "Invalid email or password.";
  }
  if (msg.includes("email not confirmed")) {
    return "Please confirm your email. Check your inbox.";
  }
  if (msg.includes("password") && msg.includes("at least")) {
    return "Password must be at least 8 characters.";
  }
  if (msg.includes("signup requires a valid password")) {
    return "Please enter a valid password.";
  }
  if (msg.includes("missing email") || msg.includes("email is required")) {
    return "Email is required.";
  }
  if (msg.includes("invalid email")) {
    return "Please enter a valid email address.";
  }
  return "Something went wrong. Please try again.";
}

export function loginErrorToEnglish(message: string): string {
  const result = authErrorToEnglish(message);
  if (result === "Something went wrong. Please try again.") {
    return "Login failed. Please try again.";
  }
  return result;
}

export function loginErrorForLocale(message: string, locale: string): string {
  return locale === "en" ? loginErrorToEnglish(message) : loginErrorToJapanese(message);
}
