import React, { useState, useEffect, JSX } from "react";
import {
  Calendar,
  Card,
  Tag,
  Spin,
  Alert,
  Typography,
  Row,
  Col,
  Button,
  Select,
  Radio,
} from "antd";
import {
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/vi"; // Import locale tiếng Việt
import locale from "antd/es/calendar/locale/vi_VN"; // Import locale tiếng Việt cho Calendar
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

// Thiết lập locale tiếng Việt cho dayjs
dayjs.locale("vi");
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Title, Text } = Typography;
const { Option } = Select;

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

type CalendarView = "month" | "week";

const EventCalendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [calendarView, setCalendarView] = useState<CalendarView>("month");

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
    const endDate = today.add(42, "year"); // Show events for next 42 years

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

  const getWeekEvents = (
    startDate: Dayjs
  ): { [key: string]: CalendarEvent[] } => {
    const weekEvents: { [key: string]: CalendarEvent[] } = {};

    // Get all days of the week
    for (let i = 0; i < 7; i++) {
      const currentDay = startDate.add(i, "day");
      const dateStr = currentDay.format("YYYY-MM-DD");
      weekEvents[dateStr] = getDateEvents(currentDay);
    }

    return weekEvents;
  };

  const goToToday = () => {
    const today = dayjs();
    setCurrentDate(today);
  };

  const goToPrevious = () => {
    if (calendarView === "month") {
      setCurrentDate(currentDate.subtract(1, "month"));
    } else {
      setCurrentDate(currentDate.subtract(1, "week"));
    }
  };

  const goToNext = () => {
    if (calendarView === "month") {
      setCurrentDate(currentDate.add(1, "month"));
    } else {
      setCurrentDate(currentDate.add(1, "week"));
    }
  };

  // Custom header renderer để thêm nút "Hôm nay", "Tháng trước", "Tháng sau"
  const customHeaderRender = ({
    value,
    onChange,
  }: {
    value: Dayjs;
    onChange: (date: Dayjs) => void;
  }) => {
    const currentYear = value.year();
    const currentMonth = value.month();

    const monthOptions: JSX.Element[] = [];
    for (let i = 0; i < 12; i++) {
      monthOptions.push(
        <Option key={i} value={i}>
          {`Tháng ${i + 1}`}
        </Option>
      );
    }

    const yearOptions: JSX.Element[] = [];
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      yearOptions.push(
        <Option key={i} value={i}>
          {i}
        </Option>
      );
    }

    return (
      <div
        style={{
          padding: "16px 8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Button
            size="small"
            onClick={goToToday}
            type="primary"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              fontWeight: "600",
            }}
          >
            Hôm nay
          </Button>
          <div style={{ display: "flex", gap: "4px" }}>
            <Button
              size="small"
              icon={<LeftOutlined />}
              onClick={goToPrevious}
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border-light)",
                color: "var(--text-dark)",
              }}
            />
            <Button
              size="small"
              icon={<RightOutlined />}
              onClick={goToNext}
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border-light)",
                color: "var(--text-dark)",
              }}
            />
          </div>
        </div>

        <Radio.Group
          value={calendarView}
          onChange={(e) => setCalendarView(e.target.value)}
          size="small"
          style={{ marginLeft: "auto", marginRight: "16px" }}
        >
          <Radio.Button value="month">Tháng</Radio.Button>
          <Radio.Button value="week">Tuần</Radio.Button>
        </Radio.Group>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Select
            value={currentMonth}
            onChange={(newMonth) => {
              const newValue = value.month(newMonth);
              onChange(newValue);
              setCurrentDate(newValue);
            }}
            style={{ width: 120 }}
            size="small"
            dropdownStyle={{
              background: "var(--card-bg)",
              border: "1px solid var(--border-light)",
            }}
          >
            {monthOptions}
          </Select>
          <Select
            value={currentYear}
            onChange={(newYear) => {
              const newValue = value.year(newYear);
              onChange(newValue);
              setCurrentDate(newValue);
            }}
            style={{ width: 100 }}
            size="small"
            dropdownStyle={{
              background: "var(--card-bg)",
              border: "1px solid var(--border-light)",
            }}
          >
            {yearOptions}
          </Select>
        </div>
      </div>
    );
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

  // Render weekly view
  const renderWeekView = () => {
    const startOfWeek = currentDate.startOf("week");
    const weekEvents = getWeekEvents(startOfWeek);
    const daysOfWeek: Dayjs[] = [];

    for (let i = 0; i < 7; i++) {
      const day = startOfWeek.add(i, "day");
      daysOfWeek.push(day);
    }

    return (
      <div className="week-view">
        <div
          className="week-header"
          style={{
            display: "grid",
            gridTemplateColumns: "100px repeat(7, 1fr)",
            gap: "8px",
            marginBottom: "16px",
            padding: "12px",
            background: "var(--card-bg)",
            borderRadius: "12px",
            border: "1px solid var(--border-light)",
          }}
        >
          <div style={{ fontWeight: "600", color: "var(--text-darker)" }}>
            Giờ
          </div>
          {daysOfWeek.map((day, index) => (
            <div key={index} style={{ textAlign: "center", fontWeight: "600" }}>
              <div style={{ color: "var(--text-darker)", fontSize: "14px" }}>
                {day.format("ddd")}
              </div>
              <div
                style={{
                  color: day.isSame(dayjs(), "day")
                    ? "var(--accent-primary)"
                    : "var(--text-dark)",
                  fontSize: "18px",
                  fontWeight: day.isSame(dayjs(), "day") ? "700" : "400",
                }}
              >
                {day.format("DD")}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                {day.format("MM/YYYY")}
              </div>
            </div>
          ))}
        </div>

        <div
          className="week-body"
          style={{
            display: "grid",
            gridTemplateColumns: "100px repeat(7, 1fr)",
            gap: "8px",
          }}
        >
          {/* Time slots */}
          {Array.from({ length: 14 }, (_, i) => i + 7).map((hour) => (
            <React.Fragment key={hour}>
              <div
                style={{
                  padding: "8px",
                  textAlign: "right",
                  color: "var(--text-muted)",
                  fontSize: "12px",
                  borderRight: "1px solid var(--border-light)",
                }}
              >
                {hour}:00
              </div>

              {daysOfWeek.map((day, dayIndex) => {
                const dateStr = day.format("YYYY-MM-DD");
                const dayEvents = weekEvents[dateStr] || [];
                const hourEvents = dayEvents.filter((event) => {
                  const eventHour = dayjs(event.date).hour();
                  return eventHour === hour;
                });

                return (
                  <div
                    key={dayIndex}
                    style={{
                      minHeight: "60px",
                      padding: "4px",
                      border: "1px solid var(--border-light)",
                      borderRadius: "6px",
                      background: "rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    {hourEvents.map((event, eventIndex) => (
                      <Tag
                        key={eventIndex}
                        color={event.event.color}
                        style={{
                          margin: "1px",
                          fontSize: "10px",
                          border: event.isStart ? "2px solid #000" : "none",
                          opacity: event.isDuring ? 0.7 : 1,
                          display: "block",
                          width: "100%",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {event.isStart ? "🎯" : "📅"} {event.event.title}
                      </Tag>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
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
    <div className="event-calendar">
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={24}>
          <Card>
            <Title level={3}>
              <CalendarOutlined /> Lịch Sự Kiện
            </Title>
            {calendarView === "month" ? (
              <Calendar
                value={currentDate}
                onChange={setCurrentDate}
                dateCellRender={dateCellRender}
                monthCellRender={monthCellRender}
                locale={locale}
                headerRender={customHeaderRender}
              />
            ) : (
              <>
                {customHeaderRender({
                  value: currentDate,
                  onChange: setCurrentDate,
                })}
                {renderWeekView()}
              </>
            )}
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
              .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
              .slice(0, 10)
              .map((event, index) => (
                <div key={index} className="upcoming-event-item">
                  <div className="event-date">
                    <Text strong>
                      {dayjs(event.date).format("dddd, DD/MM/YYYY")}
                    </Text>
                  </div>
                  <div className="event-info">
                    <Text strong style={{ color: event.event.color }}>
                      {event.event.title}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: "12px" }}>
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
  );
};

export default EventCalendar;
