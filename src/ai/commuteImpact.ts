/**
 * Commute AI Impact Estimator
 * Calculates comprehensive impact metrics for commute changes
 */

export interface CommuteImpact {
  monthlyHoursSaved: number;
  yearlyHoursSaved: number;
  co2SavedEstimate: number; // in kg
  stressReductionLevel: 'low' | 'medium' | 'high';
  costSavingsMonthly: number; // in USD
  costSavingsYearly: number; // in USD
  productivityGain: number; // percentage
}

/**
 * Calculate comprehensive commute impact
 */
export function calculateCommuteImpact(
  beforeMinutes: number,
  afterMinutes: number,
  workingDaysPerMonth: number = 22
): CommuteImpact {
  const dailySavingsMinutes = (beforeMinutes - afterMinutes) * 2; // Round trip
  const monthlyMinutesSaved = dailySavingsMinutes * workingDaysPerMonth;
  const monthlyHoursSaved = monthlyMinutesSaved / 60;
  const yearlyHoursSaved = monthlyHoursSaved * 12;

  // CO2 estimate: ~0.4 kg CO2 per km, average speed 50 km/h
  // Rough estimate: 0.5 kg CO2 per 30 minutes of driving
  const co2SavedEstimate = (monthlyMinutesSaved / 30) * 0.5;

  // Stress reduction based on commute reduction
  const reductionPercentage = (dailySavingsMinutes / (beforeMinutes * 2)) * 100;
  let stressReductionLevel: 'low' | 'medium' | 'high' = 'low';
  if (reductionPercentage >= 50) {
    stressReductionLevel = 'high';
  } else if (reductionPercentage >= 25) {
    stressReductionLevel = 'medium';
  }

  // Cost savings: $25/hour average value of time + fuel costs
  const hourlyValue = 25;
  const fuelCostPerMinute = 0.15; // Rough estimate
  const costSavingsMonthly = 
    (monthlyHoursSaved * hourlyValue) + 
    (monthlyMinutesSaved * fuelCostPerMinute);
  const costSavingsYearly = costSavingsMonthly * 12;

  // Productivity gain: Less commute = more energy for work
  const productivityGain = Math.min(reductionPercentage * 0.8, 30); // Cap at 30%

  return {
    monthlyHoursSaved: Math.round(monthlyHoursSaved * 10) / 10,
    yearlyHoursSaved: Math.round(yearlyHoursSaved * 10) / 10,
    co2SavedEstimate: Math.round(co2SavedEstimate * 10) / 10,
    stressReductionLevel,
    costSavingsMonthly: Math.round(costSavingsMonthly),
    costSavingsYearly: Math.round(costSavingsYearly),
    productivityGain: Math.round(productivityGain),
  };
}

/**
 * Get impact description text
 */
export function getImpactDescription(impact: CommuteImpact): string {
  const parts: string[] = [];

  if (impact.monthlyHoursSaved >= 10) {
    parts.push(`Save ${impact.monthlyHoursSaved} hours/month`);
  }

  if (impact.co2SavedEstimate >= 5) {
    parts.push(`Reduce ${impact.co2SavedEstimate}kg CO₂/month`);
  }

  if (impact.stressReductionLevel === 'high') {
    parts.push('Significant stress reduction');
  }

  return parts.join(' • ') || 'Moderate commute improvement';
}
