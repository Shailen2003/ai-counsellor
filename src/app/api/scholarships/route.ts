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

        const [profile, scholarships] = await Promise.all([
            prisma.profile.findUnique({ where: { userId } }),
            prisma.scholarship.findMany()
        ]);

        if (!profile) {
            return NextResponse.json({ scholarships: [], message: "Complete profile first" }, { status: 200 });
        }

        // Calculate custom match index for each scholarship
        const scholarshipsWithMatch = scholarships.map((schol: any) => {
            let score = 0;

            // 1. Country Alignment (40%)
            // If scholarship is "Global" or country matches preferred countries, max score.
            // If country is in preferred countries list, add 40 points.
            const preferredCountries = profile.preferredCountries || [];
            const countryMatches = schol.country.toLowerCase() === "global" ||
                preferredCountries.some((c: string) => c.toLowerCase() === schol.country.toLowerCase());
            
            if (countryMatches) {
                score += 40;
            } else {
                score += 10; // partial match for other countries since they are still accessible
            }

            // 2. Merit/GPA Alignment (30%)
            // Parse GPA requirement if any in eligibility
            const userGPA = profile.gpa || 0.0;
            let gpaRequirement = 0.0;

            const gpaMatch = schol.eligibility.match(/gpa\s*([0-9]\.[0-9])/i);
            if (gpaMatch) {
                gpaRequirement = parseFloat(gpaMatch[1]);
            }

            if (gpaRequirement > 0.0) {
                if (userGPA >= gpaRequirement) {
                    score += 30;
                } else if (userGPA >= gpaRequirement - 0.3) {
                    score += 15; // partial points
                } else {
                    score += 5;
                }
            } else {
                score += 30; // no explicit GPA bar, free points
            }

            // 3. Funding / Type Alignment (30%)
            // Need-based matches with user fundingPlan being 'loan' or 'scholarship'
            // Merit-based matches with strong GPA or selected merit plan
            if (schol.type === "need-based") {
                if (profile.fundingPlan === "loan" || profile.fundingPlan === "scholarship") {
                    score += 30;
                } else {
                    score += 10;
                }
            } else if (schol.type === "merit") {
                if (userGPA >= 3.5 || profile.fundingPlan === "scholarship") {
                    score += 30;
                } else {
                    score += 15;
                }
            } else {
                score += 25; // standard points for global or general type
            }

            return {
                ...schol,
                matchScore: Math.round(score),
                gpaRequirement: gpaRequirement > 0.0 ? gpaRequirement : null
            };
        });

        // Sort descending by match score
        scholarshipsWithMatch.sort((a: any, b: any) => b.matchScore - a.matchScore);

        return NextResponse.json({ scholarships: scholarshipsWithMatch }, { status: 200 });

    } catch (error) {
        console.error("Scholarship Recommendations API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
