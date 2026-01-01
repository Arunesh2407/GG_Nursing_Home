import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  try {
    const { name, phone, email, department, doctor, date, time, message } =
      req.body || {};

    if (!name || !phone) {
      return res.status(400).json({ ok: false });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
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
  } catch (e) {
    return res.status(500).json({ ok: false });
  }
}
