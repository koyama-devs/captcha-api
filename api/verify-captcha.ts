import type { NextApiRequest, NextApiResponse } from "next";

const allowedOrigins = [
  "https://lxtechno.com",
  "https://www.lxtechno.com",
  // bạn thêm domain frontend nếu cần
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const origin = req.headers.origin;

  // Kiểm tra origin có trong whitelist không, nếu có thì set header, nếu không có thì không
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "null");
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    // Preflight response
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const token = req.body.token;
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!token || !secret) {
    return res.status(400).json({ success: false, error: "Missing token or secret" });
  }

  try {
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
  } catch (err) {
    console.error("CAPTCHA verify error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}
