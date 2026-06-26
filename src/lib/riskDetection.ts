export type RiskLevel = 'high' | 'medium' | 'low';

interface RiskKeyword {
  words: string[];
  level: RiskLevel;
  weight: number;
}

const riskKeywords: RiskKeyword[] = [
  {
    words: ['accident', 'death', 'died', 'kill', 'murder', 'fatal', 'casualty'],
    level: 'high', weight: 3,
  },
  {
    words: ['injury', 'injured', 'hurt', 'wound', 'bleed', 'broken bone'],
    level: 'high', weight: 3,
  },
  {
    words: ['emergency', 'urgent', 'critical', 'immediate', 'asap', 'life-threatening'],
    level: 'high', weight: 3,
  },
  {
    words: ['violence', 'assault', 'threat', 'abuse', 'attack', 'fight', 'battery'],
    level: 'high', weight: 3,
  },
  {
    words: ['corruption', 'bribe', 'bribery', 'extortion', 'embezzlement', 'fraud'],
    level: 'high', weight: 3,
  },
  {
    words: ['flood', 'landslide', 'earthquake', 'collapse', 'fire', 'explosion', 'disaster'],
    level: 'high', weight: 3,
  },
  {
    words: ['rape', 'sexual', 'harassment', 'molest', 'traffic', 'kidnap'],
    level: 'high', weight: 3,
  },
  {
    words: ['contaminated', 'poison', 'toxic', 'hazardous', 'radiation', 'chemical spill'],
    level: 'high', weight: 3,
  },
  {
    words: ['bridge', 'road', 'building', 'infrastructure', 'construction', 'damage', 'crack'],
    level: 'medium', weight: 2,
  },
  {
    words: ['delay', 'late', 'pending', 'stuck', 'slow', 'waiting', 'backlog'],
    level: 'medium', weight: 1,
  },
  {
    words: ['shortage', 'lack', 'insufficient', 'scarce', 'deficit', 'not enough'],
    level: 'medium', weight: 2,
  },
  {
    words: ['quality', 'repair', 'maintenance', 'broken', 'damaged', 'fault', 'defect'],
    level: 'medium', weight: 1,
  },
  {
    words: ['dispute', 'conflict', 'argument', 'quarrel', 'disagreement', 'complaint'],
    level: 'medium', weight: 1,
  },
  {
    words: ['electricity', 'power cut', 'load shedding', 'water supply', 'drain', 'sewage'],
    level: 'medium', weight: 1,
  },
  {
    words: ['suggestion', 'inquiry', 'request', 'feedback', 'opinion', 'proposal'],
    level: 'low', weight: 1,
  },
  {
    words: ['noise', 'garbage', 'waste', 'clean', 'cleaning', 'parking', 'street light', 'sanitation'],
    level: 'low', weight: 1,
  },
  {
    words: ['document', 'certificate', 'application', 'form', 'registration', 'renewal'],
    level: 'low', weight: 1,
  },
];

export interface RiskAnalysis {
  level: RiskLevel;
  confidence: number;
  matchedKeywords: { word: string; level: RiskLevel }[];
}

export function analyzeRisk(description: string): RiskAnalysis {
  const lower = description.toLowerCase();
  const matchedKeywords: { word: string; level: RiskLevel }[] = [];

  let highScore = 0;
  let mediumScore = 0;
  let lowScore = 0;

  for (const kw of riskKeywords) {
    for (const word of kw.words) {
      if (lower.includes(word)) {
        matchedKeywords.push({ word, level: kw.level });
        if (kw.level === 'high') highScore += kw.weight;
        else if (kw.level === 'medium') mediumScore += kw.weight;
        else lowScore += kw.weight;
        break;
      }
    }
  }

  const total = highScore + mediumScore + lowScore;

  if (total === 0) {
    return { level: 'medium', confidence: 0, matchedKeywords: [] };
  }

  if (highScore >= mediumScore && highScore >= lowScore) {
    return {
      level: 'high',
      confidence: Math.round((highScore / total) * 100),
      matchedKeywords,
    };
  } else if (mediumScore >= highScore && mediumScore >= lowScore) {
    return {
      level: 'medium',
      confidence: Math.round((mediumScore / total) * 100),
      matchedKeywords,
    };
  } else {
    return {
      level: 'low',
      confidence: Math.round((lowScore / total) * 100),
      matchedKeywords,
    };
  }
}

export const riskColors: Record<RiskLevel, string> = {
  high: 'text-red-600 bg-red-50 border-red-200',
  medium: 'text-amber-600 bg-amber-50 border-amber-200',
  low: 'text-green-600 bg-green-50 border-green-200',
};

export const riskBg: Record<RiskLevel, string> = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-green-500',
};
