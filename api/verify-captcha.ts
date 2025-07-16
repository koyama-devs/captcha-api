// Vercel Function: xử lý xác thực reCAPTCHA token
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = req.body.token;
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!token) {
    return res.status(400).json({ success: false, error: "Missing token" });
  }

  const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${secret}&response=${token}`,
  });

  const data = await verifyRes.json();

  if (data.success) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(403).json({ success: false, error: "CAPTCHA verification failed" });
  }
}
