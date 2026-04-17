import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// email route
app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // mail to you
    await transporter.sendMail({
      from: `"Portfolio Contact System" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📩 New Project Inquiry from ${name}`,
      html: `
  <div style="font-family: Arial, sans-serif; background:#f9f9f9; padding:30px;">

    <div style="max-width:650px; margin:auto; background:#ffffff; border-radius:12px; padding:30px; border:1px solid #eee;">

      <h2 style="color:#FF8C69; margin-bottom:5px;">
        📬 New Contact Request
      </h2>

      <p style="color:#666; margin-top:0;">
        You’ve received a new message from your portfolio website.
      </p>

      <div style="margin:20px 0; padding:15px; background:#FFF1E6; border-radius:8px;">
        <p style="margin:5px 0;"><b>👤 Name:</b> ${name}</p>
        <p style="margin:5px 0;"><b>📧 Email:</b> ${email}</p>
      </div>

      <div style="margin-top:20px;">
        <h3 style="color:#5A2E1B;">💬 Message</h3>
        <div style="padding:15px; background:#f7f7f7; border-radius:8px; color:#333; line-height:1.6;">
          ${message}
        </div>
      </div>

      <div style="margin-top:25px; padding:15px; border-left:4px solid #FF8C69; background:#fff8f4;">
        <p style="margin:0; color:#5A2E1B;">
          ⚡ <strong>Action Required:</strong> Reply to this client within 24 hours for best conversion rate.
        </p>
      </div>

      <hr style="margin:30px 0; border:none; border-top:1px solid #eee;" />

      <p style="font-size:13px; color:#888;">
        Sent automatically from your Portfolio Contact System 🚀
      </p>

    </div>

  </div>
  `,
    });

    // auto reply
    await transporter.sendMail({
      from: `"Fuad | Web Developer" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thanks for reaching out 🚀",
      html: `
  <div style="font-family: Arial, sans-serif; background:#f9f9f9; padding:30px;">
    
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:12px; padding:30px; border:1px solid #eee;">
      
      <h2 style="color:#FF8C69; margin-bottom:10px;">
        👋 Hi ${name},
      </h2>

      <p style="color:#444; line-height:1.6;">
        Thank you for reaching out! I’ve received your message and really appreciate you taking the time to contact me.
      </p>

      <p style="color:#444; line-height:1.6;">
        I’ll review your message and get back to you within a few hours with the next steps.
      </p>

      <div style="margin:25px 0; padding:15px; background:#FFF1E6; border-radius:8px;">
        <p style="margin:0; color:#5A2E1B;">
          🚀 <strong>What happens next?</strong>
        </p>
        <ul style="margin-top:10px; color:#5A2E1B;">
          <li>I review your project details</li>
          <li>I may ask a few clarifying questions</li>
          <li>We discuss timeline & pricing</li>
        </ul>
      </div>

      <p style="color:#444; line-height:1.6;">
        If your project is urgent, feel free to reply directly to this email.
      </p>

      <hr style="margin:30px 0; border:none; border-top:1px solid #eee;" />

      <p style="color:#777; font-size:14px;">
        Best regards,<br/>
        <strong style="color:#333;">Md Fuad Amir</strong><br/>
        Mern Stack Web Developer
      </p>

    </div>

    <p style="text-align:center; margin-top:20px; font-size:12px; color:#aaa;">
      © ${new Date().getFullYear()} Md Fuad Amir. All rights reserved.
    </p>

  </div>
  `,
    });

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

if (process.env.VERCEL !== "1") {
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
}

export default app;
