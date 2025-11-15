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
  Button,
  Select,
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

// Thiết lập locale tiếng Việt cho dayjs
dayjs.locale("vi");

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

const EventCalendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());

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

  const goToToday = () => {
    const today = dayjs();
    setCurrentDate(today);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(currentDate.subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setCurrentDate(currentDate.add(1, "month"));
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

    const monthOptions = [];
    for (let i = 0; i < 12; i++) {
      monthOptions.push(
        <Option key={i} value={i}>
          {`Tháng ${i + 1}`}
        </Option>
      );
    }

    const yearOptions = [];
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
              onClick={goToPreviousMonth}
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border-glow)",
                color: "var(--text-light)",
              }}
            />
            <Button
              size="small"
              icon={<RightOutlined />}
              onClick={goToNextMonth}
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border-glow)",
                color: "var(--text-light)",
              }}
            />
          </div>
        </div>

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
              border: "1px solid var(--border-glow)",
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
              border: "1px solid var(--border-glow)",
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
            <Calendar
              value={currentDate}
              onChange={setCurrentDate}
              dateCellRender={dateCellRender}
              monthCellRender={monthCellRender}
              locale={locale}
              headerRender={customHeaderRender}
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
