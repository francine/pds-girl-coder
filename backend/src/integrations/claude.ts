import Anthropic from '@anthropic-ai/sdk';
import { ExternalServiceError } from '../utils/errors.js';

const hasApiKey = !!process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.length > 0;

const client: any = hasApiKey ? new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
}) : null;

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

// Fallback post ideas when API is not available
function getFallbackPostIdeas(
  userSkills: string[],
  count: number
): Array<{ title: string; description: string; reason: string }> {
  const templates = [
    {
      title: "5 Key Lessons from My Career Journey",
      description: `Share insights about your experience with ${userSkills.slice(0, 2).join(' and ')}. Discuss challenges overcome and growth achieved.`,
      reason: "Personal stories create connection and showcase your expertise authentically."
    },
    {
      title: "The Future of " + (userSkills[0] || "Technology"),
      description: "Discuss emerging trends and how professionals can prepare for upcoming changes in the industry.",
      reason: "Thought leadership positions you as forward-thinking and industry-aware."
    },
    {
      title: "Common Mistakes in " + (userSkills[0] || "Your Field"),
      description: "Share practical advice on pitfalls to avoid, based on your professional experience.",
      reason: "Helpful content demonstrates expertise while providing value to your network."
    },
    {
      title: "My Top Tools and Resources",
      description: `Recommend tools and resources that have helped you excel in ${userSkills.slice(0, 2).join(' and ')}.`,
      reason: "Practical recommendations showcase your knowledge and help others."
    },
    {
      title: "International Career Tips",
      description: "Share advice for professionals seeking opportunities in international markets.",
      reason: "Relevant to job search and demonstrates global perspective."
    },
    {
      title: "Project Success Story",
      description: "Highlight a recent project where you applied your skills to solve a real problem.",
      reason: "Concrete examples of your work are more impactful than abstract claims."
    },
    {
      title: "Skills That Changed My Career",
      description: `Discuss how developing skills in ${userSkills[0] || 'your field'} opened new opportunities.`,
      reason: "Inspiring content that also highlights your capabilities."
    },
  ];

  return templates.slice(0, Math.min(count, templates.length));
}

export async function generatePostIdeas(
  userSkills: string[],
  count: number = 5
): Promise<Array<{ title: string; description: string; reason: string }>> {
  // If no API key is configured, use fallback templates
  if (!client) {
    console.log('⚠️ Anthropic API key not configured, using fallback post ideas');
    return getFallbackPostIdeas(userSkills, count);
  }

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
