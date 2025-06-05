export const TYPE_COLOR = {
  event: { bg: "bg-blue-500", color: "#3b82f6" },
  task: { bg: "bg-amber-500", color: "#f49e0b" },
  "study-plan": { bg: "bg-emerald-500", color: "#10b981" },
  birthday: { bg: "bg-purple-500", color: "#8b5cf6" },
  default: { bg: "bg-gray-500", color: "#6b7280" },
} as const;

export type ItemType = keyof typeof TYPE_COLOR;

export const getTypeColor = (type: ItemType) =>
  TYPE_COLOR[type] ?? TYPE_COLOR.default;
