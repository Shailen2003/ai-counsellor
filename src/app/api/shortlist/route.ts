import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { categorizeUniversity, calculateAcceptanceChance, getFitReason, getRisks } from "@/lib/recommendations";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { universityId, action } = await req.json();
        const userId = (session.user as any).id;

        if (action === "remove") {
            await prisma.shortlistedUniversity.delete({
                where: { userId_universityId: { userId, universityId } }
            });
            return NextResponse.json({ message: "Removed from shortlist" });
        }

        // Get university and profile details for automatic calculation
        const [university, profile] = await Promise.all([
            prisma.university.findUnique({ where: { id: universityId } }),
            prisma.profile.findUnique({ where: { userId } })
        ]);

        if (!university || !profile) {
            return NextResponse.json({ error: "Context missing" }, { status: 400 });
        }

        // Logic from recommendations.ts
        const category = categorizeUniversity(university, profile);
        const acceptanceChance = calculateAcceptanceChance(university, profile);
        const fitReason = getFitReason(university, profile);
        const risks = getRisks(university, profile);

        const shortlist = await prisma.shortlistedUniversity.upsert({
            where: { userId_universityId: { userId, universityId } },
            update: { category, fitReason, risks, acceptanceChance },
            create: { userId, universityId, category, fitReason, risks, acceptanceChance }
        });

        return NextResponse.json({ shortlist }, { status: 200 });

    } catch (error) {
        console.error("Shortlist API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
