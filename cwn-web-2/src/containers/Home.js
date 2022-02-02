import React, { useEffect, useRef, useState } from "react";
import { Layout, Menu, Input } from "antd";
import { TagOutlined } from "@ant-design/icons";

import "./Home.css";
import useData from "../hooks/useData";
import useForceDirectedGraph from "../hooks/useForceDirectedGraph";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { Search } = Input;

function Home() {
  const [data, setData] = useState([]);
  const [updateGraph] = useForceDirectedGraph();
  const query = useData();
  const onSearch = (value) => {
    const result = query(value);
    console.log(result);
    if (result) {
      setData(result);
    } else {
      alert("不存在");
    }
  };

  useEffect(() => {
    console.log("data:", data);
    updateGraph(data);
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
          size="large"
          placeholder="請輸入查詢字詞"
          allowClear
          onSearch={onSearch}
          style={{
            width: 300,
          }}
        />
      </Layout>
      <Layout style={{ height: "100%" }}>
        <Sider className="site-layout-background sider" width={"33%"}>
          <Menu
            mode="inline"
            // defaultSelectedKeys={["1"]}
            // defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0, overflow: "auto" }}
          >
            {data?.[0]?.children?.map((lemmaNode, i) => (
              <SubMenu
                key={`lemma${i}`}
                icon={<TagOutlined />}
                title={`${lemmaNode.lemma}（${lemmaNode.zhuyin}）`}
              >
                {lemmaNode.children?.map((senseNode, j) => (
                  <Menu.ItemGroup key={`sense${i}-${j}`} title={senseNode.def}>
                    {senseNode.examples ? (
                      senseNode.examples.map((example, k) => (
                        <Menu.Item
                          className="wrapText"
                          key={`example${i}-${j}-${k}`}
                        >
                          {`${k + 1}. ` + example}
                        </Menu.Item>
                      ))
                    ) : (
                      <></>
                    )}
                  </Menu.ItemGroup>
                ))}
              </SubMenu>
            ))}
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
