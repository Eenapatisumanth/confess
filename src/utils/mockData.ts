import { User, Confession, Campus, ReactionType } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Mock user data generator
const generateAnonymousName = (): string => {
  const adjectives = [
    'Brave', 'Witty', 'Curious', 'Bold', 'Creative', 'Gentle', 'Swift', 'Bright',
    'Clever', 'Daring', 'Elegant', 'Fierce', 'Graceful', 'Humble', 'Keen',
    'Lively', 'Noble', 'Radiant', 'Serene', 'Vibrant', 'Wise', 'Zealous'
  ];
  
  const animals = [
    'Panda', 'Wolf', 'Eagle', 'Dolphin', 'Tiger', 'Owl', 'Fox', 'Lion',
    'Butterfly', 'Hawk', 'Penguin', 'Rabbit', 'Bear', 'Deer', 'Whale',
    'Flamingo', 'Koala', 'Cheetah', 'Elephant', 'Peacock', 'Otter', 'Swan'
  ];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  
  return `${adjective} ${animal}`;
};

// Mock users
const mockUsers: User[] = Array.from({ length: 50 }, () => {
  const userId = uuidv4();
  return {
  id: userId,
  googleId: `google_${uuidv4()}`,
  anonymousName: generateAnonymousName(),
  email: `user${Math.floor(Math.random() * 1000)}@vitbhopal.ac.in`,
  createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  confessionHistory: []
  };
});

// Sample confession texts
const sampleConfessions = [
  "Just realized I've been pronouncing 'epitome' wrong my entire life. Said it out loud in class today and everyone looked at me weird 😅",
  "The canteen uncle always gives me extra samosas when I smile. Small wins that make college life better ❤️",
  "Pulled an all-nighter for an assignment, submitted it at 11:59 PM, and got an A+. Sometimes procrastination pays off!",
  "Had a crush on someone for 3 years, finally confessed, and they said they felt the same way. College romance is real! 💕",
  "Failed my first semester, thought about dropping out, but my friends encouraged me to continue. Now I'm in my final year with decent grades. Never give up!",
  "The library has become my second home. I know every corner, every good study spot, and even which floors have the best WiFi.",
  "Accidentally attended the wrong class for an entire week because it was in my usual classroom. The professor never said anything 🤡",
  "Made my first real friend in college today after being lonely for months. Sometimes it takes time, but it's worth the wait.",
  "The mess food isn't that bad if you know what to order. Pro tip: Thursday's biryani is actually decent!",
  "Cried in the bathroom after a particularly tough viva. College can be overwhelming, but we're all in this together.",
  "Found out my roommate has been using my shampoo for months. We had the most awkward conversation about personal hygiene ever.",
  "The campus at night hits different. It's peaceful and makes you reflect on life and your goals.",
  "Bunked classes for the first time ever to watch a movie. Felt like a rebel, but also guilty the entire time 😂",
  "My parents still think I'm the studious kid from school. If only they knew about my weekend adventures...",
  "The placement season stress is real. Everyone's pretending to have it together while internally panicking.",
];

// Community activities (was group fun)
const groupFunActivities = [
  "Movie night at the hostel common room - who's bringing the popcorn?",
  "Late night cricket match at the ground. Bring your own bat!",
  "Study group for tomorrow's quiz. Let's suffer together 📚",
  "Anyone up for a midnight food run to the nearest dhaba?",
  "Gaming tournament in my room - FIFA and Call of Duty. Winner gets free dinner!",
  "Photography walk around campus during golden hour 📸",
  "Jam session at the music room. Bring your instruments!",
  "Group workout at the gym. Motivation needed!",
  "Coding hackathon prep session. Let's build something cool!",
  "Campus treasure hunt - I've hidden clues around the library!"
];
// Generate mock confessions
export const mockConfessions: Confession[] = Array.from({ length: 80 }, (_, index) => {
  const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
  const campus: Campus = ['vellore', 'chennai', 'bhopal', 'ap'][Math.floor(Math.random() * 4)] as Campus;
  const hasMedia = Math.random() < 0.3;
  const mediaType = hasMedia ? (Math.random() < 0.7 ? 'image' : 'video') : undefined;
  const isGroupFun = Math.random() < 0.2;
  
  // Generate random reactions
  const reactionTypes: ReactionType[] = ['love', 'haha', 'wow', 'sad', 'angry'];
  const numReactions = Math.floor(Math.random() * 20);
  const reactions = Array.from({ length: numReactions }, () => ({
    id: uuidv4(),
    confessionId: uuidv4(),
    userId: mockUsers[Math.floor(Math.random() * mockUsers.length)].id,
    reactionType: reactionTypes[Math.floor(Math.random() * reactionTypes.length)]
  }));

  // Generate random comments
  const numComments = Math.floor(Math.random() * 15);
  const sampleCommentTexts = [
    "This is so relatable! 😭",
    "I felt this on a spiritual level",
    "Same energy tbh",
    "We've all been there",
    "This hits different at 2 AM",
    "Big mood",
    "I'm not crying, you're crying",
    "This is why I love our college",
    "Facts 💯",
    "Too real",
    "I needed to hear this today",
    "Sending virtual hugs 🤗",
    "You're not alone in this",
    "This made my day better",
    "So wholesome ❤️"
  ];

  const comments = Array.from({ length: numComments }, () => {
    const commentUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    return {
      id: uuidv4(),
      confessionId: uuidv4(),
      userId: commentUser.id,
      user: commentUser,
      commentText: sampleCommentTexts[Math.floor(Math.random() * sampleCommentTexts.length)],
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    };
  });

  const confessionId = uuidv4();
  
  // Add to user's history
  user.confessionHistory.push(confessionId);
  return {
    id: confessionId,
    userId: user.id,
    user,
    contentText: isGroupFun 
      ? groupFunActivities[Math.floor(Math.random() * groupFunActivities.length)]
      : sampleConfessions[Math.floor(Math.random() * sampleConfessions.length)],
    mediaUrl: hasMedia ? `https://picsum.photos/800/600?random=${index}` : undefined,
    mediaType,
    campus,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    reactions,
    comments,
    isGroupFun,
    _count: {
      reactions: reactions.length,
      comments: comments.length
    }
  };
});

export { mockUsers, generateAnonymousName };