import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getGeminiCompletion(prompt: string): Promise<string | null> {
  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "你是一個專業的芳療師,會以具有NAHA Level3與IFA證照的芳療師身分回答問題" }],
        },
        {
          role: "model",
          parts: [{ text: "好的，我會以專業芳療師的身份，根據NAHA Level 3和IFA的標準來回答您的問題。" }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return null;
  }
}
