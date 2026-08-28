export const PROJECT_STATUSES = [
  "submitted",
  "reviewing",
  "in_production",
  "qa",
  "delivered",
  "archived",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const STATUS_LABEL_AR: Record<string, string> = {
  submitted: "تم الإرسال",
  reviewing: "قيد المراجعة",
  in_production: "في الإنتاج",
  qa: "مراجعة الجودة",
  delivered: "تم التسليم",
  archived: "مؤرشف",
};

export const STATUS_ORDER: Record<string, number> = {
  submitted: 0,
  reviewing: 1,
  in_production: 2,
  qa: 3,
  delivered: 4,
  archived: 5,
};

// 5-stage production pipeline shown as a horizontal timeline on the dashboard
export const STAGE_STEPS: { key: string; label_ar: string; label_en: string }[] = [
  { key: "submitted", label_ar: "بريف", label_en: "BRIEF" },
  { key: "reviewing", label_ar: "الفكرة", label_en: "CONCEPT" },
  { key: "in_production", label_ar: "الإنتاج", label_en: "PRODUCTION" },
  { key: "qa", label_ar: "الجودة", label_en: "QA" },
  { key: "delivered", label_ar: "الإطلاق", label_en: "LAUNCH" },
];

export const STATUS_PROGRESS: Record<string, number> = {
  submitted: 10,
  reviewing: 30,
  in_production: 65,
  qa: 85,
  delivered: 100,
  archived: 100,
};
