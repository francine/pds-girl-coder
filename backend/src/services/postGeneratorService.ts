// Template-based post generator that doesn't require API key
// Generates high-quality LinkedIn posts based on topics and skills

interface PostTemplate {
  title: string;
  content: string;
}

const engineeringTopics: Record<string, PostTemplate[]> = {
  'clean code': [
    {
      title: 'Clean Code Principles',
      content: `Clean code isn't just about making things work—it's about making things last.

Here are the principles that transformed my code quality:

🎯 Write code for humans first, computers second
If someone can't understand it in 30 seconds, refactor it.

🎯 Functions should do one thing well
If you use "and" to describe a function, it's doing too much.

🎯 Names should reveal intent
\`calculateUserAge()\` > \`calc()\`
\`isEmailValid()\` > \`check()\`

🎯 Don't repeat yourself (DRY)
Copy-paste is a code smell. Extract, reuse, abstract.

🎯 Leave the code better than you found it
The boy scout rule: always clean up after yourself.

Clean code is a gift to your future self and your team.

What's your #1 clean code principle?

#CleanCode #SoftwareEngineering #CodingBestPractices #Programming #DevLife`
    }
  ],
  'testing': [
    {
      title: 'Why Testing Matters',
      content: `Testing isn't about achieving 100% coverage. It's about confidence.

Here's my testing philosophy:

✅ Test behavior, not implementation
Your tests should survive refactoring.

✅ Write tests that fail for the right reasons
A passing test that doesn't catch bugs is worthless.

✅ Keep tests fast
Slow tests don't get run. Period.

✅ One assertion per test (mostly)
Makes failures crystal clear.

✅ Arrange, Act, Assert
Structure matters. Good tests tell a story.

The goal isn't perfect coverage—it's sleeping well at night knowing your code works.

Tests are documentation. They show how your code should behave.

What's your testing strategy?

#Testing #TDD #SoftwareQuality #CleanCode #Engineering`
    }
  ],
  'architecture': [
    {
      title: 'Software Architecture Patterns',
      content: `Architecture decisions are the hardest to change. Choose wisely.

The patterns that work:

🏗️ Layered Architecture
Separates concerns. Controller → Service → Repository
Simple, testable, maintainable.

🏗️ Event-Driven Architecture
Loose coupling through events. Perfect for distributed systems.

🏗️ Microservices
Independent services, independent deployments. Great for scale, but adds complexity.

🏗️ Clean Architecture
Business logic at the center, everything else is a detail.

Remember: The best architecture is the one that solves YOUR problem, not the trendiest one.

Start simple. Evolve as needed. Premature optimization kills projects.

What architecture pattern do you use most?

#SoftwareArchitecture #SystemDesign #Engineering #Microservices #CleanArchitecture`
    }
  ],
  'performance': [
    {
      title: 'Performance Optimization Tips',
      content: `Slow code costs money. Here's how to make it fast:

⚡ Measure first, optimize second
Don't guess. Profile your code. Find the real bottlenecks.

⚡ Database queries are usually the problem
Add indexes. Use EXPLAIN. Optimize N+1 queries.

⚡ Caching solves 80% of performance issues
Redis is your friend. Cache aggressively, invalidate smartly.

⚡ Async > Sync
Don't block. Use workers for heavy tasks.

⚡ Monitor in production
What gets measured gets improved.

The fastest code is code that doesn't run. Avoid unnecessary work.

Performance isn't premature optimization—it's about knowing when to optimize.

What's your go-to performance fix?

#Performance #Optimization #SoftwareEngineering #Backend #DevOps`
    }
  ],
  'career': [
    {
      title: 'Career Growth in Tech',
      content: `Your career is a marathon, not a sprint. Here's what I've learned:

📈 Learn in public
Share what you're learning. It helps you and helps others.

📈 Build things, not just follow tutorials
Projects teach you what tutorials can't.

📈 Network authentically
Real relationships > collecting contacts.

📈 Specialize, then generalize
Go deep in one area, then broaden. T-shaped skills win.

📈 Don't chase trends blindly
Master fundamentals. Trends come and go.

📈 Mentorship works both ways
Teaching others is the best way to learn.

The best time to start was yesterday. The second best time is now.

What's the best career advice you've received?

#CareerGrowth #TechCareer #SoftwareDevelopment #Learning #Mentorship`
    }
  ]
};

const defaultTemplates: PostTemplate[] = [
  {
    title: 'Problem-Solving Mindset',
    content: `The best engineers aren't the ones who know the most—they're the ones who solve problems effectively.

My approach to problem-solving:

🔍 Understand the problem first
Don't jump to solutions. Ask questions. Clarify requirements.

🔍 Break it down
Big problems become manageable when split into smaller pieces.

🔍 Think in systems
How does this fit into the bigger picture?

🔍 Prototype quickly
Build a rough version. Test assumptions early.

🔍 Iterate based on feedback
First version rarely perfect. Embrace refinement.

Problem-solving is a skill you can practice. The more you do it, the better you get.

What's your problem-solving approach?

#ProblemSolving #Engineering #SoftwareDevelopment #CriticalThinking #Tech`
  },
  {
    title: 'Code Review Best Practices',
    content: `Code reviews aren't about finding mistakes—they're about building better software together.

How to do code reviews right:

👀 Be kind, be specific
"This could be clearer" > "This is confusing"

👀 Ask questions, don't demand
"Have you considered...?" > "You should..."

👀 Focus on the code, not the person
Review the work, not the developer.

👀 Praise good solutions
Positive feedback motivates and teaches.

👀 Keep it small
Big PRs don't get reviewed well. Break them up.

Good code reviews make everyone better. They're teaching opportunities.

What's your code review philosophy?

#CodeReview #SoftwareEngineering #TeamWork #BestPractices #Development`
  },
  {
    title: 'Documentation Matters',
    content: `Good documentation saves more time than good code.

Why documentation matters:

📝 Your memory isn't perfect
You'll forget why you made that decision. Write it down.

📝 Onboarding is faster
New team members can self-serve.

📝 Reduces interruptions
People can find answers without asking you.

📝 Makes debugging easier
Context helps you understand legacy code.

📝 Shows you care
Documented code signals professionalism.

Document the WHY, not just the WHAT. Code shows what it does. Comments explain why it does it.

README, architecture docs, code comments—they all matter.

Do you document your code? Why or why not?

#Documentation #SoftwareEngineering #BestPractices #CleanCode #Development`
  }
];

export function generatePostContent(topic?: string, userSkills?: string[]): string {
  // If topic is provided, try to match it to templates
  if (topic) {
    const topicLower = topic.toLowerCase();

    // Check if topic matches any category
    for (const [category, templates] of Object.entries(engineeringTopics)) {
      if (topicLower.includes(category) || category.includes(topicLower)) {
        const template = templates[Math.floor(Math.random() * templates.length)];
        return template.content;
      }
    }

    // If no match, generate a custom post about the topic
    return generateCustomPost(topic, userSkills);
  }

  // If no topic, return a random template
  const allTemplates = [
    ...Object.values(engineeringTopics).flat(),
    ...defaultTemplates
  ];

  const randomTemplate = allTemplates[Math.floor(Math.random() * allTemplates.length)];
  return randomTemplate.content;
}

function generateCustomPost(topic: string, userSkills?: string[]): string {
  const skills = userSkills && userSkills.length > 0
    ? userSkills.join(', ')
    : 'Software Engineering';

  return `Let's talk about ${topic}.

As someone working with ${skills}, here's what I've learned:

🔹 Understanding the fundamentals is key
Before jumping into advanced topics, make sure you have a solid foundation.

🔹 Practice makes perfect
Theory is important, but hands-on experience is where real learning happens.

🔹 Learn from others
The tech community is full of people willing to share their knowledge. Don't hesitate to ask questions.

🔹 Stay curious
Technology evolves fast. Keep learning, keep growing.

🔹 Share what you learn
Teaching others is one of the best ways to solidify your own understanding.

What's your experience with ${topic}? I'd love to hear your thoughts!

#SoftwareEngineering #TechCareer #Learning #${topic.replace(/\s+/g, '')} #Development`;
}

export function generateMultiplePosts(
  count: number,
  topic?: string,
  userSkills?: string[]
): string[] {
  const posts: string[] = [];
  const maxCount = Math.min(count, 10);

  // Get all available templates
  const allTemplates = [
    ...Object.values(engineeringTopics).flat(),
    ...defaultTemplates
  ];

  // Shuffle templates for variety
  const shuffled = allTemplates.sort(() => Math.random() - 0.5);

  for (let i = 0; i < maxCount; i++) {
    if (topic) {
      // If topic specified, generate custom posts
      posts.push(generatePostContent(topic, userSkills));
    } else {
      // Use shuffled templates to avoid duplicates
      const template = shuffled[i % shuffled.length];
      posts.push(template.content);
    }
  }

  return posts;
}
