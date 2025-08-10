import { Client as WorkflowClient } from "@upstash/workflow"
import { Client as QStashClient } from "@upstash/qstash";
import config from "@/lib/config"

export const workflowClient=new WorkflowClient({
        baseUrl: config.env.upstash.qstashUrl,
        token: config.env.upstash.qstashToken
})

const qstashClient = new QStashClient({
        token: config.env.upstash.qstashToken,
});

export const sendEmail = async ({
    email,
    name,}:
 {
    email: string;
    name: string;
}) => {
    await qstashClient.publishJSON({
        url: "https://api.emailjs.com/api/v1.0/email/send",
        body: {
            service_id: config.env.emailjsServiceId, // e.g. service_xxx
            template_id: config.env.emailjsTemplateId, // e.g. template_xxx
            user_id: config.env.emailjsPublicKey, // your Public Key
            template_params: {
                name, // for {{name}}
                email, // for {{email}}
            },
        },
        headers: {
            "Content-Type": "application/json",
        },
    });
};
