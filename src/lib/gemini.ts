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
