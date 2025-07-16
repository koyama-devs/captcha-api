export default async function handler(req: any, res: any) {
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
