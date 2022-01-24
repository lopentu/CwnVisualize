import React from "react";
import * as am5 from "@amcharts/amcharts5";
import "./Home.css";

import { Layout, Menu, Input, Space } from "antd";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
  AudioOutlined,
} from "@ant-design/icons";
import Edges from "../data/cwn_base_edges.json";
import Nodes from "../data/cwn_base_nodes.json";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { Search } = Input;

function Home() {
  const onSearch = (value) => console.log(value);

  return (
    <Layout>
      <Header className="header">
        <img className="logo" src="cwn-logo-main.svg" alt="中文詞彙網路 CWN" />
        {/* <div className="logo" /> */}
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}></Menu>
      </Header>
      <Layout className="searchSession">
        <Search className="search"
          placeholder="請輸入查詢字詞"
          allowClear
          onSearch={onSearch}
          style={{
            width: 300,
          }}
        />
      </Layout>
      <Layout style={{ height: "100%" }}>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
          >
            <SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
              <Menu.Item key="1">option1</Menu.Item>
              <Menu.Item key="2">option2</Menu.Item>
              <Menu.Item key="3">option3</Menu.Item>
              <Menu.Item key="4">option4</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<LaptopOutlined />} title="subnav 2">
              <Menu.Item key="5">option5</Menu.Item>
              <Menu.Item key="6">option6</Menu.Item>
              <Menu.Item key="7">option7</Menu.Item>
              <Menu.Item key="8">option8</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub3"
              icon={<NotificationOutlined />}
              title="subnav 3"
            >
              <Menu.Item key="9">option9</Menu.Item>
              <Menu.Item key="10">option10</Menu.Item>
              <Menu.Item key="11">option11</Menu.Item>
              <Menu.Item key="12">option12</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              height: "100%",
            }}
          >
            Content
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Home;
