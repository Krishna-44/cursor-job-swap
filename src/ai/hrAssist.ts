/**
 * HR AI Assist Module
 * Provides AI-powered recommendations for HR approval decisions
 */

import { HRRequest } from '@/mock/data';
import { calculateCompatibilityScore } from './embedding';
import { calculateCommuteImpact } from './commuteImpact';

export type HRRecommendation = 'approve' | 'review' | 'reject';

export interface HRAIAnalysis {
  recommendation: HRRecommendation;
  confidence: number; // 0-100
  reasoning: string;
  riskFactors: string[];
  benefits: string[];
  score: number; // 0-100
}

/**
 * Analyze HR request and provide AI recommendation
 */
export async function analyzeHRRequest(request: HRRequest): Promise<HRAIAnalysis> {
  // Calculate compatibility score
  const compatibility = await calculateCompatibilityScore({
    userSkills: request.fromUserSkills,
    userJobTitle: request.fromUserJobTitle,
    matchSkills: request.fromUserSkills, // Using same for now, would be match user's skills
    matchJobTitle: request.toUserJobTitle,
    commuteBeforeMinutes: request.commuteSavingsMinutes + request.commuteSavingsMinutes / 2,
    commuteAfterMinutes: request.commuteSavingsMinutes / 2,
    salaryCompatible: true, // Assuming HR requests are pre-filtered
  });

  // Calculate commute impact
  const commuteImpact = calculateCommuteImpact(
    request.commuteSavingsMinutes + request.commuteSavingsMinutes / 2,
    request.commuteSavingsMinutes / 2
  );

  // Risk factors
  const riskFactors: string[] = [];
  if (compatibility.breakdown.skillSimilarity < 60) {
    riskFactors.push('Low skill overlap');
  }
  if (compatibility.breakdown.roleSimilarity < 70) {
    riskFactors.push('Role level mismatch');
  }
  if (request.commuteSavingsMinutes < 20) {
    riskFactors.push('Minimal commute improvement');
  }

  // Benefits
  const benefits: string[] = [];
  if (compatibility.breakdown.skillSimilarity >= 80) {
    benefits.push('Strong skill alignment');
  }
  if (commuteImpact.monthlyHoursSaved >= 10) {
    benefits.push(`Saves ${commuteImpact.monthlyHoursSaved} hours/month`);
  }
  if (commuteImpact.co2SavedEstimate >= 5) {
    benefits.push(`Reduces ${commuteImpact.co2SavedEstimate}kg CO₂/month`);
  }
  if (request.estimatedCostSavings >= 2000) {
    benefits.push(`Estimated $${request.estimatedCostSavings}/month savings`);
  }

  // Calculate overall score
  const score = Math.round(
    compatibility.score * 0.6 +
    (commuteImpact.productivityGain / 30) * 100 * 0.2 +
    (request.estimatedCostSavings / 5000) * 100 * 0.2
  );

  // Determine recommendation
  let recommendation: HRRecommendation = 'review';
  let confidence = 50;

  if (score >= 80 && riskFactors.length === 0) {
    recommendation = 'approve';
    confidence = 85 + Math.min(score - 80, 15);
  } else if (score < 50 || riskFactors.length >= 3) {
    recommendation = 'reject';
    confidence = 70;
  } else {
    recommendation = 'review';
    confidence = 60;
  }

  // Generate reasoning
  const reasoning = generateHRReasoning(
    recommendation,
    compatibility,
    commuteImpact,
    riskFactors,
    benefits
  );

  return {
    recommendation,
    confidence,
    reasoning,
    riskFactors,
    benefits,
    score: Math.min(score, 100),
  };
}

/**
 * Generate human-readable reasoning for HR recommendation
 */
function generateHRReasoning(
  recommendation: HRRecommendation,
  compatibility: { score: number; breakdown: any },
  commuteImpact: any,
  riskFactors: string[],
  benefits: string[]
): string {
  if (recommendation === 'approve') {
    return `Strong match (${compatibility.score}% compatibility). ${benefits.join(', ')}. Low risk factors.`;
  } else if (recommendation === 'reject') {
    return `Weak match (${compatibility.score}% compatibility). ${riskFactors.join(', ')}. Limited benefits.`;
  } else {
    return `Moderate match (${compatibility.score}% compatibility). ${benefits.slice(0, 2).join(', ')}. Review required due to: ${riskFactors.slice(0, 1).join(', ')}.`;
  }
}
