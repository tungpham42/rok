import React, { useMemo, useState } from "react";
import {
  List,
  Tag,
  Space,
  Card,
  Button,
  DatePicker,
  ConfigProvider,
} from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { ROKEvent } from "../types";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import vi_VN from "antd/locale/vi_VN";

// Thiết lập locale cho dayjs
dayjs.locale("vi");

interface EventListProps {
  events: ROKEvent[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  // Sắp xếp events theo ngày bắt đầu
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      return dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf();
    });
  }, [events]);

  // Lọc events theo tháng hiện tại
  const currentMonthEvents = useMemo(() => {
    return sortedEvents.filter((event) => {
      const eventDate = dayjs(event.startTime);
      return (
        eventDate.month() === currentMonth.month() &&
        eventDate.year() === currentMonth.year()
      );
    });
  }, [sortedEvents, currentMonth]);

  // Nhóm events theo ngày trong tháng hiện tại
  const eventsByDay = useMemo(() => {
    const groups: { [key: string]: ROKEvent[] } = {};

    currentMonthEvents.forEach((event) => {
      const dateKey = dayjs(event.startTime).format("YYYY-MM-DD");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
    });

    return groups;
  }, [currentMonthEvents]);

  // Hàm chuyển đổi thứ sang tiếng Việt
  const getVietnameseWeekday = (date: dayjs.Dayjs) => {
    const weekdays = [
      "Chủ Nhật",
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
    ];
    return weekdays[date.day()];
  };

  // Chuyển đổi object thành array để render
  const daySections = useMemo(() => {
    return Object.entries(eventsByDay)
      .sort(
        ([dateA], [dateB]) => dayjs(dateA).valueOf() - dayjs(dateB).valueOf()
      )
      .map(([date, dayEvents]) => ({
        date,
        dayEvents,
        displayDate: dayjs(date).format("DD/MM/YYYY"),
        weekday: getVietnameseWeekday(dayjs(date)),
      }));
  }, [eventsByDay]);

  // Thống kê sự kiện theo tháng
  const monthStats = useMemo(() => {
    const totalEvents = currentMonthEvents.length;
    const totalDays = Object.keys(eventsByDay).length;

    // Phân loại sự kiện theo type
    const eventsByType: Record<string, number> = {};
    currentMonthEvents.forEach((event) => {
      const type = event.eventType;
      eventsByType[type] = (eventsByType[type] || 0) + 1;
    });

    return { totalEvents, totalDays, eventsByType };
  }, [currentMonthEvents, eventsByDay]);

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, "month"));
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(dayjs());
  };

  const handleMonthChange = (value: dayjs.Dayjs | null) => {
    if (value) {
      setCurrentMonth(value);
    }
  };

  const getEventTypeText = (type: ROKEvent["eventType"]) => {
    const texts: Record<ROKEvent["eventType"], string> = {
      kingdom: "Toàn Vương Quốc",
      alliance: "Liên Minh",
      personal: "Cá Nhân",
      special: "Đặc Biệt",
      kvk: "KVK",
      ceremony: "Lễ Hội",
      training: "Đào Tạo",
      competitive: "Cạnh Tranh",
      gathering: "Thu Thập",
      expedition: "Thám Hiểm",
      wheel: "Vòng Quay",
      card: "Thẻ Bài",
      power: "Sức Mạnh",
      building: "Xây Dựng",
      research: "Nghiên Cứu",
      commander: "Tướng",
      troop: "Quân Đội",
      barbarian: "Barbarian",
      fort: "Pháo Đài",
      resource: "Tài Nguyên",
      vip: "VIP",
      recharge: "Nạp",
      alliance_war: "Chiến Liên Minh",
    };
    return texts[type];
  };

  const getPriorityText = (priority: ROKEvent["priority"]) => {
    const texts: Record<ROKEvent["priority"], string> = {
      low: "Thấp",
      medium: "Trung bình",
      high: "Cao",
      critical: "Tối cao",
    };
    return texts[priority];
  };

  const getEventTypeColor = (type: ROKEvent["eventType"]) => {
    const colors: Record<ROKEvent["eventType"], string> = {
      kingdom: "blue",
      alliance: "green",
      personal: "orange",
      special: "purple",
      kvk: "red",
      ceremony: "gold",
      training: "cyan",
      competitive: "magenta",
      gathering: "lime",
      expedition: "volcano",
      wheel: "geekblue",
      card: "purple",
      power: "red",
      building: "orange",
      research: "blue",
      commander: "cyan",
      troop: "green",
      barbarian: "volcano",
      fort: "magenta",
      resource: "lime",
      vip: "gold",
      recharge: "geekblue",
      alliance_war: "red",
    };
    return colors[type];
  };

  const getPriorityColor = (priority: ROKEvent["priority"]) => {
    const colors: Record<ROKEvent["priority"], string> = {
      low: "green",
      medium: "orange",
      high: "red",
      critical: "magenta",
    };
    return colors[priority];
  };

  // Hàm kiểm tra nếu ngày là hôm nay
  const isToday = (date: string) => {
    return dayjs(date).isSame(dayjs(), "day");
  };

  // Hàm kiểm tra nếu ngày là trong quá khứ
  const isPast = (date: string) => {
    return dayjs(date).isBefore(dayjs(), "day");
  };

  // Hàm kiểm tra nếu ngày là trong tương lai
  const isFuture = (date: string) => {
    return dayjs(date).isAfter(dayjs(), "day");
  };

  const isCurrentMonth = currentMonth.isSame(dayjs(), "month");

  return (
    <ConfigProvider locale={vi_VN}>
      <Card
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <span>Danh Sách Sự Kiện</span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <Button
                icon={<LeftOutlined />}
                onClick={goToPreviousMonth}
                size="small"
              >
                Tháng trước
              </Button>

              <DatePicker
                value={currentMonth}
                onChange={handleMonthChange}
                picker="month"
                format="MM/YYYY"
                size="small"
                style={{ width: "120px" }}
                placeholder="Chọn tháng"
                allowClear={false}
              />

              <Button
                icon={<RightOutlined />}
                onClick={goToNextMonth}
                size="small"
              >
                Tháng sau
              </Button>

              {!isCurrentMonth && (
                <Button
                  onClick={goToCurrentMonth}
                  size="small"
                  type="primary"
                  ghost
                >
                  Tháng này
                </Button>
              )}
            </div>
          </div>
        }
        style={{ marginTop: "20px" }}
        extra={
          <div
            style={{
              textAlign: "right",
              fontSize: "12px",
              color: "#666",
              marginLeft: 12,
            }}
          >
            <div>{monthStats.totalEvents} sự kiện</div>
            <div>{monthStats.totalDays} ngày có sự kiện</div>
          </div>
        }
      >
        {/* Thống kê tháng */}
        <div
          style={{
            background: "#f8f9fa",
            padding: "12px 16px",
            borderRadius: "6px",
            marginBottom: "16px",
            border: "1px solid #e8e8e8",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <div>
              <h3 style={{ margin: 0, color: "#1890ff" }}>
                Tháng {currentMonth.format("MM/YYYY")}
              </h3>
              <div
                style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}
              >
                {currentMonth.startOf("month").format("DD/MM")} -{" "}
                {currentMonth.endOf("month").format("DD/MM")}
              </div>
            </div>
            <Space wrap size={[8, 8]}>
              {Object.entries(monthStats.eventsByType).map(([type, count]) => (
                <Tag
                  key={type}
                  color={getEventTypeColor(type as ROKEvent["eventType"])}
                >
                  {getEventTypeText(type as ROKEvent["eventType"])}: {count}
                </Tag>
              ))}
            </Space>
          </div>
        </div>

        {/* Danh sách sự kiện */}
        {daySections.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#999",
              fontSize: "16px",
            }}
          >
            📅 Không có sự kiện nào trong tháng {currentMonth.format("MM/YYYY")}
          </div>
        ) : (
          <List
            dataSource={daySections}
            renderItem={({ date, displayDate, weekday, dayEvents }) => (
              <div key={date} style={{ marginBottom: "24px" }}>
                {/* Header cho mỗi ngày */}
                <div
                  style={{
                    padding: "12px 16px",
                    background: isToday(date)
                      ? "#e6f7ff"
                      : isPast(date)
                      ? "#f5f5f5"
                      : "#f9f9f9",
                    border: `1px solid ${
                      isToday(date)
                        ? "#91d5ff"
                        : isPast(date)
                        ? "#d9d9d9"
                        : "#e8e8e8"
                    }`,
                    borderRadius: "6px",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          color: isToday(date) ? "#1890ff" : "#333",
                        }}
                      >
                        {weekday}, {displayDate}
                      </span>
                      {isToday(date) && (
                        <Tag color="blue" style={{ marginLeft: "8px" }}>
                          Hôm nay
                        </Tag>
                      )}
                      {isPast(date) && (
                        <Tag color="default" style={{ marginLeft: "8px" }}>
                          Đã qua
                        </Tag>
                      )}
                      {isFuture(date) && (
                        <Tag color="green" style={{ marginLeft: "8px" }}>
                          Sắp tới
                        </Tag>
                      )}
                    </div>
                    <Tag color="blue">{dayEvents.length} sự kiện</Tag>
                  </div>
                </div>

                {/* Danh sách sự kiện trong ngày */}
                {dayEvents.map((event) => (
                  <List.Item
                    key={event.id}
                    style={{
                      padding: "16px",
                      border: "1px solid #f0f0f0",
                      borderRadius: "6px",
                      marginBottom: "8px",
                      background: "#fff",
                    }}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <span
                            style={{
                              fontWeight: "bold",
                              color: isPast(date) ? "#999" : "#333",
                            }}
                          >
                            {event.title}
                          </span>
                          <Tag color={getEventTypeColor(event.eventType)}>
                            {getEventTypeText(event.eventType)}
                          </Tag>
                          <Tag color={getPriorityColor(event.priority)}>
                            Ưu tiên: {getPriorityText(event.priority)}
                          </Tag>
                        </Space>
                      }
                      description={
                        <div>
                          <div
                            style={{
                              color: isPast(date) ? "#999" : "#666",
                              marginBottom: "8px",
                            }}
                          >
                            {event.description}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: isPast(date) ? "#ccc" : "#666",
                            }}
                          >
                            <div style={{ marginBottom: "4px" }}>
                              🕐 <strong>Thời gian:</strong>{" "}
                              {dayjs(event.startTime).format("HH:mm")} -{" "}
                              {dayjs(event.endTime).format("HH:mm")}
                            </div>
                            <div style={{ marginBottom: "4px" }}>
                              🎁 <strong>Phần thưởng:</strong>{" "}
                              {event.rewards.join(", ")}
                            </div>
                            {event.requirements && (
                              <div style={{ marginBottom: "4px" }}>
                                ⚙️ <strong>Yêu cầu:</strong>{" "}
                                {event.requirements}
                              </div>
                            )}
                            {event.minPower && (
                              <div style={{ marginBottom: "4px" }}>
                                💪 <strong>Sức mạnh tối thiểu:</strong>{" "}
                                {event.minPower.toLocaleString()}
                              </div>
                            )}
                            {event.kingdomLevel && (
                              <div style={{ marginBottom: "4px" }}>
                                🏰 <strong>Vương quốc:</strong>{" "}
                                {event.kingdomLevel}+ ngày
                              </div>
                            )}
                            {event.eventStage && (
                              <div>
                                🎯 <strong>Giai đoạn:</strong>{" "}
                                {event.eventStage}
                              </div>
                            )}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                ))}
              </div>
            )}
          />
        )}
      </Card>
    </ConfigProvider>
  );
};

export default EventList;
