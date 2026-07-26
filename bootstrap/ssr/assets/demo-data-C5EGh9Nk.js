import { TrendingUp, DollarSign, BarChart3, Target, Activity } from "lucide-react";
const markets = [
  {
    id: "1",
    title: "Will Bitcoin reach $100,000 by end of 2024?",
    description: "This market resolves to 'Yes' if Bitcoin (BTC) reaches or exceeds $100,000 USD on any major exchange before January 1, 2025.",
    category: "Economics",
    endDate: "2024-12-31",
    yesPrice: 0.65,
    noPrice: 0.35,
    volume: 15420.5,
    chance: 33.3,
    imageUrl: "",
    predictions: [
      { id: "1", name: "Zohran Mamdani", percentage: 19 },
      { id: "2", name: "Alex Johnson", percentage: 42 },
      { id: "3", name: "Emily Carter", percentage: 33 },
      { id: "4", name: "Ravi Patel", percentage: 27 },
      { id: "5", name: "Sophia Martinez", percentage: 55 }
    ]
  },
  {
    id: "2",
    title: "Will the next iPhone have a foldable screen?",
    description: "This market resolves to 'Yes' if Apple announces an iPhone with a foldable display at their next major product event.",
    category: "Technology",
    endDate: "2024-09-30",
    yesPrice: 0.24,
    noPrice: 0.76,
    volume: 8750.25,
    chance: 28,
    imageUrl: ""
  },
  {
    id: "3",
    title: "Will Manchester City win the Premier League 2024-25?",
    description: "This market resolves to 'Yes' if Manchester City FC wins the 2024-25 Premier League title.",
    category: "Sports",
    endDate: "2025-05-31",
    yesPrice: 0.58,
    noPrice: 0.42,
    volume: 12300.75,
    chance: 38,
    imageUrl: "",
    predictions: [
      { id: "1", name: "Zohran Mamdani", percentage: 19 },
      { id: "2", name: "Alex Johnson", percentage: 42 },
      { id: "3", name: "Emily Carter", percentage: 33 },
      { id: "4", name: "Ravi Patel", percentage: 27 },
      { id: "5", name: "Sophia Martinez", percentage: 55 }
    ]
  },
  {
    id: "4",
    title: "Will SpaceX successfully land humans on Mars by 2030?",
    description: "This market resolves to 'Yes' if SpaceX successfully lands human astronauts on Mars before January 1, 2031.",
    category: "Science",
    endDate: "2030-12-31",
    yesPrice: 0.18,
    noPrice: 0.82,
    volume: 5680,
    chance: 55,
    imageUrl: "",
    predictions: [
      { id: "1", name: "Zohran Mamdani", percentage: 19 },
      { id: "2", name: "Alex Johnson", percentage: 42 },
      { id: "3", name: "Emily Carter", percentage: 33 },
      { id: "4", name: "Ravi Patel", percentage: 27 },
      { id: "5", name: "Sophia Martinez", percentage: 55 }
    ]
  },
  {
    id: "5",
    title: "Will Taylor Swift win Album of the Year at 2025 Grammys?",
    description: "This market resolves to 'Yes' if Taylor Swift wins the Grammy Award for Album of the Year at the 2025 ceremony.",
    category: "Entertainment",
    endDate: "2025-02-02",
    yesPrice: 0.42,
    noPrice: 0.58,
    volume: 3240.8,
    chance: 8,
    imageUrl: ""
  },
  {
    id: "6",
    title: "Will OpenAI release GPT-5 in 2024?",
    description: "This market resolves to 'Yes' if OpenAI officially releases or announces GPT-5 before December 31, 2024.",
    category: "Technology",
    endDate: "2024-12-31",
    yesPrice: 0.73,
    noPrice: 0.27,
    volume: 9850.4,
    chance: 20,
    imageUrl: "",
    predictions: [
      { id: "1", name: "Zohran Mamdani", percentage: 19 },
      { id: "2", name: "Alex Johnson", percentage: 42 },
      { id: "3", name: "Emily Carter", percentage: 33 },
      { id: "4", name: "Ravi Patel", percentage: 27 },
      { id: "5", name: "Sophia Martinez", percentage: 55 }
    ]
  },
  {
    id: "7",
    title: "Will Real Madrid defeat Atlético Madrid?",
    description: "This market resolves to 'Yes' if OpenAI officially releases or announces GPT-5 before December 31, 2024.",
    category: "Technology",
    endDate: "2024-12-31",
    yesPrice: 0.73,
    noPrice: 0.27,
    volume: 9850.4,
    chance: 20,
    imageUrl: "https://i.ibb.co.com/MxJG3zgZ/public.webp"
  },
  {
    id: "8",
    title: "Ravens vs. Chiefs",
    description: "This market resolves to 'Yes' if OpenAI officially releases or announces GPT-5 before December 31, 2024.",
    category: "Technology",
    endDate: "2024-12-31",
    yesPrice: 0.73,
    noPrice: 0.27,
    volume: 9850.4,
    chance: 20,
    imageUrl: "https://i.ibb.co.com/mrBDSzBh/Ravens-vs-Chiefs.webp",
    actionButtons: true,
    trades: [
      {
        id: "1",
        imageUrl: "https://i.ibb.co.com/Rk7xm7jp/epl-brentford.webp",
        name: "Brentford",
        percentage: 19
      },
      { id: "2", imageUrl: "https://i.ibb.co.com/qY21PRR5/epl-manchester-united.webp", name: "Man Utd", percentage: 42 }
    ]
  }
];
const marketsTwo = [
  {
    id: "1",
    title: "Will Bitcoin reach $100,000 by end of 2024?",
    description: "This market resolves to 'Yes' if Bitcoin (BTC) reaches or exceeds $100,000 USD on any major exchange before January 1, 2025.",
    category: "Economics",
    endDate: "2024-12-31",
    yesPrice: 0.65,
    noPrice: 0.35,
    volume: 15420.5,
    imageUrl: "",
    predictions: [
      { id: "1", name: "Zohran Mamdani", percentage: 19 },
      { id: "2", name: "Alex Johnson", percentage: 42 },
      { id: "3", name: "Emily Carter", percentage: 33 },
      { id: "4", name: "Ravi Patel", percentage: 27 },
      { id: "5", name: "Sophia Martinez", percentage: 55 }
    ]
  },
  {
    id: "2",
    title: "Will the next iPhone have a foldable screen?",
    description: "This market resolves to 'Yes' if Apple announces an iPhone with a foldable display at their next major product event.",
    category: "Technology",
    endDate: "2024-09-30",
    yesPrice: 0.24,
    noPrice: 0.76,
    volume: 8750.25,
    chance: 28,
    imageUrl: ""
  },
  {
    id: "3",
    description: "This market resolves to 'Yes' if OpenAI officially releases or announces GPT-5 before December 31, 2024.",
    category: "Technology",
    endDate: "2024-12-31",
    yesPrice: 0.73,
    noPrice: 0.27,
    volume: 9850.4,
    actionButtons: true,
    trades: [
      {
        id: "1",
        imageUrl: "https://i.ibb.co.com/d0pBjFB6/epl-brighton.webp",
        name: "Chelsea",
        percentage: 19
      },
      {
        id: "2",
        imageUrl: "https://i.ibb.co.com/dJx74jJv/epl-chelsea.webp",
        name: "Brighton",
        percentage: 42
      }
    ]
  },
  {
    id: "4",
    title: "Will Manchester City win the Premier League 2024-25?",
    description: "This market resolves to 'Yes' if Manchester City FC wins the 2024-25 Premier League title.",
    category: "Sports",
    endDate: "2025-05-31",
    yesPrice: 0.58,
    noPrice: 0.42,
    volume: 12300.75,
    imageUrl: "",
    predictions: [
      { id: "1", name: "Zohran Mamdani", percentage: 19 },
      { id: "2", name: "Alex Johnson", percentage: 42 },
      { id: "3", name: "Emily Carter", percentage: 33 },
      { id: "4", name: "Ravi Patel", percentage: 27 },
      { id: "5", name: "Sophia Martinez", percentage: 55 }
    ]
  },
  {
    id: "5",
    title: "Will SpaceX successfully land humans on Mars by 2030?",
    description: "This market resolves to 'Yes' if SpaceX successfully lands human astronauts on Mars before January 1, 2031.",
    category: "Science",
    endDate: "2030-12-31",
    yesPrice: 0.18,
    noPrice: 0.82,
    volume: 5680,
    imageUrl: "",
    predictions: [
      { id: "1", name: "Zohran Mamdani", percentage: 19 },
      { id: "2", name: "Alex Johnson", percentage: 42 },
      { id: "3", name: "Emily Carter", percentage: 33 },
      { id: "4", name: "Ravi Patel", percentage: 27 },
      { id: "5", name: "Sophia Martinez", percentage: 55 }
    ]
  },
  {
    id: "6",
    title: "Will Taylor Swift win Album of the Year at 2025 Grammys?",
    description: "This market resolves to 'Yes' if Taylor Swift wins the Grammy Award for Album of the Year at the 2025 ceremony.",
    category: "Entertainment",
    endDate: "2025-02-02",
    yesPrice: 0.42,
    noPrice: 0.58,
    volume: 3240.8,
    chance: 8,
    imageUrl: ""
  },
  {
    id: "7",
    title: "Will OpenAI release GPT-5 in 2024?",
    description: "This market resolves to 'Yes' if OpenAI officially releases or announces GPT-5 before December 31, 2024.",
    category: "Technology",
    endDate: "2024-12-31",
    yesPrice: 0.73,
    noPrice: 0.27,
    volume: 9850.4,
    imageUrl: "",
    predictions: [
      { id: "1", name: "Zohran Mamdani", percentage: 19 },
      { id: "2", name: "Alex Johnson", percentage: 42 },
      { id: "3", name: "Emily Carter", percentage: 33 },
      { id: "4", name: "Ravi Patel", percentage: 27 },
      { id: "5", name: "Sophia Martinez", percentage: 55 }
    ]
  },
  {
    id: "8",
    description: "This market resolves to 'Yes' if OpenAI officially releases or announces GPT-5 before December 31, 2024.",
    category: "Technology",
    endDate: "2024-12-31",
    yesPrice: 0.73,
    noPrice: 0.27,
    volume: 9850.4,
    actionButtons: true,
    trades: [
      {
        id: "1",
        imageUrl: "https://i.ibb.co.com/Rk7xm7jp/epl-brentford.webp",
        name: "Brentford",
        percentage: 19
      },
      { id: "2", imageUrl: "https://i.ibb.co.com/qY21PRR5/epl-manchester-united.webp", name: "Man Utd", percentage: 42 }
    ]
  }
];
const categories = [
  {
    label: "All",
    count: 320,
    subCategories: [
      { label: "Markets", count: 15 },
      { label: "Trade", count: 10 },
      { label: "Finance", count: 12 },
      { label: "Banking", count: 9 }
    ]
  },
  {
    label: "Politics",
    count: 58,
    subCategories: [
      { label: "Elections", count: 15 },
      { label: "Policies", count: 14 },
      { label: "International Relations", count: 20 },
      { label: "Political Parties", count: 9 },
      { label: "Elections", count: 15 },
      { label: "Policies", count: 14 },
      { label: "International Relations", count: 20 },
      { label: "Political Parties", count: 9 },
      { label: "Elections", count: 15 },
      { label: "Policies", count: 14 },
      { label: "International Relations", count: 20 },
      { label: "Political Parties", count: 9 },
      { label: "Elections", count: 15 },
      { label: "Policies", count: 14 },
      { label: "International Relations", count: 20 },
      { label: "Political Parties", count: 9 }
    ]
  },
  {
    label: "Sports",
    count: 72,
    subCategories: [
      { label: "Football", count: 22 },
      { label: "Basketball", count: 12 },
      { label: "Tennis", count: 9 },
      { label: "Cricket", count: 15 },
      { label: "Others", count: 14 }
    ]
  },
  {
    label: "Technology",
    count: 54,
    subCategories: [
      { label: "AI", count: 12 },
      { label: "Software", count: 10 },
      { label: "Hardware", count: 14 },
      { label: "Cybersecurity", count: 8 },
      { label: "Startups", count: 10 }
    ]
  },
  {
    label: "Economics",
    count: 46,
    subCategories: [
      { label: "Markets", count: 15 },
      { label: "Trade", count: 10 },
      { label: "Finance", count: 12 },
      { label: "Banking", count: 9 }
    ]
  },
  {
    label: "Entertainment",
    count: 42,
    subCategories: [
      { label: "Movies", count: 12 },
      { label: "Music", count: 10 },
      { label: "Celebrities", count: 8 },
      { label: "TV Shows", count: 7 },
      { label: "Gaming", count: 5 }
    ]
  },
  {
    label: "Science",
    count: 28,
    subCategories: [
      { label: "Physics", count: 6 },
      { label: "Biology", count: 5 },
      { label: "Space", count: 7 },
      { label: "Chemistry", count: 5 },
      { label: "Environment", count: 5 }
    ]
  },
  {
    label: "Health",
    count: 34,
    subCategories: [
      { label: "Medicine", count: 10 },
      { label: "Nutrition", count: 6 },
      { label: "Fitness", count: 8 },
      { label: "Mental Health", count: 10 }
    ]
  },
  {
    label: "Travel",
    count: 22,
    subCategories: [
      { label: "Destinations", count: 8 },
      { label: "Tips & Guides", count: 5 },
      { label: "Adventure", count: 4 },
      { label: "Culture", count: 5 }
    ]
  },
  {
    label: "Business",
    count: 40,
    subCategories: [
      { label: "Startups", count: 12 },
      { label: "Corporations", count: 10 },
      { label: "Investments", count: 9 },
      { label: "Real Estate", count: 9 }
    ]
  },
  {
    label: "Lifestyle",
    count: 26,
    subCategories: [
      { label: "Fashion", count: 7 },
      { label: "Food", count: 6 },
      { label: "Home & Living", count: 7 },
      { label: "Personal Growth", count: 6 }
    ]
  },
  {
    label: "Education",
    count: 20,
    subCategories: [
      { label: "Schools", count: 5 },
      { label: "Colleges", count: 5 },
      { label: "Online Learning", count: 6 },
      { label: "Research", count: 4 }
    ]
  }
];
const timeframes = [
  { label: "Ending Soon", active: false },
  { label: "This Week", active: false },
  { label: "This Month", active: true },
  { label: "Long Term", active: false }
];
const portfolioStats = [
  {
    id: 1,
    label: "Total Value",
    value: "$2,847",
    icon: DollarSign,
    iconColor: "text-green-600",
    subValue: "+12.4%",
    subIcon: TrendingUp,
    subColor: "text-green-600"
  },
  {
    id: 2,
    label: "Total P/L",
    value: "+$347",
    valueColor: "text-green-600",
    icon: BarChart3,
    iconColor: "text-blue-600",
    subValue: "All time",
    subColor: "text-muted-foreground"
  },
  {
    id: 3,
    label: "Active Positions",
    value: "3",
    icon: Target,
    iconColor: "text-purple-600",
    subValue: "Markets",
    subColor: "text-muted-foreground"
  },
  {
    id: 4,
    label: "Win Rate",
    value: "68%",
    icon: Activity,
    iconColor: "text-orange-600",
    subValue: "Last 30 days",
    subColor: "text-muted-foreground"
  }
];
const positions = [
  {
    market: "Bitcoin $100K by 2025?",
    outcome: "Yes",
    shares: 150,
    avgEntry: 0.68,
    markPrice: 0.72,
    pnl: 60,
    pnlPercent: 5.9,
    category: "Crypto",
    volume: "$45.2K",
    isProfit: true
  },
  {
    market: "US Election Outcome",
    outcome: "Candidate A",
    shares: 200,
    avgEntry: 0.52,
    markPrice: 0.48,
    pnl: -80,
    pnlPercent: -7.7,
    category: "Politics",
    volume: "$89.1K",
    isProfit: false
  },
  {
    market: "SpaceX Mars Landing 2030",
    outcome: "Yes",
    shares: 75,
    avgEntry: 0.34,
    markPrice: 0.36,
    pnl: 15,
    pnlPercent: 5.9,
    category: "Tech",
    volume: "$23.8K",
    isProfit: true
  }
];
const history = [
  {
    market: "FIFA World Cup Winner",
    outcome: "Argentina",
    shares: 100,
    entryPrice: 0.25,
    exitPrice: 0.95,
    pnl: 700,
    date: "2022-12-18",
    status: "Settled",
    category: "Sports"
  },
  {
    market: "Tesla Stock $300 by Q4",
    outcome: "No",
    shares: 50,
    entryPrice: 0.45,
    exitPrice: 0.15,
    pnl: -150,
    date: "2023-12-31",
    status: "Settled",
    category: "Stocks"
  }
];
const leaderboardData = [
  {
    id: 1,
    rank: 1,
    player: "Rans",
    avatar: "R",
    amount: 6e3,
    wins: 42,
    losses: 21,
    winRate: "64%",
    tier: "Challenger",
    tierIcon: "challenger"
  },
  {
    id: 2,
    rank: 2,
    player: "Mira",
    avatar: "M",
    amount: 5800,
    wins: 38,
    losses: 19,
    winRate: "67%",
    tier: "Grandmaster",
    tierIcon: "grandmaster"
  },
  {
    id: 3,
    rank: 3,
    player: "Kiro",
    avatar: "K",
    amount: 5600,
    wins: 35,
    losses: 20,
    winRate: "64%",
    tier: "Grandmaster",
    tierIcon: "grandmaster"
  },
  {
    id: 4,
    rank: 4,
    player: "Lyn",
    avatar: "L",
    amount: 5400,
    wins: 33,
    losses: 22,
    winRate: "60%",
    tier: "Master",
    tierIcon: "master"
  },
  {
    id: 5,
    rank: 5,
    player: "Drex",
    avatar: "D",
    amount: 5200,
    wins: 31,
    losses: 25,
    winRate: "55%",
    tier: "Master",
    tierIcon: "master"
  },
  {
    id: 6,
    rank: 6,
    player: "Sora",
    avatar: "S",
    amount: 5e3,
    wins: 29,
    losses: 27,
    winRate: "52%",
    tier: "Diamond",
    tierIcon: "diamond"
  }
];
export {
  markets as a,
  portfolioStats as b,
  categories as c,
  history as h,
  leaderboardData as l,
  marketsTwo as m,
  positions as p,
  timeframes as t
};
