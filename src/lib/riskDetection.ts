export type RiskLevel = 'high' | 'medium' | 'low';

interface RiskKeyword {
  words: string[];
  level: RiskLevel;
  weight: number;
}

const riskKeywords: RiskKeyword[] = [
  // --- HIGH RISK: national issues, highways, big infrastructure, disasters, crime ---
  {
    words: ['highway', 'expressway', 'national highway', 'flyover', 'motorway', 'national project'],
    level: 'high', weight: 3,
  },
  {
    words: ['corruption', 'bribe', 'bribery', 'extortion', 'embezzlement', 'fraud', 'scam', 'misappropriation'],
    level: 'high', weight: 3,
  },
  {
    words: ['flood', 'landslide', 'earthquake', 'collapse', 'explosion', 'disaster', 'havoc', 'devastating'],
    level: 'high', weight: 3,
  },
  {
    words: ['accident', 'death', 'died', 'kill', 'murder', 'fatal', 'casualty', 'massacre'],
    level: 'high', weight: 3,
  },
  {
    words: ['violence', 'assault', 'threat', 'abuse', 'attack', 'riot', 'communal', 'terror'],
    level: 'high', weight: 3,
  },
  {
    words: ['rape', 'sexual', 'harassment', 'molest', 'trafficking', 'kidnap', 'abduction'],
    level: 'high', weight: 3,
  },
  {
    words: ['poison', 'toxic', 'hazardous', 'radiation', 'chemical spill', 'contamination', 'epidemic', 'pandemic', 'outbreak'],
    level: 'high', weight: 3,
  },
  {
    words: ['human rights', 'constitutional', 'supreme court', 'high court', 'legislation', 'policy failure'],
    level: 'high', weight: 3,
  },
  {
    words: ['dam collapse', 'bridge collapse', 'building collapse', 'structural failure'],
    level: 'high', weight: 3,
  },

  // --- MEDIUM RISK: small roads, electricity poles, local infrastructure ---
  {
    words: ['road', 'street', 'lane', 'pothole', 'pavement', 'footpath', 'culvert', 'road repair'],
    level: 'medium', weight: 2,
  },
  {
    words: ['electricity', 'power', 'pole', 'transformer', 'power line', 'power cut', 'load shedding', 'voltage', 'blackout'],
    level: 'medium', weight: 2,
  },
  {
    words: ['water supply', 'drain', 'sewage', 'drainage', 'pipe', 'water pipe', 'blockage'],
    level: 'medium', weight: 1,
  },
  {
    words: ['bridge', 'local bridge', 'overpass', 'underpass', 'crossing'],
    level: 'medium', weight: 2,
  },
  {
    words: ['public transport', 'bus', 'bus stop', 'bus shelter', 'route', 'traffic', 'congestion', 'signal'],
    level: 'medium', weight: 1,
  },
  {
    words: ['school', 'college', 'hospital', 'health post', 'clinic', 'public building'],
    level: 'medium', weight: 2,
  },
  {
    words: ['garbage', 'waste', 'dump', 'sanitation', 'cleaning', 'cleanliness', 'public toilet'],
    level: 'medium', weight: 1,
  },
  {
    words: ['encroachment', 'illegal construction', 'zoning', 'land dispute', 'property dispute'],
    level: 'medium', weight: 2,
  },
  {
    words: ['repair', 'maintenance', 'broken', 'damaged', 'fault', 'defect', 'deteriorating'],
    level: 'medium', weight: 1,
  },

  // --- LOW RISK: tap water, simple house problems, small household issues ---
  {
    words: ['tap water', 'drinking water', 'water tap', 'faucet', 'leak', 'leaky'],
    level: 'low', weight: 1,
  },
  {
    words: ['plumbing', 'pipe leak', 'toilet', 'sink', 'bathroom', 'drain clog'],
    level: 'low', weight: 1,
  },
  {
    words: ['house', 'home', 'apartment', 'residential', 'neighbor', 'noise', 'loud music', 'barking'],
    level: 'low', weight: 1,
  },
  {
    words: ['street light', 'street lamp', 'lamp post', 'lighting'],
    level: 'low', weight: 1,
  },
  {
    words: ['parking', 'parking space', 'parking issue', 'vehicle'],
    level: 'low', weight: 1,
  },
  {
    words: ['suggestion', 'inquiry', 'request', 'feedback', 'opinion', 'proposal', 'question'],
    level: 'low', weight: 1,
  },
  {
    words: ['document', 'certificate', 'application', 'form', 'registration', 'renewal', 'license'],
    level: 'low', weight: 1,
  },
  {
    words: ['pet', 'stray dog', 'stray cat', 'animal', 'cow'],
    level: 'low', weight: 1,
  },
  {
    words: ['garden', 'park', 'playground', 'recreation', 'community center'],
    level: 'low', weight: 1,
  },
  {
    words: ['paint', 'plaster', 'fence', 'gate', 'roof', 'wall', 'door', 'window'],
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
    return { level: 'low', confidence: 0, matchedKeywords: [] };
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
