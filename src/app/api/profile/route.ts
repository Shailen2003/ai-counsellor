import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { generateInitialTasks, calculateProfileStrength } from "@/lib/recommendations";


export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const userId = (session.user as any).id;

        // Basic validation
        const requiredFields = [
            "educationLevel",
            "degree",
            "major",
            "graduationYear",
            "intendedDegree",
            "fieldOfStudy",
            "targetIntakeYear",
            "preferredCountries",
            "budgetMin",
            "budgetMax",
            "fundingPlan",
            "ieltsStatus",
            "greStatus",
            "sopStatus",
        ];

        for (const field of requiredFields) {
            if (data[field] === undefined || data[field] === null) {
                return NextResponse.json(
                    { error: `Missing field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Calculate strength
        const strength = calculateProfileStrength(data);

        // Upsert profile
        const profile = await prisma.profile.upsert({
            where: { userId },
            update: {
                educationLevel: data.educationLevel,
                degree: data.degree,
                major: data.major,
                graduationYear: parseInt(data.graduationYear),
                gpa: data.gpa ? parseFloat(data.gpa) : null,
                intendedDegree: data.intendedDegree,
                fieldOfStudy: data.fieldOfStudy,
                targetIntakeYear: parseInt(data.targetIntakeYear),
                preferredCountries: data.preferredCountries,
                budgetMin: parseInt(data.budgetMin),
                budgetMax: parseInt(data.budgetMax),
                fundingPlan: data.fundingPlan,
                ieltsStatus: data.ieltsStatus,
                ieltsScore: data.ieltsScore ? parseFloat(data.ieltsScore) : null,
                greStatus: data.greStatus,
                greScore: data.greScore ? parseInt(data.greScore) : null,
                sopStatus: data.sopStatus,
                academicStrength: strength.academicStrength,
                examStrength: strength.examStrength,
                sopStrength: strength.sopStrength,
                isComplete: true,
            },
            create: {
                userId,
                educationLevel: data.educationLevel,
                degree: data.degree,
                major: data.major,
                graduationYear: parseInt(data.graduationYear),
                gpa: data.gpa ? parseFloat(data.gpa) : null,
                intendedDegree: data.intendedDegree,
                fieldOfStudy: data.fieldOfStudy,
                targetIntakeYear: parseInt(data.targetIntakeYear),
                preferredCountries: data.preferredCountries,
                budgetMin: parseInt(data.budgetMin),
                budgetMax: parseInt(data.budgetMax),
                fundingPlan: data.fundingPlan,
                ieltsStatus: data.ieltsStatus,
                ieltsScore: data.ieltsScore ? parseFloat(data.ieltsScore) : null,
                greStatus: data.greStatus,
                greScore: data.greScore ? parseInt(data.greScore) : null,
                sopStatus: data.sopStatus,
                academicStrength: strength.academicStrength,
                examStrength: strength.examStrength,
                sopStrength: strength.sopStrength,
                isComplete: true,
            },
        });

        // Generate initial tasks if it's the first time
        const existingTasks = await prisma.task.count({ where: { userId } });
        if (existingTasks === 0) {
            const initialTasks = generateInitialTasks(data);
            await prisma.task.createMany({
                data: initialTasks.map(t => ({ ...t, userId }))
            });
        }


        return NextResponse.json({ profile }, { status: 200 });
    } catch (error) {
        console.error("Profile API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;

        const profile = await prisma.profile.findUnique({
            where: { userId },
        });

        return NextResponse.json({ profile }, { status: 200 });
    } catch (error) {
        console.error("Profile GET Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
