/**
 * Match Probability Engine
 * Calculates a 'Fit Score' between a User Profile and a University.
 */

export interface UserProfile {
    educationLevel: string;
    gpa?: string;
    budgetMax?: string;
    ieltsScore?: string;
    greScore?: string;
}

export interface UniversityData {
    minGPA: number;
    tuitionMax: number;
    acceptanceRate: number;
    ranking?: number;
}

export function calculateMatchScore(profile: UserProfile, uni: UniversityData): number {
    let score = 70; // Base score

    if (!profile) return 50; // Neutral if no profile

    // 1. GPA Check (Weighted 25%)
    if (profile.gpa && uni.minGPA) {
        const userGpa = parseFloat(profile.gpa);
        if (userGpa >= uni.minGPA) {
            score += 15;
        } else if (userGpa < uni.minGPA - 0.5) {
            score -= 20;
        }
    }

    // 2. Budget Check (Weighted 25%)
    if (profile.budgetMax) {
        const userMax = parseFloat(profile.budgetMax);
        if (userMax >= uni.tuitionMax) {
            score += 10;
        } else if (userMax < uni.tuitionMax * 0.8) {
            score -= 15;
        }
    }

    // 3. Acceptance Rate Factor (Inverse difficulty)
    if (uni.acceptanceRate < 10) {
        score -= 10; // Reach
    } else if (uni.acceptanceRate > 40) {
        score += 5; // Target/Safe
    }

    return Math.min(Math.max(score, 5), 99); // Clamp between 5% and 99%
}

export function getFitCategory(score: number): 'Reach' | 'Target' | 'Safe' {
    if (score < 40) return 'Reach';
    if (score < 75) return 'Target';
    return 'Safe';
}
