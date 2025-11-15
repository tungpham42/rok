import { ROKEvent } from "../types";
import dayjs from "dayjs";

// Base events với repeat pattern
export const baseROKEvents: ROKEvent[] = [
  // ==================== SỰ KIỆN HẰNG NGÀY ====================
//   {
//     id: "daily-1",
//     title: "Nhiệm Vụ Thường Nhật",
//     description:
//       "Hoàn thành các nhiệm vụ hàng ngày để nhận phần thưởng phong phú",
//     startTime: dayjs().startOf("day").format("YYYY-MM-DD HH:mm"),
//     endTime: dayjs().endOf("day").format("YYYY-MM-DD HH:mm"),
//     eventType: "personal",
//     category: "daily",
//     priority: "medium",
//     rewards: ["Ngọc", "Tăng tốc", "Tài nguyên", "Điểm VIP"],
//     requirements: "Thành phố cấp 7",
//     completed: false,
//     repeatable: true,
//     repeatPattern: "daily",
//   },
//   {
//     id: "daily-2",
//     title: "Vua Kẻ Cướp",
//     description: "Tiêu diệt Barbarians và Forts để tích lũy điểm cá nhân",
//     startTime: dayjs().startOf("day").format("YYYY-MM-DD HH:mm"),
//     endTime: dayjs().endOf("day").format("YYYY-MM-DD HH:mm"),
//     eventType: "barbarian",
//     category: "daily",
//     priority: "medium",
//     rewards: ["Tượng Tướng", "Tăng tốc", "Tài nguyên"],
//     requirements: "Thành phố cấp 10",
//     completed: false,
//     repeatable: true,
//     repeatPattern: "daily",
//   },

  // ==================== SỰ KIỆN HÀNG TUẦN ====================
  {
    id: "weekly-1",
    title: "Lễ Hội Karuak",
    description: "Săn quái toàn server, tích lũy điểm cá nhân và liên minh",
    startTime: dayjs().startOf("week").add(1, "day").format("YYYY-MM-DD HH:mm"),
    endTime: dayjs().startOf("week").add(3, "day").format("YYYY-MM-DD HH:mm"),
    eventType: "ceremony",
    category: "weekly",
    priority: "high",
    rewards: ["Tượng Vàng", "Tượng Đa Năng", "Tăng tốc Huấn luyện"],
    requirements: "Thành phố cấp 16",
    completed: false,
    repeatable: true,
    repeatPattern: "weekly",
  },
  {
    id: "weekly-2",
    title: "Kho Dự Trữ Chiến Lược",
    description: "Thu thập và sử dụng tài nguyên để nhận thưởng",
    startTime: dayjs().startOf("week").add(3, "day").format("YYYY-MM-DD HH:mm"),
    endTime: dayjs().startOf("week").add(5, "day").format("YYYY-MM-DD HH:mm"),
    eventType: "resource",
    category: "weekly",
    priority: "medium",
    rewards: ["Ngọc", "Thẻ Tài nguyên", "Tăng tốc"],
    requirements: "Thành phố cấp 12",
    completed: false,
    repeatable: true,
    repeatPattern: "weekly",
  },

  // ==================== SỰ KIỆN HÀNG THÁNG ====================
  {
    id: "monthly-1",
    title: "Sự Kiện Quân Chủ Vĩ Đại (MGE)",
    description: "Cạnh tranh để nhận tướng huyền thoại mới",
    startTime: dayjs()
      .startOf("month")
      .add(5, "day")
      .format("YYYY-MM-DD HH:mm"),
    endTime: dayjs().startOf("month").add(12, "day").format("YYYY-MM-DD HH:mm"),
    eventType: "competitive",
    category: "monthly",
    priority: "critical",
    rewards: ["Tượng Vàng", "Tướng Huyền thoại", "Khung Avatar"],
    requirements: "Thành phố cấp 25, Sức mạnh tối thiểu",
    completed: false,
    repeatable: true,
    repeatPattern: "monthly",
    minPower: 5000000,
  },
  {
    id: "monthly-2",
    title: "Vương Quốc Vàng",
    description: "Sự kiện cạnh tranh toàn vương quốc với nhiều giai đoạn",
    startTime: dayjs()
      .startOf("month")
      .add(10, "day")
      .format("YYYY-MM-DD HH:mm"),
    endTime: dayjs().startOf("month").add(17, "day").format("YYYY-MM-DD HH:mm"),
    eventType: "kingdom",
    category: "monthly",
    priority: "high",
    rewards: ["Tượng Đa Năng", "Ngọc", "Khung Đặc biệt"],
    requirements: "Thành phố cấp 20",
    completed: false,
    repeatable: true,
    repeatPattern: "monthly",
  },

  // ==================== SỰ KIỆN LIÊN MINH ====================
  {
    id: "alliance-1",
    title: "Rương Thánh Osiris",
    description: "Chiến trường liên minh 30vs30, chiếm và bảo vệ Rương Thánh",
    startTime: dayjs().startOf("week").add(2, "day").format("YYYY-MM-DD HH:mm"),
    endTime: dayjs()
      .startOf("week")
      .add(2, "day")
      .add(2, "hour")
      .format("YYYY-MM-DD HH:mm"),
    eventType: "alliance_war",
    category: "weekly",
    priority: "high",
    rewards: ["Rương Osiris", "Tượng Tướng", "Vật liệu"],
    requirements: "Liên minh cấp 4, 30 thành viên",
    completed: false,
    repeatable: true,
    repeatPattern: "weekly",
  },

  // ==================== SỰ KIỆN VÒNG QUAY ====================
  {
    id: "wheel-1",
    title: "Vòng Quay Vận Mệnh",
    description: "Vòng quay cho tướng mới xuất hiện",
    startTime: dayjs()
      .startOf("month")
      .add(3, "day")
      .format("YYYY-MM-DD HH:mm"),
    endTime: dayjs().startOf("month").add(10, "day").format("YYYY-MM-DD HH:mm"),
    eventType: "wheel",
    category: "monthly",
    priority: "high",
    rewards: ["Tướng Mới", "Tượng Vàng", "Ngọc"],
    requirements: "Thành phố cấp 16",
    completed: false,
    repeatable: true,
    repeatPattern: "monthly",
  },

  // ==================== SỰ KIỆN NẠP ====================
  {
    id: "recharge-1",
    title: "Nhiều Hơn Cả Ngọc",
    description: "Nạp ngọc nhận thưởng bonus giá trị",
    startTime: dayjs()
      .startOf("month")
      .add(1, "day")
      .format("YYYY-MM-DD HH:mm"),
    endTime: dayjs().startOf("month").add(4, "day").format("YYYY-MM-DD HH:mm"),
    eventType: "recharge",
    category: "monthly",
    priority: "medium",
    rewards: ["Ngọc Bonus", "Tượng Tướng", "Tăng tốc"],
    requirements: "Nạp ngọc",
    completed: false,
    repeatable: true,
    repeatPattern: "monthly",
  },

  // ==================== SỰ KIỆN THEO MÙA ====================
  {
    id: "seasonal-1",
    title: "Thế Vận Hội Olympia",
    description: "Sự kiện thể thao với nhiều minigame và thử thách",
    startTime: dayjs()
      .startOf("month")
      .add(7, "day")
      .format("YYYY-MM-DD HH:mm"),
    endTime: dayjs().startOf("month").add(14, "day").format("YYYY-MM-DD HH:mm"),
    eventType: "special",
    category: "seasonal",
    priority: "medium",
    rewards: ["Huy chương Olympia", "Avatar Đặc biệt", "Tài nguyên"],
    requirements: "Thành phố cấp 10",
    completed: false,
    repeatable: true,
    repeatPattern: "monthly",
  },

  // ==================== SỰ KIỆN KVK (KINGDOM VS KINGDOM) ====================
  {
    id: "kvk-1",
    title: "KVK Season 1: Tiên Khởi",
    description:
      "Chiến dịch KvK đầu tiên, 8 vương quốc chiến đấu tại Lost Kingdom",
    startTime: dayjs()
      .startOf("month")
      .add(15, "day")
      .format("YYYY-MM-DD HH:mm"),
    endTime: dayjs().startOf("month").add(45, "day").format("YYYY-MM-DD HH:mm"),
    eventType: "kvk",
    category: "kvk_season",
    priority: "critical",
    rewards: ["Tướng KvK", "Khung Avatar KvK", "Vật phẩm đặc biệt"],
    requirements: "Thành phố cấp 16, Vương quốc đủ 60 ngày",
    completed: false,
    repeatable: true,
    repeatPattern: "monthly",
  },
  {
    id: "kvk-2",
    title: "KVK Season 2: Vương Giả",
    description: "Mùa KvK thứ hai với cơ chế Holy Ground và Crystal",
    startTime: dayjs()
      .startOf("month")
      .add(45, "day")
      .format("YYYY-MM-DD HH:mm"),
    endTime: dayjs().startOf("month").add(75, "day").format("YYYY-MM-DD HH:mm"),
    eventType: "kvk",
    category: "kvk_season",
    priority: "critical",
    rewards: ["Tướng KvK", "Khung Avatar KvK", "Crystal Key"],
    requirements: "Thành phố cấp 18, Hoàn thành KvK S1",
    completed: false,
    repeatable: true,
    repeatPattern: "monthly",
  },
  {
    id: "kvk-3",
    title: "KVK Season 3: Đế Vương",
    description: "Mùa KvK thứ ba với cơ chế Ark of Osiris nâng cao",
    startTime: dayjs()
      .startOf("month")
      .add(75, "day")
      .format("YYYY-MM-DD HH:mm"),
    endTime: dayjs()
      .startOf("month")
      .add(105, "day")
      .format("YYYY-MM-DD HH:mm"),
    eventType: "kvk",
    category: "kvk_season",
    priority: "critical",
    rewards: ["Tướng KvK", "Khung Avatar KvK", "Vật phẩm Legendary"],
    requirements: "Thành phố cấp 20, Hoàn thành KvK S2",
    completed: false,
    repeatable: true,
    repeatPattern: "monthly",
  },
  {
    id: "kvk-4",
    title: "KVK Season 4: Lục Địa Châu Á",
    description: "KvK với bản đồ châu Á và cơ chế mới",
    startTime: dayjs()
      .startOf("month")
      .add(105, "day")
      .format("YYYY-MM-DD HH:mm"),
    endTime: dayjs()
      .startOf("month")
      .add(135, "day")
      .format("YYYY-MM-DD HH:mm"),
    eventType: "kvk",
    category: "kvk_season",
    priority: "critical",
    rewards: ["Tướng KvK", "Khung Avatar KvK", "Asian Artifacts"],
    requirements: "Thành phố cấp 22, Hoàn thành KvK S3",
    completed: false,
    repeatable: true,
    repeatPattern: "monthly",
  },
  {
    id: "kvk-5",
    title: "KVK Season 5: Vương Triều",
    description: "KvK với cơ chế Dynasty và Imperial Conquest",
    startTime: dayjs()
      .startOf("month")
      .add(135, "day")
      .format("YYYY-MM-DD HH:mm"),
    endTime: dayjs()
      .startOf("month")
      .add(165, "day")
      .format("YYYY-MM-DD HH:mm"),
    eventType: "kvk",
    category: "kvk_season",
    priority: "critical",
    rewards: ["Tướng KvK", "Khung Avatar KvK", "Imperial Treasures"],
    requirements: "Thành phố cấp 24, Hoàn thành KvK S4",
    completed: false,
    repeatable: true,
    repeatPattern: "monthly",
  },
  {
    id: "kvk-6",
    title: "KVK Season 6: Hỏa Ngục",
    description: "KvK với chủ đề Hell và cơ chế Infernal Altars",
    startTime: dayjs()
      .startOf("month")
      .add(165, "day")
      .format("YYYY-MM-DD HH:mm"),
    endTime: dayjs()
      .startOf("month")
      .add(195, "day")
      .format("YYYY-MM-DD HH:mm"),
    eventType: "kvk",
    category: "kvk_season",
    priority: "critical",
    rewards: ["Tướng KvK", "Khung Avatar KvK", "Infernal Rewards"],
    requirements: "Thành phố cấp 25, Hoàn thành KvK S5",
    completed: false,
    repeatable: true,
    repeatPattern: "monthly",
  },
  {
    id: "kvk-7",
    title: "KVK Season 7: Thánh Địa",
    description: "KvK với cơ chế Holy Sanctuary và Divine Blessings",
    startTime: dayjs()
      .startOf("month")
      .add(195, "day")
      .format("YYYY-MM-DD HH:mm"),
    endTime: dayjs()
      .startOf("month")
      .add(225, "day")
      .format("YYYY-MM-DD HH:mm"),
    eventType: "kvk",
    category: "kvk_season",
    priority: "critical",
    rewards: ["Tướng KvK", "Khung Avatar KvK", "Divine Artifacts"],
    requirements: "Thành phố cấp 25, Hoàn thành KvK S6",
    completed: false,
    repeatable: true,
    repeatPattern: "monthly",
  },
  {
    id: "kvk-8",
    title: "KVK Season 8: Tân Thế Giới",
    description: "KvK với bản đồ hoàn toàn mới và cơ chế Advanced Warfare",
    startTime: dayjs()
      .startOf("month")
      .add(225, "day")
      .format("YYYY-MM-DD HH:mm"),
    endTime: dayjs()
      .startOf("month")
      .add(255, "day")
      .format("YYYY-MM-DD HH:mm"),
    eventType: "kvk",
    category: "kvk_season",
    priority: "critical",
    rewards: ["Tướng KvK", "Khung Avatar KvK", "Advanced Rewards"],
    requirements: "Thành phố cấp 25, Hoàn thành KvK S7",
    completed: false,
    repeatable: true,
    repeatPattern: "monthly",
  },
];

// Hàm tạo events vô hạn
export const generateInfiniteEvents = (
  monthsAhead: number = 12
): ROKEvent[] => {
  const allEvents: ROKEvent[] = [];

  baseROKEvents.forEach((baseEvent) => {
    if (!baseEvent.repeatPattern) {
      // Sự kiện không lặp lại, thêm vào như cũ
      allEvents.push(baseEvent);
      return;
    }

    // Tạo events cho số tháng chỉ định
    for (let i = 0; i < monthsAhead; i++) {
      let startTime = dayjs(baseEvent.startTime);
      let endTime = dayjs(baseEvent.endTime);

      // Tính toán thời gian cho lần lặp tiếp theo
      switch (baseEvent.repeatPattern) {
        case "daily":
          startTime = startTime.add(i, "day");
          endTime = endTime.add(i, "day");
          break;
        case "weekly":
          startTime = startTime.add(i, "week");
          endTime = endTime.add(i, "week");
          break;
        case "monthly":
          startTime = startTime.add(i, "month");
          endTime = endTime.add(i, "month");
          break;
        case "yearly":
          startTime = startTime.add(i, "year");
          endTime = endTime.add(i, "year");
          break;
      }

      // Tạo event mới với ID duy nhất
      const repeatedEvent: ROKEvent = {
        ...baseEvent,
        id: `${baseEvent.id}-${i}`,
        startTime: startTime.format("YYYY-MM-DD HH:mm"),
        endTime: endTime.format("YYYY-MM-DD HH:mm"),
      };

      allEvents.push(repeatedEvent);
    }
  });

  return allEvents;
};

// Tạo events cho 720 tháng (60 năm) tới
export const allROKEvents = generateInfiniteEvents(720);
