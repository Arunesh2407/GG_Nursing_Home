import nodemailer from "nodemailer";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, message: "Method not allowed" });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const { name, phone, email, department, doctor, date, time, message } =
      body || {};

    if (!name || !phone) {
      return res.status(400).json({ ok: false, message: "Missing fields" });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"GG Nursing Home" <${process.env.EMAIL_USER}>`,
      to: process.env.TO_EMAIL || process.env.EMAIL_USER,
      subject: `New Appointment: ${name}`,
      text:
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Email: ${email || "-"}\n` +
        `Department: ${department || "-"}\n` +
        `Doctor: ${doctor || "-"}\n` +
        `Date: ${date || "-"}\n` +
        `Time: ${time || "-"}\n\n` +
        `Message:\n${message || "-"}`,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Appointment API error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
