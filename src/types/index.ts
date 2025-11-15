export interface ROKEvent {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  eventType:
    | "kingdom"
    | "alliance"
    | "personal"
    | "special"
    | "kvk"
    | "ceremony"
    | "training"
    | "competitive"
    | "gathering"
    | "expedition"
    | "wheel"
    | "card"
    | "power"
    | "building"
    | "research"
    | "commander"
    | "troop"
    | "barbarian"
    | "fort"
    | "resource"
    | "vip"
    | "recharge"
    | "alliance_war";
  category:
    | "daily"
    | "weekly"
    | "monthly"
    | "seasonal"
    | "kvk_season"
    | "special_occasion"
    | "limited_time"
    | "permanent";
  priority: "low" | "medium" | "high" | "critical";
  rewards: string[];
  requirements?: string;
  completed: boolean;
  repeatable: boolean;
  kingdomLevel?: number;
  minPower?: number;
  eventStage?: string;
  repeatPattern?: "daily" | "weekly" | "monthly" | "yearly"; // Thêm pattern lặp
  repeatCount?: number; // Số lần lặp, undefined = vô hạn
}

export type EventType = ROKEvent["eventType"];
export type PriorityLevel = ROKEvent["priority"];
export type EventCategory = ROKEvent["category"];
export type RepeatPattern = ROKEvent["repeatPattern"];
