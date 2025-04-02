// Resource allocation constraints
export const CPU_CONSTRAINTS = {
  MIN: 0.5,
  MAX: 6,
  DEFAULT: 0.5,
  STEP: 0.1,
};

export const MEMORY_CONSTRAINTS = {
  MIN_MI: 128,
  MIN_GI: 0.125,
  MAX_GI: 6,
  MAX_MI: 6144,
  DEFAULT_MI: 512,
  DEFAULT_GI: 0.5,
};

export const DURATION_CONSTRAINTS = {
  MIN_HOURS: 1,
  MAX_HOURS: 168, // 7 days
  DEFAULT_HOURS: 1,
  QUICK_SELECTIONS: [1, 24, 72, 168], // 1 hour, 1 day, 3 days, 7 days
};

export const ENVIRONMENT_VARS_DEFAULT =
  '{\n  "NODE_ENV": "production"\n}';

export type Unit = "Mi" | "Gi";
