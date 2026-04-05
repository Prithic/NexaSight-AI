import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const analyzeCivicIssue = async (imageData: string) => {
  const prompt = `
    Analyze this image of a civic issue. 
    Identify:
    1. Type of issue (e.g., Pothole, Illegal Dumping, Water Leakage, Broken Streetlight, Vandalism).
    2. Severity score (1-10, where 10 is critical/life-threatening).
    3. Severity level (Low, Medium, High, Critical).
    4. Short description of the problem (max 2 sentences).
    5. Suggested immediate action for authorities.

    Return the result in strictly valid JSON format:
    {
      "type": "string",
      "severityScore": number,
      "severityLevel": "Low" | "Medium" | "High" | "Critical",
      "description": "string",
      "suggestedAction": "string"
    }
  `;

  try {
    const result = await geminiModel.generateContent([
      prompt,
      {
        inlineData: {
          data: imageData.split(",")[1], // Remove the data:image/jpeg;base64, prefix
          mimeType: "image/jpeg",
        },
      },
    ]);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text.replace(/```json|```/g, ""));
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("Failed to analyze image");
  }
};
