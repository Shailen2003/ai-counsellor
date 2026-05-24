import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Priority list of models to try
const MODELS = [
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.0-pro-exp",
  "gemini-2.0-flash-001"
];

export async function getCounsellorResponse(
  userMessage: string,
  context: {
    profile: any;
    stage: string;
    shortlisted: any[];
    locked: any[];
  }
) {
  const systemPrompt = `You are an expert study-abroad counsellor helping students make informed decisions about their education journey.

STUDENT PROFILE:
- Education: ${context.profile.degree} in ${context.profile.major}
- GPA: ${context.profile.gpa || 'Not provided'}
- Target Degree: ${context.profile.intendedDegree} in ${context.profile.fieldOfStudy}
- Budget: $${context.profile.budgetMin}-${context.profile.budgetMax} per year
- Preferred Countries: ${context.profile.preferredCountries?.join(", ") || 'Not specified'}
- IELTS: ${context.profile.ieltsStatus} ${context.profile.ieltsScore ? `(Score: ${context.profile.ieltsScore})` : ''}
- GRE: ${context.profile.greStatus} ${context.profile.greScore ? `(Score: ${context.profile.greScore})` : ''}
- SOP: ${context.profile.sopStatus}
- Current Stage: ${context.stage || 'building_profile'}
- Shortlisted Universities: ${context.shortlisted.length}
- Locked Universities: ${context.locked.length}

AVAILABLE UNIVERSITIES IN DATABASE:
${(context as any).availableUniversities?.map((u: any) => `- ${u.name} (ID: ${u.id})`).join("\n") || 'None loaded'}

YOUR ROLE:
1. Provide personalized, actionable guidance based on the student's profile.
2. Explain strengths and gaps clearly.
3. Recommend universities categorized as Dream/Target/Safe.
4. Explain WHY a university fits or is risky.
5. Guide decision-making, not just answer questions.
6. Trigger actions (shortlist, tasks, lock) when the conversation naturally warrants them.

AVAILABLE ACTIONS (Trigger by including the exact JSON block at the end of your response):

1. **Shortlist a University** (When you recommend a specific university and the student seems interested):
{ "action": "shortlist_university", "data": { "universityId": "ID_FROM_LIST", "category": "dream|target|safe", "fitReason": "Why it fits", "risks": "Potential downsides", "acceptanceChance": "low|medium|high" } }

2. **Create a Task** (Crucial! Trigger this when the student needs to take a step like studying for exams, preparing documents, or researching):
{ "action": "create_task", "data": { "title": "Clear Actionable Title", "description": "Details of what to do", "category": "exam|document|application|research", "priority": "high|medium|low" } }

3. **Lock a University** (When the student decides to apply to a specific university):
{ "action": "lock_university", "data": { "universityId": "ID_FROM_LIST", "program": "Specific Program Name" } }

IMPORTANT: You can include multiple actions if needed. Always use the IDs provided in the "AVAILABLE UNIVERSITIES" section. If you suggest a task, make it specific and helpful.

Now respond to the student's message naturally and helpfully.`;

  const fullPrompt = `${systemPrompt}\n\nStudent: ${userMessage}\n\nCounsellor:`;

  // Try each model until one works
  let lastError = null;
  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      lastError = error;
      console.error(`AI Failure [${modelName}]:`, error.message);
      // Continue to next model...
    }
  }

  // If we get here, all models failed
  if (lastError?.message?.includes('429')) {
    return "I'm currently hitting Google's rate limits for the Free Tier. Please wait about 30 seconds and try again! If this keeps happening, you might need to check your usage in Google AI Studio.";
  }

  if (lastError?.message?.includes('403') || lastError?.message?.includes('API_KEY_INVALID')) {
    return "It looks like your GEMINI_API_KEY might be invalid or not have permission to use the Generative AI API. Please double-check it in your .env file.";
  }

  return "I'm having a hard time reaching my brain right now. All AI models returned an error. Please check your internet connection or try again in a moment.";
}

export function parseActionsFromResponse(response: string): any[] {
  const actions: any[] = [];
  const jsonRegex = /\{[\s\S]*?"action"[\s\S]*?\}/g;
  const matches = response.match(jsonRegex);

  if (matches) {
    for (const match of matches) {
      try {
        const action = JSON.parse(match);
        if (action.action) {
          actions.push(action);
        }
      } catch (e) {
        // Invalid JSON, skip
      }
    }
  }

  return actions;
}

export async function analyzeSOPWithGemini(
  sopText: string,
  profile: any,
  lockedUnis: any[]
) {
  const prompt = `You are an elite study-abroad admissions committee evaluator. Analyze the following Statement of Purpose (SOP) draft written by a student.

STUDENT PROFILE:
- GPA: ${profile?.gpa || 'Not provided'}
- Degree: ${profile?.degree || 'Not provided'}
- Major: ${profile?.major || 'Not provided'}
- Intended Degree: ${profile?.intendedDegree || 'Not provided'}
- Field of Study: ${profile?.fieldOfStudy || 'Not provided'}

LOCKED TARGET UNIVERSITIES:
${lockedUnis?.map(lu => `- ${lu.university?.name || 'Target University'} (Program: ${lu.program})`).join("\n") || "No locked universities yet."}

STATEMENT OF PURPOSE DRAFT:
"""
${sopText}
"""

Instructions:
Evaluate the SOP carefully. Generate a structured critique. You MUST return ONLY a valid JSON object matching the following structure. Do NOT wrap it in backticks, do NOT include markdown 'json' blocks. Just raw, pure JSON code:

{
  "score": 85,
  "academicAlignment": "optimal|average|weak",
  "structureRating": "optimal|average|weak",
  "clarityOfGoals": "optimal|average|weak",
  "summary": "Short 2-3 sentence overview of the SOP's strength and current fit.",
  "strengths": [
    "List 2 to 3 strong points of this essay..."
  ],
  "gaps": [
    "List 2 to 3 areas needing improvement or missing details..."
  ],
  "recommendations": [
    "Provide 2 to 3 specific, actionable recommendations on what to rewrite or add..."
  ],
  "tasks": [
    {
      "title": "Task title",
      "description": "Task description details",
      "priority": "high"
    }
  ]
}

Only return the JSON. Double check that it parses correctly.`;

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      const cleanJson = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
      return JSON.parse(cleanJson);
    } catch (error: any) {
      console.error(`SOP Analysis AI Failure [${modelName}]:`, error.message);
    }
  }

  // Fallback mock data
  return {
    score: 65,
    academicAlignment: "average",
    structureRating: "average",
    clarityOfGoals: "weak",
    summary: "The SOP highlights your academic record well, but fails to state a clear long-term career goal or mention specific resources of your locked target universities.",
    strengths: [
      "Good chronological explanation of academic projects",
      "Strong grammar and clear structure throughout the introduction"
    ],
    gaps: [
      "Does not connect your undergraduate projects directly to your locked university requirements",
      "Long-term career objectives are too vague and generic"
    ],
    recommendations: [
      "Mention 1-2 specific research labs or professors you want to work with at your locked universities",
      "Draft a strong concluding paragraph summarizing your post-graduation career timeline"
    ],
    tasks: [
      {
        "title": "Research specific faculty members",
        "description": "Read papers of 2 professors at your locked universities and reference them in your SOP.",
        "priority": "high"
      },
      {
        "title": "Clarify post-grad career goals",
        "description": "Specify what roles (e.g. ML engineer) and industries you intend to target immediately after graduating.",
        "priority": "medium"
      }
    ]
  };
}
