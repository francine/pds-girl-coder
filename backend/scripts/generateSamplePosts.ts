import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobsearch';

// Sample posts with pre-written content
const samplePosts = [
  {
    title: 'Overcoming Imposter Syndrome in Tech',
    content: `Imposter syndrome hit me hard when I started my career in tech. I thought everyone around me knew more, was smarter, more capable.

Here's what changed my perspective:

1️⃣ Everyone starts somewhere. The senior engineer you admire was once a junior too.

2️⃣ Your unique background is your strength, not a weakness. Different perspectives drive innovation.

3️⃣ Growth happens outside your comfort zone. Feeling challenged means you're learning.

4️⃣ Ask questions. It's not a sign of weakness—it's how experts became experts.

5️⃣ Celebrate small wins. Every bug fixed, every feature shipped, every code review is progress.

Remember: You're not here by accident. You earned your seat at the table.

What helped you overcome imposter syndrome? Share in the comments!

#TechCareers #ImposterSyndrome #CareerGrowth #SoftwareEngineering #ProfessionalDevelopment`
  },
  {
    title: 'The Power of Networking for Career Growth',
    content: `Let's talk about networking. Not the awkward "here's my card" type—but real, authentic connections.

70% of jobs are found through networking, yet many of us overlook it.

My approach to building meaningful professional relationships:

🤝 Start with genuine curiosity. Ask about others' work, challenges, and wins.

🤝 Provide value first. Share resources, make introductions, offer insights.

🤝 Stay consistent. A quick message every few months goes a long way.

🤝 Show up. Comment on posts, attend events, participate in communities.

🤝 Follow through. If you say you'll connect someone or share something—do it.

The best opportunities often come from people who believe in you before you apply.

Building a network isn't about collecting contacts—it's about cultivating relationships.

What's your best networking tip?

#Networking #CareerDevelopment #ProfessionalGrowth #JobSearch #CareerAdvice`
  },
  {
    title: 'Best Practices for Remote Work Productivity',
    content: `After 3 years of remote work, here's what actually works for staying productive:

🎯 Create boundaries
Start and end at the same time. Your brain needs the ritual.

🎯 Optimize your workspace
Invest in a good chair, monitor, and lighting. Your back will thank you.

🎯 Use the Pomodoro Technique
25 min focused work + 5 min break. It's simple but powerful.

🎯 Overcommunicate
In remote settings, there's no such thing as too much communication.

🎯 Take real breaks
Step away from your desk. Walk, stretch, grab coffee—just move.

🎯 Set daily goals
3 things you MUST do today. Everything else is a bonus.

🎯 Protect deep work time
Block calendar slots where you're unreachable. Your best work needs focus.

Remote work is a skill. Like any skill, it takes practice and intentional systems.

What's your #1 productivity hack for remote work?

#RemoteWork #Productivity #WorkFromHome #TimeManagement #WorkLifeBalance`
  },
  {
    title: 'How to Stand Out in Technical Interviews',
    content: `Technical interviews can be intimidating. But here's the truth: companies aren't just evaluating your code—they're evaluating how you think.

Here's how to stand out:

💡 Think out loud
Explain your thought process. Interviewers want to see HOW you problem-solve, not just the final answer.

💡 Ask clarifying questions
Don't jump straight to coding. Understand requirements, edge cases, constraints.

💡 Consider trade-offs
Discuss time/space complexity. Acknowledge that multiple solutions exist.

💡 Test your code
Walk through examples. Find bugs before the interviewer does.

💡 Show you can learn
If you're stuck, explain what you'd Google or what documentation you'd check.

💡 Communicate like a teammate
Be collaborative, not defensive. Interviews simulate working together.

Remember: Perfect code matters less than clear thinking and good communication.

The best hires aren't always the fastest coders—they're the ones who ask smart questions and work well with others.

What's the best advice you've received for technical interviews?

#TechnicalInterview #JobSearch #CodingInterview #CareerAdvice #SoftwareEngineering`
  },
  {
    title: 'Building a Personal Brand on LinkedIn',
    content: `Your LinkedIn profile is your digital first impression. Here's how to make it count:

📌 Headline matters most
Don't just list your title. Show the value you bring.
Before: "Software Engineer"
After: "Software Engineer | Building scalable systems | Passionate about clean code"

📌 About section tells your story
Who you are, what you do, what drives you. Make it human.

📌 Experience = results, not duties
Don't list tasks. Show impact.
"Led migration to microservices, reducing latency by 40%"

📌 Post consistently
Share insights, lessons, wins. Visibility builds credibility.

📌 Engage genuinely
Comment thoughtfully on others' posts. Real engagement > empty likes.

📌 Use keywords
Recruiters search for specific terms. Make sure yours appear.

Your brand isn't about being perfect—it's about being authentic and visible.

Start small: update one section today. Progress > perfection.

#PersonalBranding #LinkedIn #CareerDevelopment #ProfessionalNetworking #JobSearch`
  },
  {
    title: 'The Importance of Continuous Learning in Tech',
    content: `In tech, what you know today might be outdated in 6 months. Continuous learning isn't optional—it's essential.

But here's what I've learned about learning:

📚 Quality > Quantity
One course completed is better than ten started.

📚 Apply immediately
Theory without practice is just entertainment. Build something with each new skill.

📚 Learn in public
Share what you're learning. Teaching others solidifies your knowledge.

📚 Follow curiosity
The best learning happens when you're genuinely interested.

📚 Schedule it
If it's not on your calendar, it won't happen. Block time for learning.

My learning routine:
• 30 min/day: Read documentation or articles
• 1 hour/week: Deep dive into a new concept
• 1 project/month: Apply new skills

The tech industry moves fast. But so can you—if you're intentional about growth.

What are you learning right now?

#ContinuousLearning #TechSkills #ProfessionalDevelopment #CareerGrowth #SoftwareEngineering`
  },
  {
    title: 'Transitioning to a Tech Career from Another Field',
    content: `Career change to tech? I did it, and here's what I wish I knew:

✨ Your previous experience is an asset
Don't dismiss your background. Tech needs diverse perspectives. Your unique lens is valuable.

✨ Start with fundamentals
Pick one language, one path. Breadth comes later—depth comes first.

✨ Build projects, not just tutorials
Tutorials teach syntax. Projects teach problem-solving.

✨ Network aggressively
Attend meetups, join Discord communities, connect on LinkedIn. Most jobs come through people.

✨ Be patient with yourself
You're learning a new language—give yourself grace. Progress isn't always linear.

✨ Get comfortable with discomfort
Imposter syndrome will hit hard. Push through it. Everyone feels it.

✨ Find mentors
Connect with people who've made the switch. Their roadmap can be yours.

The best time to start was yesterday. The second best time is now.

You don't need to know everything to get started. You just need to start.

To anyone considering a career switch to tech: You can do this. It won't be easy, but it will be worth it.

#CareerChange #TechCareer #CareerTransition #Learning #SoftwareEngineering`
  },
  {
    title: 'Effective Communication in Software Teams',
    content: `Good code is important. Good communication is critical.

The best engineers I've worked with aren't just great coders—they're great communicators.

Here's what effective communication looks like:

💬 Write clear pull request descriptions
Context matters. Explain the WHY, not just the WHAT.

💬 Document decisions
Future you (and your teammates) will thank you.

💬 Ask questions early
Confusion compounds. Clarity saves time.

💬 Give constructive feedback
Be specific. Be kind. Be helpful.

💬 Acknowledge others
A quick "great catch!" goes a long way for team morale.

💬 Communicate blockers immediately
Don't wait until standup. Flag issues when they happen.

💬 Use the right medium
Slack for quick questions. Email for documentation. Video for complex discussions.

Code quality matters, but so does team cohesion. Communication is what bridges the gap.

Great software is built by great teams. And great teams communicate well.

What's your best tip for team communication?

#TeamCommunication #SoftwareEngineering #Teamwork #Collaboration #TechLeadership`
  },
  {
    title: 'Negotiating Your First Tech Job Offer',
    content: `Negotiation isn't about being aggressive. It's about knowing your worth and communicating it effectively.

Here's what I learned negotiating my offers:

💰 Always negotiate
Companies expect it. The first offer is rarely the best offer.

💰 Know your market value
Research salary ranges on Glassdoor, Levels.fyi, Payscale. Data is power.

💰 Consider the whole package
Base salary + bonus + equity + benefits + work-life balance.

💰 Have a number in mind
Know your target and your walk-away point.

💰 Focus on value, not need
"Based on my skills and market research" > "I need this to pay rent"

💰 Get it in writing
Verbal promises don't count. Everything should be in the offer letter.

💰 Take your time
"Can I have 24-48 hours to review?" is always reasonable.

💰 Stay professional
Be collaborative, not confrontational. You'll work with these people.

Remember: Negotiation is a conversation, not a battle. The goal is mutual satisfaction.

You're not being greedy. You're being strategic about your career.

Don't leave money on the table out of fear. Your future self will thank you.

#Negotiation #SalaryNegotiation #CareerAdvice #JobOffer #TechCareers`
  },
  {
    title: 'Work-Life Balance in High-Pressure Tech Roles',
    content: `Burnout is real. I learned this the hard way.

Working in tech can be intense—tight deadlines, on-call rotations, constantly learning. But sustainable success requires balance.

Here's what helps me maintain sanity:

🧘‍♀️ Set hard boundaries
Work ends at 6pm. No Slack after hours unless it's critical.

🧘‍♀️ Protect your mornings
Start with exercise, meditation, or reading—something for YOU.

🧘‍♀️ Take your PTO
Unused vacation days don't make you a better employee. Rest makes you more productive.

🧘‍♀️ Unplug completely
When you're off, be OFF. Delete Slack from your phone on weekends.

🧘‍♀️ Prioritize ruthlessly
Not everything is urgent. Learn to say no.

🧘‍♀️ Invest in relationships
Work matters, but so do the people who matter to you.

🧘‍♀️ Recognize warning signs
Constant fatigue? Irritability? Lack of motivation? Don't ignore them.

Your career is a marathon, not a sprint. Pace yourself.

The badge of honor isn't working 80-hour weeks—it's delivering consistent, high-quality work while staying healthy.

You can't pour from an empty cup. Take care of yourself first.

How do you maintain work-life balance?

#WorkLifeBalance #MentalHealth #BurnoutPrevention #TechCareers #WellBeing`
  }
];

async function generateSamplePosts() {
  let client: MongoClient | null = null;

  try {
    console.log('Connecting to MongoDB...');
    client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();

    // Get the first user (or create a test user if none exists)
    const usersCollection = db.collection('users');
    let user = await usersCollection.findOne({});

    if (!user) {
      console.log('No user found. Creating a test user...');
      const testUser = {
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: '$2b$10$dummy.hash.for.testing',
        profile: {
          bio: 'Tech professional passionate about career growth',
          skills: ['Software Engineering', 'Leadership', 'Problem Solving'],
          experience: [],
          education: [],
          email: {
            address: 'test@example.com',
            verified: true
          }
        },
        linkedinIntegration: {
          connected: false
        },
        preferences: {
          timezone: 'America/New_York',
          notificationsEnabled: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await usersCollection.insertOne(testUser);
      user = { ...testUser, _id: result.insertedId };
      console.log('Test user created with ID:', user._id);
    } else {
      console.log('Using existing user with ID:', user._id);
    }

    const postsCollection = db.collection('posts');

    console.log('\nGenerating 10 sample posts...\n');

    for (let i = 0; i < samplePosts.length; i++) {
      const postData = samplePosts[i];

      console.log(`[${i + 1}/10] Creating post: "${postData.title}"...`);

      // Create post document
      const post = {
        userId: user._id,
        content: postData.content,
        status: 'draft',
        metrics: {
          likes: 0,
          comments: 0,
          shares: 0
        },
        retryCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await postsCollection.insertOne(post);
    }

    const totalPosts = await postsCollection.countDocuments({ userId: user._id });
    console.log(`\n✅ Complete! Total posts for user: ${totalPosts}`);
    console.log('\n📝 All posts are in DRAFT status and ready to be scheduled.');
    console.log('🚀 You can now view these posts in the dashboard and schedule them for posting on LinkedIn.');

  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Run the script
generateSamplePosts().catch(console.error);
