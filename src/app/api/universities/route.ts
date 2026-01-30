import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;

        // Get all universities and check if they are shortlisted by the user
        const [universities, shortlisted] = await Promise.all([
            prisma.university.findMany({
                orderBy: { ranking: 'asc' }
            }),
            prisma.shortlistedUniversity.findMany({
                where: { userId },
                select: { universityId: true }
            })
        ]);

        const shortlistedIds = new Set(shortlisted.map((s: any) => s.universityId));

        const universitiesWithStatus = universities.map((u: any) => ({
            ...u,
            isShortlisted: shortlistedIds.has(u.id)
        }));

        return NextResponse.json({ universities: universitiesWithStatus }, { status: 200 });

    } catch (error) {
        console.error("Universities API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
