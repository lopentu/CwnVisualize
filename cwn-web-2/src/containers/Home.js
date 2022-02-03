import React, { Fragment, useEffect, useRef, useState } from "react";
import { Layout, Menu, Input, Spin } from "antd";
import { TagOutlined } from "@ant-design/icons";

import "./Home.css";
import useData from "../hooks/useData";
import useForceDirectedGraph from "../hooks/useForceDirectedGraph";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { Search } = Input;

function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [firstSearch, setFirstSearch] = useState(true);
  const [queryContent, setQueryContent] = useState("");
  const [updateGraph] = useForceDirectedGraph();
  const query = useData();

  const onQueryChange = (e) => {
    setQueryContent(e.target.value);
  };

  const onSearch = (value) => {
    if (!queryContent) {
      return;
    }
    setLoading(true);
    // The block in setTimeout will execute in another thread.
    // Thus, it won't block rendering.
    setTimeout(() => {
      const result = query(value);
      setLoading(false);
      setTimeout(() => {
        if (result) {
          if (firstSearch) {
            setFirstSearch(false);
          }
          setData(result);
        } else {
          alert("不存在");
        }
      }, 100);
    }, 200);
  };

  useEffect(() => {
    console.log("data:", data);
    updateGraph(data);
  }, [data]);

  const beginningLayout = () => {
    return (
      <Layout
        className="beginningLayout"
        style={{ display: firstSearch ? undefined : "none" }}
      >
        <img
          className="logo-home"
          src="/CwnWeb2/cwn-logo-main-home.svg"
          alt="中文詞彙網路 CWN"
        />
        <Search
          className="search"
          size="large"
          placeholder="請輸入查詢字詞"
          value={queryContent}
          onChange={onQueryChange}
          onSearch={onSearch}
        />
      </Layout>
    );
  };

  const searchResultLayout = () => {
    return (
      <Layout style={{ display: !firstSearch ? undefined : "none" }}>
        <Layout className="searchSession">
          <Search
            className="search"
            size="large"
            placeholder="請輸入查詢字詞"
            value={queryContent}
            onChange={onQueryChange}
            onSearch={onSearch}
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
                    <Menu.ItemGroup
                      key={`sense${i}-${j}`}
                      title={senseNode.def}
                    >
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
              <div id="graph" />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  };

  return (
    <Layout>
      <Header className="header">
        <img
          className="logo"
          src="/CwnWeb2/cwn-logo-main.svg"
          alt="中文詞彙網路 CWN"
          onClick={() => setFirstSearch(true)}
          style={{ cursor: "pointer" }}
        />
        {/* <div className="logo" /> */}
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}></Menu>
      </Header>
      {beginningLayout()}
      {searchResultLayout()}
      <div className="spinRoot" style={{ display: loading ? "flex" : "none" }}>
        <Spin size="large" spinning={loading} />
      </div>
    </Layout>
  );
}

export default Home;
