// lib/workflow.ts
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
        // Add email validation
        if (!email || !email.includes('@')) {
            throw new Error('Invalid email address');
        }

        if (!name || name.trim().length === 0) {
            throw new Error('Name is required');
        }

        const response = await workflowClient.publishJSON({
            url: `${config.env.prodApiEndpoint}/api/send-email-queue`,
            body: {
                email: email.toLowerCase().trim(),
                name: name.trim(),
                subject: subject || "Library Management System",
                text: text || "Welcome to Library Management System!"
            },
            headers: {
                "Content-Type": "application/json",
            },
            // Add retry configuration for reliability
            retries: 3,
            delay: "5s" as `${bigint}s`,
        });

        console.log(`Email queued successfully for ${email}:`, response);
        return {
            success: true,
            response: response
        };
    } catch (error) {
        console.error("Failed to queue email:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown error",
        };
    }
};

// Helper function to trigger workflows with better error handling
export const triggerWorkflow = async (
    workflowPath: string,
    payload: any,
    options?: {
        retries?: number;
        delay?: `${bigint}s` | `${bigint}m` | `${bigint}h` | `${bigint}d`;
    }
) => {
    try {
        const response = await workflowClient.publishJSON({
            url: `${config.env.prodApiEndpoint}/api/workflows/${workflowPath}`,
            body: payload,
            headers: {
                "Content-Type": "application/json",
            },
            retries: options?.retries || 2,
            delay: options?.delay || ("3s" as `${bigint}s`),
        });

        console.log(`Workflow ${workflowPath} triggered:`, response);
        return {
            success: true,
            response: response
        };
    } catch (error) {
        console.error(`Failed to trigger workflow ${workflowPath}:`, error);
        throw error;
    }
};