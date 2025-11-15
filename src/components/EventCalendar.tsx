import React, { useState, useEffect } from "react";
import {
  Calendar,
  Card,
  Tag,
  Spin,
  Alert,
  Typography,
  Row,
  Col,
  ConfigProvider,
} from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/vi"; // Import Vietnamese locale for dayjs
import viVN from "antd/locale/vi_VN"; // Import Vietnamese locale for Ant Design

// Set Vietnamese as default locale for dayjs
dayjs.locale("vi");

const { Title, Text } = Typography;

interface EventPattern {
  startDate: string;
  frequency: string;
  duration: number;
}

interface Event {
  pattern: EventPattern[];
  title: string;
  description: string;
  color: string;
}

interface CalendarEvent {
  date: string;
  event: Event;
  isStart: boolean;
  isDuring: boolean;
}

// Vietnamese month names for custom formatting if needed
const vietnameseMonths = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

// Vietnamese day names
const vietnameseDays = [
  "Chủ Nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
];

const EventCalendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchEvents();
  }, []); // eslint-disable-line

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      // Use Netlify function endpoint
      const response = await fetch("/.netlify/functions/fetch-events");

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }

      const data = await response.json();

      // Handle error response from function
      if (data.error) {
        throw new Error(data.message || data.error);
      }

      setEvents(data);
      processEvents(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch events";
      setError(errorMessage);
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const processEvents = (eventsData: Event[]) => {
    const allCalendarEvents: CalendarEvent[] = [];
    const today = dayjs();
    const endDate = today.add(6, "year"); // Show events for next 6 years

    eventsData.forEach((event) => {
      event.pattern.forEach((pattern) => {
        const startDate = dayjs(pattern.startDate);
        let currentDate = startDate;

        while (currentDate.isBefore(endDate)) {
          // Add start date
          allCalendarEvents.push({
            date: currentDate.format("YYYY-MM-DD"),
            event: event,
            isStart: true,
            isDuring: false,
          });

          // Add days during the event
          for (let i = 1; i < pattern.duration; i++) {
            const duringDate = currentDate.add(i, "day");
            if (duringDate.isBefore(endDate)) {
              allCalendarEvents.push({
                date: duringDate.format("YYYY-MM-DD"),
                event: event,
                isStart: false,
                isDuring: true,
              });
            }
          }

          // Calculate next occurrence based on frequency
          switch (pattern.frequency) {
            case "one-week":
              currentDate = currentDate.add(1, "week");
              break;
            case "two-weeks":
              currentDate = currentDate.add(2, "weeks");
              break;
            case "four-weeks":
              currentDate = currentDate.add(4, "weeks");
              break;
            case "five-weeks":
              currentDate = currentDate.add(5, "weeks");
              break;
            case "eight-weeks":
              currentDate = currentDate.add(8, "weeks");
              break;
            default:
              currentDate = currentDate.add(4, "weeks"); // default to 4 weeks
          }
        }
      });
    });

    setCalendarEvents(allCalendarEvents);
  };

  const getDateEvents = (date: Dayjs) => {
    const dateStr = date.format("YYYY-MM-DD");
    return calendarEvents.filter((event) => event.date === dateStr);
  };

  const dateCellRender = (value: Dayjs) => {
    const dateEvents = getDateEvents(value);

    return (
      <div className="events">
        {dateEvents.map((event, index) => (
          <div key={index} className="event-item">
            <Tag
              color={event.event.color}
              style={{
                margin: "1px",
                fontSize: "10px",
                border: event.isStart ? "2px solid #000" : "none",
                opacity: event.isDuring ? 0.7 : 1,
              }}
            >
              {event.isStart ? "🎯" : "📅"} {event.event.title}
            </Tag>
          </div>
        ))}
      </div>
    );
  };

  const getMonthData = (value: Dayjs) => {
    const monthEvents = calendarEvents.filter(
      (event) =>
        dayjs(event.date).month() === value.month() &&
        dayjs(event.date).year() === value.year()
    );

    const uniqueEvents = monthEvents.reduce((acc, curr) => {
      if (
        !acc.find(
          (event: CalendarEvent) => event.event.title === curr.event.title
        )
      ) {
        acc.push(curr);
      }
      return acc;
    }, [] as CalendarEvent[]);

    return uniqueEvents;
  };

  const monthCellRender = (value: Dayjs) => {
    const monthEvents = getMonthData(value);

    return (
      <div className="month-events">
        {monthEvents.slice(0, 3).map((event, index) => (
          <Tag
            key={index}
            color={event.event.color}
            style={{ margin: "1px", fontSize: "10px" }}
          >
            {event.event.title}
          </Tag>
        ))}
        {monthEvents.length > 3 && (
          <Tag style={{ fontSize: "10px" }}>
            +{monthEvents.length - 3} sự kiện khác
          </Tag>
        )}
      </div>
    );
  };

  // Format compact date for upcoming events
  const formatCompactVietnameseDate = (date: Dayjs) => {
    const weekday = vietnameseDays[date.day()].substring(4); // Remove "Thứ " prefix for compact view
    const day = date.date();
    const month = date.month() + 1;
    const year = date.year();
    return `${weekday}, ${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <Text>Đang tải sự kiện...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi"
        description={error}
        type="error"
        showIcon
        action={
          <button
            onClick={fetchEvents}
            style={{
              border: "none",
              background: "none",
              color: "#1890ff",
              cursor: "pointer",
            }}
          >
            Thử lại
          </button>
        }
      />
    );
  }

  return (
    <ConfigProvider locale={viVN}>
      <div className="event-calendar">
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={24}>
            <Card>
              <Title level={3}>
                <CalendarOutlined /> Lịch Sự Kiện
              </Title>
              <Calendar
                dateCellRender={dateCellRender}
                monthCellRender={monthCellRender}
                headerRender={({ value, onChange }) => {
                  const current = value;
                  const monthOptions = [];
                  for (let i = 0; i < 12; i++) {
                    monthOptions.push(
                      <option key={i} value={i}>
                        {vietnameseMonths[i]}
                      </option>
                    );
                  }

                  const year = current.year();
                  const month = current.month();
                  const options = [];
                  for (let i = year - 10; i < year + 10; i += 1) {
                    options.push(
                      <option key={i} value={i}>
                        {i}
                      </option>
                    );
                  }

                  return (
                    <div
                      style={{
                        padding: 8,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 16,
                      }}
                    >
                      <select
                        value={month}
                        onChange={(e) => {
                          const newValue = current.month(
                            parseInt(e.target.value, 10)
                          );
                          onChange(newValue);
                        }}
                        style={{
                          padding: "4px 8px",
                          borderRadius: 4,
                          border: "1px solid #d9d9d9",
                        }}
                      >
                        {monthOptions}
                      </select>
                      <select
                        value={year}
                        onChange={(e) => {
                          const newValue = current.year(
                            parseInt(e.target.value, 10)
                          );
                          onChange(newValue);
                        }}
                        style={{
                          padding: "4px 8px",
                          borderRadius: 4,
                          border: "1px solid #d9d9d9",
                        }}
                      >
                        {options}
                      </select>
                    </div>
                  );
                }}
              />
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Sự Kiện Sắp Diễn Ra" className="upcoming-events">
              {calendarEvents
                .filter(
                  (event) =>
                    dayjs(event.date).isAfter(dayjs().subtract(1, "day")) &&
                    event.isStart
                )
                .sort(
                  (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf()
                )
                .slice(0, 10)
                .map((event, index) => (
                  <div key={index} className="upcoming-event-item">
                    <div className="event-date">
                      <Text
                        strong
                        style={{ fontSize: "12px", lineHeight: "1.2" }}
                      >
                        {formatCompactVietnameseDate(dayjs(event.date))}
                      </Text>
                    </div>
                    <div className="event-info">
                      <Text
                        strong
                        style={{ color: event.event.color, fontSize: "14px" }}
                      >
                        {event.event.title}
                      </Text>
                      <br />
                      <Text
                        type="secondary"
                        style={{ fontSize: "12px", lineHeight: "1.2" }}
                      >
                        {event.event.description}
                      </Text>
                    </div>
                  </div>
                ))}
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Tất Cả Sự Kiện">
              {events.map((event, index) => (
                <div key={index} className="event-summary">
                  <Tag color={event.color} style={{ marginBottom: 8 }}>
                    {event.title}
                  </Tag>
                  <Text
                    type="secondary"
                    style={{ display: "block", fontSize: "12px" }}
                  >
                    {event.description}
                  </Text>
                </div>
              ))}
            </Card>
          </Col>
        </Row>
      </div>
    </ConfigProvider>
  );
};

export default EventCalendar;
