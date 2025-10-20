import Anthropic from '@anthropic-ai/sdk';
import { ExternalServiceError } from '../utils/errors.js';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function generateLinkedInPost(
  topic: string,
  description: string,
  userSkills: string[],
  tone: string = 'professional',
  maxWords: number = 300
): Promise<string> {
  try {
    const prompt = `Generate a professional LinkedIn post about the following topic:

Topic: ${topic}
Description: ${description}
Author's skills/expertise: ${userSkills.join(', ')}
Tone: ${tone}
Maximum words: ${maxWords}

Requirements:
- Write in English
- Be authentic and engaging
- Include relevant hashtags (3-5)
- Focus on providing value to the reader
- Use a professional but conversational tone
- Keep it concise and impactful
- Do not use emojis excessively

Return only the post content, ready to be published on LinkedIn.`;

    const response = await client.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return content.text;
    }

    throw new Error('Unexpected response format from Claude API');
  } catch (error: any) {
    if (error.status === 429) {
      throw new ExternalServiceError(
        'AI service rate limit reached. Please try again later.'
      );
    }
    if (error.status === 401) {
      throw new ExternalServiceError(
        'AI service authentication failed. Please check API key.'
      );
    }
    throw new ExternalServiceError(
      `AI content generation failed: ${error.message}`
    );
  }
}

export async function generatePostIdeas(
  userSkills: string[],
  count: number = 5
): Promise<Array<{ title: string; description: string; reason: string }>> {
  try {
    const prompt = `Generate ${count} LinkedIn post topic ideas for a professional with the following skills: ${userSkills.join(', ')}.

Requirements:
- Topics should help showcase their expertise
- Focus on international job search and career development
- Be relevant and timely
- Provide value to their network
- Help increase visibility with recruiters

Return the response as a JSON array with this structure:
[
  {
    "title": "Brief topic title",
    "description": "Detailed description of what the post should cover",
    "reason": "Why this topic is valuable for their job search"
  }
]

Return ONLY the JSON array, no additional text.`;

    const response = await client.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      // Parse the JSON response
      const jsonMatch = content.text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    throw new Error('Unexpected response format from Claude API');
  } catch (error: any) {
    if (error.status === 429) {
      throw new ExternalServiceError(
        'AI service rate limit reached. Please try again later.'
      );
    }
    if (error.status === 401) {
      throw new ExternalServiceError(
        'AI service authentication failed. Please check API key.'
      );
    }
    throw new ExternalServiceError(
      `AI topic generation failed: ${error.message}`
    );
  }
}
