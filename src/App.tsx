import React, { useMemo } from "react";
import { Layout, Card, Typography } from "antd";
import { ROKEvent } from "./types";
import { generateInfiniteEvents } from "./data/events";
import EventCalendar from "./components/EventCalendar";
import EventList from "./components/EventList";
import dayjs from "dayjs";
import "./App.css";

const { Header, Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const eventsMonths = 96;
  const eventsYears = eventsMonths / 12;
  // Sử dụng useMemo để tránh tạo lại events mỗi lần render
  const events = useMemo(() => generateInfiniteEvents(eventsMonths), []);

  const handleEventClick = (event: ROKEvent) => {
    console.log("Event clicked:", event.title);
    // Có thể hiển thị modal chi tiết sự kiện ở đây
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#001529",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Title level={3} style={{ color: "white", margin: 0 }}>
          🏰 Theo Dõi Sự Kiện Rise of Kingdoms
        </Title>
      </Header>

      <Content style={{ padding: "20px", background: "#f0f2f5" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Card>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <Title level={2}>Lịch Sự Kiện Rise of Kingdoms</Title>
              <p style={{ fontSize: "16px", color: "#666" }}>
                Theo dõi tất cả các sự kiện trong game - Cập nhật tự động đến
                năm {dayjs().add(eventsYears, "year").year()}
              </p>
              <p style={{ fontSize: "14px", color: "#999" }}>
                Hiển thị {events.length} sự kiện trong {eventsYears} năm tới
              </p>
            </div>

            <EventCalendar events={events} onEventClick={handleEventClick} />
          </Card>

          <EventList events={events} />
        </div>
      </Content>
    </Layout>
  );
};

export default App;
