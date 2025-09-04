import { EnvironmentType } from '@ekotracker/shared';

interface WeightCalculationParams {
  urgency: number; // 1-5
  appearance: number; // 1-5
  environmentType: EnvironmentType;
  reportsCount: number;
  proximity?: number; // 0-1, stub for future implementation
}

const ENVIRONMENT_SENSITIVITY_MAP: Record<EnvironmentType, number> = {
  [EnvironmentType.RIVER]: 1.0,
  [EnvironmentType.PARK]: 0.7,
  [EnvironmentType.RESIDENTIAL]: 0.6,
  [EnvironmentType.INDUSTRIAL]: 0.4,
  [EnvironmentType.OTHER]: 0.3,
};

const WEIGHT_COEFFICIENTS = {
  urgency: 1.4,
  appearance: 1.0,
  environment: 2.0,
  reports: 1.2,
  proximity: 1.5,
};

/**
 * Normalizes a value from 1-5 scale to 0-1 scale
 */
function normalizeRating(value: number): number {
  return (value - 1) / 4;
}

/**
 * Calculates report factor using logarithmic scale
 */
function calculateReportFactor(reportsCount: number): number {
  return Math.log(reportsCount + 1) / Math.log(10);
}

/**
 * Calculates the weight/priority score for a dump
 * Formula: weight = (baseUrgency * 1.4) + (appearance * 1.0) + (envSensitivity * 2.0) + (reportFactor * 1.2) + (proximity * 1.5)
 */
export function calculateWeight(params: WeightCalculationParams): number {
  const {
    urgency,
    appearance,
    environmentType,
    reportsCount,
    proximity = 0,
  } = params;

  const normalizedUrgency = normalizeRating(urgency);
  const normalizedAppearance = normalizeRating(appearance);
  const envSensitivity = ENVIRONMENT_SENSITIVITY_MAP[environmentType];
  const reportFactor = calculateReportFactor(reportsCount);

  const weight =
    normalizedUrgency * WEIGHT_COEFFICIENTS.urgency +
    normalizedAppearance * WEIGHT_COEFFICIENTS.appearance +
    envSensitivity * WEIGHT_COEFFICIENTS.environment +
    reportFactor * WEIGHT_COEFFICIENTS.reports +
    proximity * WEIGHT_COEFFICIENTS.proximity;

  return Math.round(weight * 100) / 100; // Round to 2 decimal places
}

/**
 * Checks if the weight exceeds the notification threshold
 */
export function shouldSendNotification(weight: number): boolean {
  const threshold = parseFloat(process.env.NOTIFICATION_EMAIL_THRESHOLD || '6.5');
  return weight >= threshold;
}