// app/api/workflows/onboarding/route.ts
import { serve } from "@upstash/workflow/nextjs";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import nodemailer from "nodemailer";

type UserState = "active" | "non-active";

type InitialData = {
    email: string;
    fullName: string;
};

// Email templates
enum EmailTemplate {
    WELCOME = "welcome",
    REMINDER_3_DAYS = "reminder_3_days",
    REMINDER_30_DAYS = "reminder_30_days"
}

const ONE_DAY = 60 * 60 * 24; // seconds
const THREE_DAYS = ONE_DAY * 3;
const THIRTY_DAYS = ONE_DAY * 30;

const getUserState = async (email: string): Promise<UserState> => {
    try {
        const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (user.length === 0 || !user[0].lastActivityDate) {
            return "non-active";
        }

        const lastActivityDate = new Date(user[0].lastActivityDate);
        const diffDays = (Date.now() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24);

        return diffDays > 3 ? "non-active" : "active";
    } catch (error) {
        console.error("Error checking user state:", error);
        return "non-active";
    }
};

const getEmailContent = (template: EmailTemplate, fullName: string) => {
    const configs = {
        [EmailTemplate.WELCOME]: {
            subject: `Welcome to Library Management, ${fullName}!`,
            text: `Hi ${fullName},\n\nWelcome to our Library Management System! We're excited to have you on board.\n\nYou can now:\n• Browse our extensive book collection\n• Reserve books online\n• Track your borrowing history\n• Get notifications for due dates\n\nHappy reading!\n\nBest regards,\nLibrary Management Team`
        },
        [EmailTemplate.REMINDER_3_DAYS]: {
            subject: `Don't forget to explore our library, ${fullName}!`,
            text: `Hi ${fullName},\n\nWe noticed you haven't explored our library system yet. Don't miss out on:\n\n• Thousands of books waiting to be discovered\n• Easy online reservation system\n• Personalized book recommendations\n\nStart your reading journey today!\n\nBest regards,\nLibrary Management Team`
        },
        [EmailTemplate.REMINDER_30_DAYS]: {
            subject: `We miss you at the library, ${fullName}!`,
            text: `Hi ${fullName},\n\nIt's been a while since we've seen you! Our library has been updated with:\n\n• New book arrivals\n• Enhanced search features\n• Digital reading options\n• Study room booking system\n\nCome back and see what's new!\n\nBest regards,\nLibrary Management Team`
        }
    };
    return configs[template];
};

const sendEmailDirect = async (
    email: string,
    fullName: string,
    template: EmailTemplate
) => {
    try {
        console.log(`Preparing to send ${template} email to ${email}`);

        const config = getEmailContent(template, fullName);

        // Validate environment variables
        if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
            throw new Error("Missing SMTP configuration");
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            connectionTimeout: 60000,
            greetingTimeout: 30000,
            socketTimeout: 60000,
        });

        const mailOptions = {
            from: `"Library Management System" <${process.env.SMTP_USER}>`,
            to: email.toLowerCase().trim(),
            subject: config.subject,
            text: config.text,
            html: config.text.replace(/\n/g, '<br>'),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ ${template} email sent to ${email}:`, info.messageId);

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error(`❌ Failed to send ${template} email to ${email}:`, error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
};

export const { POST } = serve<InitialData>(async (context) => {
    const { email, fullName } = context.requestPayload;

    try {
        console.log(`🚀 Starting onboarding workflow for ${email}`);

        // Day 0: Welcome email
        await context.run("welcome-email", async () => {
            const result = await sendEmailDirect(email, fullName, EmailTemplate.WELCOME);
            if (result.success) {
                console.log(`📧 Welcome email sent to ${email}`);
            } else {
                console.error(`❌ Welcome email failed for ${email}:`, result.error);
            }
            return result;
        });

        console.log(`⏳ Waiting 3 days for user ${email}...`);
        // Wait 3 days
        await context.sleep("wait-3-days", THREE_DAYS);

        // Day 3: Check status and send reminder if needed
        const stateAfter3Days = await context.run("check-3-days", async () => {
            const state = await getUserState(email);
            console.log(`📊 User ${email} state after 3 days: ${state}`);
            return state;
        });

        if (stateAfter3Days === "non-active") {
            await context.run("send-reminder-3-days", async () => {
                const result = await sendEmailDirect(email, fullName, EmailTemplate.REMINDER_3_DAYS);
                if (result.success) {
                    console.log(`📧 3-day reminder sent to ${email}`);
                } else {
                    console.error(`❌ 3-day reminder failed for ${email}:`, result.error);
                }
                return result;
            });
        } else {
            console.log(`✅ User ${email} is active after 3 days, skipping reminder`);
        }

        console.log(`⏳ Waiting 27 more days for user ${email}...`);
        // Wait 27 more days to reach 30 days total
        await context.sleep("wait-27-more-days", THIRTY_DAYS - THREE_DAYS);

        // Day 30: Check status and send final reminder if needed
        const stateAfter30Days = await context.run("check-30-days", async () => {
            const state = await getUserState(email);
            console.log(`📊 User ${email} state after 30 days: ${state}`);
            return state;
        });

        if (stateAfter30Days === "non-active") {
            await context.run("send-reminder-30-days", async () => {
                const result = await sendEmailDirect(email, fullName, EmailTemplate.REMINDER_30_DAYS);
                if (result.success) {
                    console.log(`📧 30-day reminder sent to ${email}`);
                } else {
                    console.error(`❌ 30-day reminder failed for ${email}:`, result.error);
                }
                return result;
            });
        } else {
            console.log(`✅ User ${email} is active after 30 days, skipping final reminder`);
        }

        console.log(`🎉 Onboarding workflow completed for ${email}`);

    } catch (error) {
        console.error(`💥 Onboarding workflow failed for ${email}:`, error);
        throw error;
    }
});