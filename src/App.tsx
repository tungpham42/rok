import React from "react";
import { Layout } from "antd";
import EventCalendar from "./components/EventCalendar";
import "./App.css";

const { Header, Content } = Layout;

const App: React.FC = () => {
  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <h1>Danh sách sự kiện game ROK</h1>
      </Header>
      <Content className="app-content">
        <EventCalendar />
      </Content>
    </Layout>
  );
};

export default App;
