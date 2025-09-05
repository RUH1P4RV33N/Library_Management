// app/api/send-email-queue/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { email, name, subject, text } = await req.json();

        // Input validation
        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { success: false, error: "Invalid email address" },
                { status: 400 }
            );
        }

        if (!name || name.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: "Name is required" },
                { status: 400 }
            );
        }

        // Validate required environment variables
        if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.error("Missing SMTP configuration");
            return NextResponse.json(
                { success: false, error: "Email service not configured" },
                { status: 500 }
            );
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false, // Use TLS
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            // Add some additional options for reliability
            connectionTimeout: 60000, // 60 seconds
            greetingTimeout: 30000, // 30 seconds
            socketTimeout: 60000, // 60 seconds
        });

        // Verify transporter configuration
        await transporter.verify();

        const mailOptions = {
            from: `"Library Management System" <${process.env.SMTP_USER}>`,
            to: email.toLowerCase().trim(),
            subject: subject || "Library Management System",
            text: text || "Welcome to Library Management System!",
            // Add HTML version for better formatting
            html: text ? text.replace(/\n/g, '<br>') : "Welcome to Library Management System!",
        };

        const info = await transporter.sendMail(mailOptions);

        console.log(`Email sent to ${email}:`, info.messageId);

        return NextResponse.json({
            success: true,
            messageId: info.messageId
        });

    } catch (err: any) {
        console.error("SMTP send error:", err);

        // Return different error messages based on error type
        let errorMessage = "Failed to send email";

        if (err.code === 'EAUTH') {
            errorMessage = "Authentication failed";
        } else if (err.code === 'ECONNECTION') {
            errorMessage = "Connection failed";
        } else if (err.responseCode === 550) {
            errorMessage = "Invalid recipient email";
        }

        return NextResponse.json(
            {
                success: false,
                error: errorMessage,
                details: process.env.NODE_ENV === 'development' ? err.message : undefined
            },
            { status: 500 }
        );
    }
}