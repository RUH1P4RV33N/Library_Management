import { serve } from "@upstash/workflow/nextjs";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/workflow";

type UserState = "active" | "non-active";

type InitialData = {
    email: string;
    fullName: string;
};

const ONE_DAY = 60 * 60 * 24; // seconds
const THREE_DAYS = ONE_DAY * 3;
const THIRTY_DAYS = ONE_DAY * 30;

const getUserState = async (email: string): Promise<UserState> => {
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (user.length === 0 || !user[0].lastActivityDate) return "non-active";

    const lastActivityDate = new Date(user[0].lastActivityDate);
    const diffDays = (Date.now() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24);

    return diffDays > 3 ? "non-active" : "active";
};

export const { POST } = serve<InitialData>(async (context) => {
    const { email, fullName } = context.requestPayload;

    // Day 0: Welcome email
    await context.run("welcome-email", async () => {
        await sendEmail({ email, name: fullName });
    });

    // Wait 3 days
    await context.sleep("wait-3-days", THREE_DAYS);

    // Day 3: Check status
    const stateAfter3Days = await context.run("check-3-days", async () => {
        return getUserState(email);
    });

    if (stateAfter3Days === "non-active") {
        await context.run("send-reminder-3-days", async () => {
            await sendEmail({ email, name: fullName });
        });
    }

    // Wait 30 days from signup (27 more days from now)
    await context.sleep("wait-30-days", THIRTY_DAYS - THREE_DAYS);

    // Day 30: Check status
    const stateAfter30Days = await context.run("check-30-days", async () => {
        return getUserState(email);
    });

    if (stateAfter30Days === "non-active") {
        await context.run("send-reminder-30-days", async () => {
            await sendEmail({ email, name: fullName });
        });
    }
});

// import { serve } from "@upstash/workflow/nextjs"
// import {db} from "@/database/drizzle";
// import {users} from "@/database/schema";
// import {eq} from "drizzle-orm";
// import {sendEmail} from "@/lib/workflow";
// type UserState = "active" | "non-active";
//
//
// type InitialData = {
//     email: string;
//     fullName: string
// };
// const ONE_DAY_IN_MS=24*60*60*1000;
// const THREE_DAYS_IN_MS=3*ONE_DAY_IN_MS;
// const THIRTY_DAYS_IN_MS=30*ONE_DAY_IN_MS;
//
// const getUserState = async (email: string): Promise<UserState> => {
//     const user=await
//         db.select()
//             .from(users)
//             .where(eq(users.email,email))
//             .limit(1);
//     if(user.length===0)
//         return "non-active";
//     const lastActivityDate=new Date(user[0].lastActivityDate!);
//     const currentDate=new Date();
//     const timeDiff=currentDate.getTime()-lastActivityDate.getTime();
//     if(timeDiff>THREE_DAYS_IN_MS&& timeDiff<=THIRTY_DAYS_IN_MS) {
//         return "non-active";
//     }
//     return "active";
// }
//
// export const { POST } = serve<InitialData>(async (context) => {
//     const { email, fullName } = context.requestPayload
//
//     // Welcome email
//     await context.run("new-signup", async () => {
//         await sendEmail({
//             email,
//             name: fullName
//         })
//     })
//
//     await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3)
//
//     while (true) {
//         const state = await context.run("check-user-state", async () => {
//             return await getUserState(email)
//         })
//
//         if (state === "non-active") {
//             await context.run("send-email-non-active", async () => {
//                 await sendEmail({
//                     email,
//                     name: fullName // could be a different template for non-active
//                 })
//             })
//         } else if (state === "active") {
//             await context.run("send-email-active", async () => {
//                 await sendEmail({
//                     email,
//                     name: fullName // could be newsletter or other template
//                 })
//             })
//         }
//
//         await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30)
//     }
// })
//
//
