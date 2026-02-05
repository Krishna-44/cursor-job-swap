/**
 * AI Embeddings Module
 * Generates embeddings using OpenAI API and performs similarity matching
 * Falls back to mock embeddings if API key is missing
 */

export interface EmbeddingVector {
  vector: number[];
  text: string;
}

/**
 * Generate embedding vector for text using OpenAI API
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    console.warn('OpenAI API key not found, using mock embedding');
    return mockGenerateEmbedding(text);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    console.warn('Falling back to mock embedding');
    return mockGenerateEmbedding(text);
  }
}

/**
 * Mock embedding generator (fallback)
 * Creates a simple hash-based vector
 */
function mockGenerateEmbedding(text: string): number[] {
  // Create a deterministic 384-dimensional vector based on text hash
  const hash = text.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  
  const vector: number[] = [];
  for (let i = 0; i < 384; i++) {
    const seed = hash + i * 1000;
    vector.push(Math.sin(seed) * 0.5 + 0.5);
  }
  
  // Normalize vector
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map(val => val / magnitude);
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
}

/**
 * Generate embedding for user profile (skills + job title)
 */
export async function generateProfileEmbedding(
  skills: string[],
  jobTitle: string
): Promise<number[]> {
  const profileText = `${jobTitle}. Skills: ${skills.join(', ')}`;
  return generateEmbedding(profileText);
}

/**
 * Calculate compatibility score between two profiles
 * Formula: 0.5 skill similarity + 0.2 role similarity + 0.2 commute gain + 0.1 salary band
 */
export async function calculateCompatibilityScore(params: {
  userSkills: string[];
  userJobTitle: string;
  matchSkills: string[];
  matchJobTitle: string;
  commuteBeforeMinutes: number;
  commuteAfterMinutes: number;
  salaryCompatible: boolean;
}): Promise<{
  score: number;
  breakdown: {
    skillSimilarity: number;
    roleSimilarity: number;
    commuteGain: number;
    salaryMatch: number;
  };
}> {
  const {
    userSkills,
    userJobTitle,
    matchSkills,
    matchJobTitle,
    commuteBeforeMinutes,
    commuteAfterMinutes,
    salaryCompatible,
  } = params;

  // Skill similarity (0-1)
  const userSkillsText = userSkills.join(', ');
  const matchSkillsText = matchSkills.join(', ');
  const userSkillsEmbedding = await generateEmbedding(userSkillsText);
  const matchSkillsEmbedding = await generateEmbedding(matchSkillsText);
  const skillSimilarity = cosineSimilarity(userSkillsEmbedding, matchSkillsEmbedding);

  // Role similarity (0-1)
  const userRoleEmbedding = await generateEmbedding(userJobTitle);
  const matchRoleEmbedding = await generateEmbedding(matchJobTitle);
  const roleSimilarity = cosineSimilarity(userRoleEmbedding, matchRoleEmbedding);

  // Commute gain (0-1, normalized)
  const commuteSavings = commuteBeforeMinutes - commuteAfterMinutes;
  const commuteGain = Math.min(commuteSavings / 60, 1); // Normalize to 0-1 (max 60 min savings)

  // Salary match (0 or 1)
  const salaryMatch = salaryCompatible ? 1 : 0;

  // Weighted score
  const score = Math.round(
    skillSimilarity * 0.5 +
    roleSimilarity * 0.2 +
    commuteGain * 0.2 +
    salaryMatch * 0.1
  ) * 100;

  return {
    score: Math.min(score, 100),
    breakdown: {
      skillSimilarity: Math.round(skillSimilarity * 100),
      roleSimilarity: Math.round(roleSimilarity * 100),
      commuteGain: Math.round(commuteGain * 100),
      salaryMatch: salaryMatch * 100,
    },
  };
}
