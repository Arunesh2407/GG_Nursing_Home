const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  // CORS headers (required for browser requests)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name, mobile, age, gender } = req.body || {};

    if (!name || !mobile) {
      return res.status(400).json({ message: "Missing required fields" });
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
      subject: "New Appointment Booking",
      result: "Appointment Form Submission",
      text: `
New Appointment Received

Name: ${name}
Mobile: ${mobile}
Age: ${age || "N/A"}
Gender: ${gender || "N/A"}
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.error("Appointment API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
