export interface UserDetails {
  name: string;
  age: string;
  gender: string;
  email: string;
}

export interface QuestionnaireData {
  hairFallSeverity: "low" | "medium" | "high" | "";
  familyHistory: "yes" | "no" | "";
  stressLevel: "low" | "moderate" | "high" | "";
  dietQuality: "poor" | "average" | "good" | "excellent" | "";
  sleepDuration: "less_than_5" | "5_to_7" | "7_to_9" | "more_than_9" | "";
  scalpItching: boolean;
  scalpDandruff: boolean;
  scalpRedness: boolean;
  hairWashFrequency: "daily" | "every_other_day" | "twice_weekly" | "weekly" | "";
  useHeatStyling: boolean;
  useChemicalTreatments: boolean;
}

export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  label: "front_hairline" | "crown_top" | "side_view" | "scalp_closeup";
}

export interface AssessmentData {
  userDetails: UserDetails;
  questionnaire: QuestionnaireData;
  images: UploadedImage[];
}

export interface HairHealthReport {
  overallRiskLevel: "low" | "medium" | "high";
  riskScore: number;
  possibleCauses: string[];
  recommendations: string[];
  lifestyleImpact: "low" | "moderate" | "significant";
  scalpHealthWarning: boolean;
  generatedAt: Date;
}

export const initialUserDetails: UserDetails = {
  name: "",
  age: "",
  gender: "",
  email: "",
};

export const initialQuestionnaire: QuestionnaireData = {
  hairFallSeverity: "",
  familyHistory: "",
  stressLevel: "",
  dietQuality: "",
  sleepDuration: "",
  scalpItching: false,
  scalpDandruff: false,
  scalpRedness: false,
  hairWashFrequency: "",
  useHeatStyling: false,
  useChemicalTreatments: false,
};

export const imageLabels = {
  front_hairline: "Front Hairline",
  crown_top: "Crown/Top View",
  side_view: "Side View",
  scalp_closeup: "Scalp Close-up",
} as const;
