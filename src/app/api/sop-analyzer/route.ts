import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { analyzeSOPWithGemini } from "@/lib/gemini";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { sopText } = await req.json();
        const userId = (session.user as any).id;

        if (!sopText || sopText.trim().length < 50) {
            return NextResponse.json(
                { error: "SOP text is too short. Please paste at least a paragraph (minimum 50 characters)." },
                { status: 400 }
            );
        }

        // Fetch user profile and locked universities
        const [profile, lockedUnis] = await Promise.all([
            prisma.profile.findUnique({ where: { userId } }),
            prisma.lockedUniversity.findMany({
                where: { userId },
                include: { university: true }
            })
        ]);

        if (!profile) {
            return NextResponse.json(
                { error: "Please complete your onboarding profile before analyzing your SOP." },
                { status: 400 }
            );
        }

        // Run Gemini Analysis
        const analysis = await analyzeSOPWithGemini(sopText, profile, lockedUnis);

        // Update SOP Strength in profile based on score
        let sopStrength = "weak";
        if (analysis.score >= 80) sopStrength = "strong";
        else if (analysis.score >= 55) sopStrength = "average";

        await prisma.profile.update({
            where: { userId },
            data: { sopStrength, sopStatus: "draft" }
        });

        // Automatically create recommended tasks in the database!
        if (analysis.tasks && Array.isArray(analysis.tasks)) {
            for (const task of analysis.tasks) {
                await prisma.task.create({
                    data: {
                        userId,
                        title: task.title,
                        description: task.description,
                        category: "document",
                        priority: task.priority || "medium",
                    }
                });
            }
        }

        return NextResponse.json({ analysis }, { status: 200 });

    } catch (error) {
        console.error("SOP Analyzer API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
