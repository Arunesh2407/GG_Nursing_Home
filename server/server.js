console.log("server.js started");

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/* Test route */
app.get("/", (req, res) => {
  res.send("Hospital backend running");
});

/* Appointment API */
app.post("/api/appointment", async (req, res) => {
  const { name, mobile, age, gender } = req.body;

  if (!name || !mobile || !age || !gender) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "arshmbbs1705@gmail.com",
      subject: "New Appointment Request",
      text: `
New Appointment Details:

Name: ${name}
Mobile: ${mobile}
Age: ${age}
Gender: ${gender}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Appointment request sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send email" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
