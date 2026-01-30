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

        const [user, profile, tasks, shortlisted, locked] = await Promise.all([
            prisma.user.findUnique({
                where: { id: userId },
                select: { name: true, email: true }
            }),
            prisma.profile.findUnique({
                where: { userId },
            }),
            prisma.task.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.shortlistedUniversity.findMany({
                where: { userId },
                include: { university: true }
            }),
            prisma.lockedUniversity.findMany({
                where: { userId },
                include: { university: true }
            })
        ]);

        return NextResponse.json({
            user,
            profile,
            tasks,
            shortlisted,
            locked
        }, { status: 200 });

    } catch (error) {
        console.error("Dashboard Data API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
