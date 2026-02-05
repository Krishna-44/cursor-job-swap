/**
 * AI Recommendation Engine
 * Ranks and recommends top swap partners using AI-powered scoring
 */

import { Match } from '@/mock/data';
import { calculateCompatibilityScore } from './embedding';

export interface AIRecommendation {
  match: Match;
  score: number;
  reasoning: string;
  isRecommended: boolean;
}

/**
 * Get AI-recommended matches (top 3)
 */
export async function getAIRecommendations(
  userSkills: string[],
  userJobTitle: string,
  allMatches: Match[]
): Promise<AIRecommendation[]> {
  const recommendations: AIRecommendation[] = [];

  for (const match of allMatches) {
    const compatibility = await calculateCompatibilityScore({
      userSkills,
      userJobTitle,
      matchSkills: match.skills,
      matchJobTitle: match.jobTitle,
      commuteBeforeMinutes: match.commuteBeforeMinutes,
      commuteAfterMinutes: match.commuteAfterMinutes,
      salaryCompatible: match.salaryCompatible,
    });

    const reasoning = generateRecommendationReasoning(
      compatibility.breakdown,
      match
    );

    recommendations.push({
      match,
      score: compatibility.score,
      reasoning,
      isRecommended: false, // Will be set to true for top 3
    });
  }

  // Sort by score descending
  recommendations.sort((a, b) => b.score - a.score);

  // Mark top 3 as recommended
  recommendations.slice(0, 3).forEach(rec => {
    rec.isRecommended = true;
  });

  return recommendations;
}

/**
 * Generate human-readable reasoning for recommendation
 */
function generateRecommendationReasoning(
  breakdown: {
    skillSimilarity: number;
    roleSimilarity: number;
    commuteGain: number;
    salaryMatch: number;
  },
  match: Match
): string {
  const reasons: string[] = [];

  if (breakdown.skillSimilarity >= 80) {
    reasons.push('Excellent skill match');
  } else if (breakdown.skillSimilarity >= 60) {
    reasons.push('Strong skill alignment');
  }

  if (breakdown.roleSimilarity >= 80) {
    reasons.push('Similar role level');
  }

  const commuteSavings = match.commuteBeforeMinutes - match.commuteAfterMinutes;
  if (commuteSavings >= 40) {
    reasons.push(`Saves ${commuteSavings} min/day`);
  } else if (commuteSavings >= 20) {
    reasons.push(`Moderate commute reduction`);
  }

  if (breakdown.salaryMatch === 100) {
    reasons.push('Salary band compatible');
  }

  return reasons.length > 0 
    ? reasons.join(' • ')
    : 'Good overall compatibility';
}
