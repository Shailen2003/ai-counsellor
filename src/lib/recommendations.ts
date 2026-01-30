export function categorizeUniversity(
    university: any,
    profile: any
): "dream" | "target" | "safe" {
    const gpaMatch = (profile.gpa || 0) >= university.minGPA;
    const budgetMatch = university.tuitionMax <= profile.budgetMax;
    const ieltsMatch = (profile.ieltsScore || 0) >= (university.minIELTS || 0);

    const matchCount = [gpaMatch, budgetMatch, ieltsMatch].filter(Boolean).length;

    // Safe: All requirements met + high acceptance rate
    if (matchCount === 3 && university.acceptanceRate > 30) return "safe";

    // Target: Most requirements met
    if (matchCount >= 2) return "target";

    // Dream: Reach school
    return "dream";
}

export function calculateAcceptanceChance(
    university: any,
    profile: any
): "low" | "medium" | "high" {
    const gpaRatio = (profile.gpa || 0) / university.minGPA;
    const baseRate = university.acceptanceRate;

    // High chance: Above requirements + good acceptance rate
    if (gpaRatio > 1.2 && baseRate > 30) return "high";

    // Medium chance: Meet requirements + decent acceptance rate
    if (gpaRatio >= 1.0 && baseRate > 15) return "medium";

    // Low chance: Below requirements or very competitive
    return "low";
}

export function calculateProfileStrength(profile: any): {
    academicStrength: string;
    examStrength: string;
    sopStrength: string;
} {
    // Academic strength based on GPA
    let academicStrength = "average";
    if (profile.gpa >= 3.7) academicStrength = "strong";
    else if (profile.gpa < 3.0) academicStrength = "weak";

    // Exam strength based on test scores
    let examStrength = "weak";
    if (profile.ieltsStatus === "completed" && profile.ieltsScore >= 7.0) {
        examStrength = "average";
        if (profile.ieltsScore >= 7.5) examStrength = "strong";
    }
    if (profile.greStatus === "completed" && profile.greScore >= 320) {
        examStrength = "strong";
    }

    // SOP strength
    let sopStrength = "weak";
    if (profile.sopStatus === "draft") sopStrength = "average";
    if (profile.sopStatus === "ready") sopStrength = "strong";

    return { academicStrength, examStrength, sopStrength };
}

export function generateInitialTasks(profile: any): any[] {
    const tasks: any[] = [];

    // Exam tasks
    if (profile.ieltsStatus === "not_started") {
        tasks.push({
            title: "Register for IELTS exam",
            description: "Book your IELTS test date. Aim for at least 2-3 months before application deadlines.",
            category: "exam",
            priority: "high",
        });
    }

    if (profile.greStatus === "not_started" && profile.intendedDegree === "Master's") {
        tasks.push({
            title: "Prepare for GRE exam",
            description: "Start GRE preparation. Consider taking a practice test to assess your baseline.",
            category: "exam",
            priority: "high",
        });
    }

    // SOP task
    if (profile.sopStatus === "not_started") {
        tasks.push({
            title: "Start drafting Statement of Purpose",
            description: "Begin writing your SOP. Focus on your academic journey, goals, and why you want to study abroad.",
            category: "document",
            priority: "high",
        });
    }

    // Research task
    tasks.push({
        title: "Research universities and programs",
        description: "Explore universities that match your profile, budget, and career goals.",
        category: "research",
        priority: "medium",
    });

    return tasks;
}

export function getFitReason(university: any, profile: any): string {
    const reasons: string[] = [];

    if (profile.gpa >= university.minGPA) {
        reasons.push(`Your GPA (${profile.gpa}) meets the minimum requirement (${university.minGPA})`);
    }

    if (university.tuitionMax <= profile.budgetMax) {
        reasons.push(`Tuition fits within your budget ($${university.tuitionMin}-${university.tuitionMax})`);
    }

    if (profile.preferredCountries?.includes(university.country)) {
        reasons.push(`Located in your preferred country (${university.country})`);
    }

    if (university.acceptanceRate > 20) {
        reasons.push(`Reasonable acceptance rate (${university.acceptanceRate}%)`);
    }

    return reasons.join(". ");
}

export function getRisks(university: any, profile: any): string {
    const risks: string[] = [];

    if (profile.gpa < university.minGPA) {
        risks.push(`GPA below minimum requirement (need ${university.minGPA}, have ${profile.gpa})`);
    }

    if (university.tuitionMax > profile.budgetMax) {
        risks.push(`Tuition may exceed your budget`);
    }

    if (university.acceptanceRate < 15) {
        risks.push(`Highly competitive (${university.acceptanceRate}% acceptance rate)`);
    }

    if (profile.ieltsScore && university.minIELTS && profile.ieltsScore < university.minIELTS) {
        risks.push(`IELTS score below requirement (need ${university.minIELTS}, have ${profile.ieltsScore})`);
    }

    if (risks.length === 0) {
        return "No major risks identified. Strong fit overall.";
    }

    return risks.join(". ");
}
