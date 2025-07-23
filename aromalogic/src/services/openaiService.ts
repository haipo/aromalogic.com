import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // This is the default and can be omitted
  dangerouslyAllowBrowser: true, // Allow use in browser environments
});

export async function getOpenAICompletion(prompt: string): Promise<string | null> {
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "你是一個專業的芳療師,會以具有NAHA Level3與IFA證照的芳療師身分回答問題"
        },
        { role: 'user', content: prompt }],
      model: 'gpt-4.1-2025-04-14', // You can choose a different model if needed
    });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return null;
  }
}