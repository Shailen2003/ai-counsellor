import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getCounsellorResponse, parseActionsFromResponse } from "@/lib/gemini";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { message, history } = await req.json();
        const userId = (session.user as any).id;

        // 1. Get Context
        const [profile, shortlisted, locked, universities] = await Promise.all([
            prisma.profile.findUnique({ where: { userId } }),
            prisma.shortlistedUniversity.findMany({ where: { userId }, include: { university: true } }),
            prisma.lockedUniversity.findMany({ where: { userId }, include: { university: true } }),
            prisma.university.findMany({ take: 10 }) // Limit for context size
        ]);

        if (!profile) {
            return NextResponse.json({
                message: "It looks like you haven't completed your onboarding yet. Please do that first so I can give you personalized advice!",
                actions: []
            });
        }

        // 2. Prepare Context for Gemini
        // We enhance the profile with university IDs for matching
        const context = {
            profile,
            stage: profile.currentStage,
            shortlisted,
            locked,
            availableUniversities: universities.map((u: any) => ({ id: u.id, name: u.name, country: u.country }))
        };

        // 3. Get AI Response
        const aiResponse = await getCounsellorResponse(message, context);
        const actions = parseActionsFromResponse(aiResponse);

        // 4. Clean message (remove JSON blocks)
        let cleanMessage = aiResponse.replace(/\{[\s\S]*?"action"[\s\S]*?\}/g, '').trim();

        // 5. Execute Actions
        const executedActions = [];
        for (const action of actions) {
            try {
                if (action.action === "shortlist_university") {
                    const { universityId, category, fitReason, risks, acceptanceChance } = action.data;
                    await prisma.shortlistedUniversity.upsert({
                        where: { userId_universityId: { userId, universityId } },
                        update: { category, fitReason, risks, acceptanceChance },
                        create: { userId, universityId, category, fitReason, risks, acceptanceChance }
                    });
                    executedActions.push(action);
                } else if (action.action === "create_task") {
                    const { title, description, category, priority } = action.data;
                    await prisma.task.create({
                        data: { userId, title, description, category, priority }
                    });
                    executedActions.push(action);
                } else if (action.action === "lock_university") {
                    const { universityId, program } = action.data;
                    await prisma.lockedUniversity.create({
                        data: { userId, universityId, program }
                    });
                    // Update stage to preparing applications
                    await prisma.profile.update({
                        where: { userId },
                        data: { currentStage: 'preparing_applications' }
                    });
                    executedActions.push(action);
                }
            } catch (e) {
                console.error("Action execution failed:", e);
            }
        }

        // 6. Return response
        return NextResponse.json({
            message: cleanMessage || "Action completed.",
            actions: executedActions
        });

    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
