

import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    const { email, name, subject, text } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST, // e.g. smtp.gmail.com
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false, // true if port is 465
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: `"${name}" <${process.env.SMTP_USER}>`,
            to: email,
            subject: subject || "No subject",
            text: text || "",
        });

        console.log(`Email sent to ${email}`);
        res.status(200).json({ success: true });
    } catch (err: any) {
        console.error("SMTP send error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
}
