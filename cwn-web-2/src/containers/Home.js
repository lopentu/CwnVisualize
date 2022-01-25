import React, { useEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import { Layout, Menu, Input } from "antd";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";

import "./Home.css";
import useData from "../hooks/useData";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { Search } = Input;

function Home() {
  const graphRef = useRef(null);
  const [data, setData] = useState([]);
  const query = useData();
  const onSearch = (value) => {
    const [nodeName, node, connectedNodesNames, connectedNodes] = query(value);
    console.log(query(value));

    setData([
      {
        name: node.glyph,
        children: connectedNodes.map((n) => {
          return { name: n.zhuyin };
        }),
      },
    ]);
  };

  useEffect(() => {
    if (!graphRef.current) {
      graphRef.current = am5.Root.new("graph");
      graphRef.current.setThemes([am5themes_Animated.new(graphRef.current)]);

      const container = graphRef.current.container.children.push(
        am5.Container.new(graphRef.current, {
          width: am5.percent(100),
          height: am5.percent(100),
          layout: graphRef.current.verticalLayout,
        })
      );

      const series = container.children.push(
        am5hierarchy.ForceDirected.new(graphRef.current, {
          downDepth: 1,
          initialDepth: 2,
          topDepth: 0,
          valueField: "value",
          categoryField: "name",
          childDataField: "children",
          xField: "x",
          yField: "y",
        })
      );
      console.log(container.children);

      series.data.setAll([
        {
          name: "Root",
          value: 0,
          children: [
            {
              name: "A0",
              x: am5.percent(50),
              y: am5.percent(50),
            },
          ],
        },
      ]);
      console.log(series.data);

      series.set("selectedDataItem", series.dataItems[0]);

      const legend = container.children.push(
        am5.Legend.new(graphRef.current, {
          centerX: am5.percent(50),
          x: am5.percent(50),
          layout: graphRef.current.horizontalLayout,
        })
      );
      console.log(legend);

      legend.data.setAll(series.dataItems[0].get("children"));
    }

    return () => {
      if (graphRef.current) {
        graphRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    console.log(data);

    if (graphRef.current) {
      const series = graphRef.current.container.children.push(
        am5hierarchy.ForceDirected.new(graphRef.current, {
          downDepth: 1,
          initialDepth: 2,
          topDepth: 0,
          valueField: "value",
          categoryField: "name",
          childDataField: "children",
          xField: "x",
          yField: "y",
        })
      );
      series.data.setAll(data);
    }
  }, [data]);

  return (
    <Layout>
      <Header className="header">
        <img className="logo" src="cwn-logo-main.svg" alt="中文詞彙網路 CWN" />
        {/* <div className="logo" /> */}
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}></Menu>
      </Header>
      <Layout className="searchSession">
        <Search
          className="search"
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
          <Content className="site-layout-background">
            <div id="graph"></div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Home;
