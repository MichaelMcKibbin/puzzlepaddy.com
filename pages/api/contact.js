// /pages/api/contact.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { name, email, message, recaptcha } = req.body;

    // Verify reCAPTCHA
    const verifyResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptcha}`
    });
    
    const verifyData = await verifyResponse.json();
    
    if (!verifyData.success) {
        return res.status(400).json({ message: "reCAPTCHA verification failed" });
    }

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: "paddypost@puzzlepaddy.com",
            subject: `Contact Form: ${name}`,
            text: `From: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `<p><strong>From:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message}</p>`,
            replyTo: email,
        });

        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Email error:", error);
        res.status(500).json({ message: "Failed to send email", error: error.message });
    }
}
