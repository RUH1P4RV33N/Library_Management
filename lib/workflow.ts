import { Client } from "@upstash/qstash";
import config from "@/lib/config";

export const workflowClient = new Client({
    token: config.env.upstash.qstashToken,
});

export const sendEmail = async ({
                                    email,
                                    name,
                                    subject,
                                    text,
                                }: {
    email: string;
    name: string;
    subject?: string;
    text?: string;
}) => {
    try {
        await workflowClient.publishJSON({
            url: `${config.env.prodApiEndpoint}api/send-email-queue`,
            body: { email, name, subject, text },
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log(`Queued email for ${email}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to queue email:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown error",
        };
    }
};
