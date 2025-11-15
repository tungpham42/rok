import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Badge, Button, Modal, Tag, Space, Divider } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { ROKEvent } from "../types";

interface EventCalendarProps {
  events: ROKEvent[];
  onEventClick: (event: ROKEvent) => void;
}

const EventCalendar: React.FC<EventCalendarProps> = ({
  events,
  onEventClick,
}) => {
  const [currentWeek, setCurrentWeek] = useState(dayjs());
  const [selectedEvent, setSelectedEvent] = useState<ROKEvent | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const startOfWeek = currentWeek.startOf("week"); // Thứ 2
  const days = Array.from({ length: 7 }).map((_, i) =>
    startOfWeek.add(i, "day")
  );

  // Hàm chuyển đổi thứ viết tắt sang tiếng Việt
  const getVietnameseWeekdayShort = (day: Dayjs) => {
    const weekdaysShort = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return weekdaysShort[day.day()];
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

  const getPriorityColor = (priority: ROKEvent["priority"]) => {
    const colors: Record<ROKEvent["priority"], string> = {
      low: "green",
      medium: "orange",
      high: "red",
      critical: "magenta",
    };
    return colors[priority];
  };

  const getEventsForDate = (date: Dayjs) => {
    return events.filter((event) => dayjs(event.startTime).isSame(date, "day"));
  };

  const handleEventClick = (event: ROKEvent) => {
    setSelectedEvent(event);
    setModalVisible(true);
    onEventClick(event); // Vẫn gọi callback gốc nếu cần
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  const goToPreviousWeek = () => {
    setCurrentWeek(currentWeek.subtract(1, "week"));
  };

  const goToNextWeek = () => {
    setCurrentWeek(currentWeek.add(1, "week"));
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(dayjs());
  };

  const weekRange = `${startOfWeek.format("DD/MM")} → ${startOfWeek
    .add(6, "day")
    .format("DD/MM")}`;
  const isCurrentWeek = currentWeek.isSame(dayjs(), "week");

  return (
    <>
      <div
        style={{
          background: "white",
          padding: "12px",
          borderRadius: "10px",
        }}
      >
        {/* Header với navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <Button
            icon={<LeftOutlined />}
            onClick={goToPreviousWeek}
            size="small"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Tuần trước
          </Button>

          <div
            style={{
              textAlign: "center",
              flex: 1,
              minWidth: "200px",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                fontSize: "16px",
                marginBottom: "2px",
              }}
            >
              Lịch Tuần – {weekRange}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#666",
              }}
            >
              {startOfWeek.format("DD/MM/YYYY")} -{" "}
              {startOfWeek.add(6, "day").format("DD/MM/YYYY")}
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            {!isCurrentWeek && (
              <Button
                onClick={goToCurrentWeek}
                size="small"
                type="primary"
                ghost
              >
                Tuần này
              </Button>
            )}
            <Button
              icon={<RightOutlined />}
              onClick={goToNextWeek}
              size="small"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Tuần sau
            </Button>
          </div>
        </div>

        {/* Calendar grid */}
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "8px",
            padding: "4px 0",
          }}
        >
          {days.map((day) => {
            const items = getEventsForDate(day);
            const isToday = day.isSame(dayjs(), "day");
            const isWeekend = day.day() === 0 || day.day() === 6; // Chủ nhật hoặc thứ 7

            return (
              <div
                key={day.toString()}
                style={{
                  minWidth: "130px",
                  background: isToday ? "#f0f8ff" : "#fafafa",
                  borderRadius: "8px",
                  padding: "8px",
                  border: `1px solid ${isToday ? "#1890ff" : "#eee"}`,
                  flex: 1,
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    marginBottom: "6px",
                    fontSize: "14px",
                    textAlign: "center",
                    color: isWeekend ? "#ff4d4f" : isToday ? "#1890ff" : "#333",
                  }}
                >
                  {getVietnameseWeekdayShort(day)}
                  <br />
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: isToday ? "bold" : "normal",
                    }}
                  >
                    {day.format("DD/MM")}
                  </span>
                  {isToday && (
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#1890ff",
                        fontWeight: "normal",
                        marginTop: "2px",
                      }}
                    >
                      Hôm nay
                    </div>
                  )}
                </div>

                <div style={{ maxHeight: "200px", overflow: "auto" }}>
                  {items.length === 0 && (
                    <div
                      style={{
                        textAlign: "center",
                        fontSize: "11px",
                        color: "#999",
                        fontStyle: "italic",
                        padding: "8px 0",
                      }}
                    >
                      Không có sự kiện
                    </div>
                  )}

                  {items.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      style={{
                        cursor: "pointer",
                        marginBottom: "6px",
                        padding: "6px",
                        borderRadius: "6px",
                        background: "#fff",
                        borderLeft: `3px solid ${getEventTypeColor(
                          event.eventType
                        )}`,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        fontSize: "11px",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f8f9fa";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#fff";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <Badge
                        color={getEventTypeColor(event.eventType)}
                        text={
                          <div>
                            <div
                              style={{
                                fontWeight: 500,
                                overflow: "hidden",
                                whiteSpace: "normal",
                                textOverflow: "ellipsis",
                                marginBottom: "2px",
                              }}
                            >
                              {event.title}
                            </div>
                            <div
                              style={{
                                fontSize: "9px",
                                color: "#666",
                                overflow: "hidden",
                                whiteSpace: "normal",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {dayjs(event.startTime).format("HH:mm")} -{" "}
                              {dayjs(event.endTime).format("HH:mm")}
                            </div>
                          </div>
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal hiển thị chi tiết sự kiện */}
      <Modal
        title="Chi Tiết Sự Kiện"
        open={modalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Đóng
          </Button>,
        ]}
        width={600}
      >
        {selectedEvent && (
          <div style={{ padding: "8px 0" }}>
            {/* Header với title và tags */}
            <div style={{ marginBottom: "16px" }}>
              <h2 style={{ margin: "0 0 12px 0", color: "#1890ff" }}>
                {selectedEvent.title}
              </h2>
              <Space wrap size={[8, 8]}>
                <Tag color={getEventTypeColor(selectedEvent.eventType)}>
                  {getEventTypeText(selectedEvent.eventType)}
                </Tag>
                <Tag color={getPriorityColor(selectedEvent.priority)}>
                  Ưu tiên: {getPriorityText(selectedEvent.priority)}
                </Tag>
                {selectedEvent.repeatable && <Tag color="green">Lặp lại</Tag>}
              </Space>
            </div>

            <Divider style={{ margin: "16px 0" }} />

            {/* Thông tin mô tả */}
            <div style={{ marginBottom: "16px" }}>
              <h4 style={{ marginBottom: "8px", color: "#333" }}>Mô tả</h4>
              <p style={{ margin: 0, lineHeight: "1.5" }}>
                {selectedEvent.description}
              </p>
            </div>

            {/* Thông tin thời gian */}
            <div style={{ marginBottom: "16px" }}>
              <h4 style={{ marginBottom: "8px", color: "#333" }}>Thời gian</h4>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <div>
                  <strong>Bắt đầu:</strong>{" "}
                  {dayjs(selectedEvent.startTime).format("DD/MM/YYYY HH:mm")}
                </div>
                <div>
                  <strong>Kết thúc:</strong>{" "}
                  {dayjs(selectedEvent.endTime).format("DD/MM/YYYY HH:mm")}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  ⏱️ Kéo dài:{" "}
                  {dayjs(selectedEvent.endTime).diff(
                    dayjs(selectedEvent.startTime),
                    "hour"
                  )}{" "}
                  giờ
                </div>
              </div>
            </div>

            {/* Phần thưởng */}
            <div style={{ marginBottom: "16px" }}>
              <h4 style={{ marginBottom: "8px", color: "#333" }}>
                Phần thưởng
              </h4>
              <Space wrap size={[8, 8]}>
                {selectedEvent.rewards.map((reward, index) => (
                  <Tag key={index} color="gold">
                    {reward}
                  </Tag>
                ))}
              </Space>
            </div>

            {/* Yêu cầu và thông tin bổ sung */}
            <div>
              {selectedEvent.requirements && (
                <div>
                  <h4 style={{ marginBottom: "8px", color: "#333" }}>
                    Yêu cầu
                  </h4>
                  <p style={{ margin: 0, fontSize: "14px" }}>
                    {selectedEvent.requirements}
                  </p>
                </div>
              )}

              {selectedEvent.minPower && (
                <div>
                  <h4 style={{ marginBottom: "8px", color: "#333" }}>
                    Sức mạnh tối thiểu
                  </h4>
                  <Tag color="red">
                    {selectedEvent.minPower.toLocaleString()}
                  </Tag>
                </div>
              )}

              {selectedEvent.kingdomLevel && (
                <div>
                  <h4 style={{ marginBottom: "8px", color: "#333" }}>
                    Vương quốc
                  </h4>
                  <Tag color="blue">{selectedEvent.kingdomLevel}+ ngày</Tag>
                </div>
              )}

              {selectedEvent.eventStage && (
                <div>
                  <h4 style={{ marginBottom: "8px", color: "#333" }}>
                    Giai đoạn
                  </h4>
                  <p style={{ margin: 0, fontSize: "14px" }}>
                    {selectedEvent.eventStage}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default EventCalendar;
