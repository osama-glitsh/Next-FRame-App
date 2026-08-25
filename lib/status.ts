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
