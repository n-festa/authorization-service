export class VerifyReCaptchaResponse {
  success: boolean; // true|false
  challenge_ts: number; // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
  apk_package_name: string; // the package name of the app where the reCAPTCHA was solved
  // error-codes: string[]; // optional
}
