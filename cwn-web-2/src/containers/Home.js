import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Input,
  Spin,
  message,
  Divider,
  Tag,
  Tooltip,
} from "antd";
import { TagOutlined, TagsOutlined } from "@ant-design/icons";

import "./Home.css";
import useData from "../hooks/useData";
import useForceDirectedGraph from "../hooks/useForceDirectedGraph";
import { Link, useNavigate, useParams } from "react-router-dom";

const tagColors = {
  整體詞: "cyan",
  反義詞: "cyan",
  部分詞: "red",
  上位詞: "green",
  下位詞: "lime",
  異體詞: "volcano",
  近義詞: "orange",
  類義詞: "gold",
  同義詞: "geekblue",
  異體詞: "purple",
};

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { Search } = Input;

function Home({ pathname }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [queryContent, setQueryContent] = useState("");
  const [updateGraph] = useForceDirectedGraph();
  const query = useData();
  const { glyph } = useParams();
  const navigate = useNavigate();

  const onQueryChange = (e) => {
    setQueryContent(e.target.value);
  };

  useEffect(() => {
    if (!glyph) {
      setQueryContent("");
      return;
    }
    if (glyph !== queryContent) {
      setLoading(true);
      // The block in setTimeout will execute in another thread.
      // Thus, it won't block rendering.
      setTimeout(async () => {
        setQueryContent(glyph);
        const result = await query(glyph);
        setLoading(false);
        setTimeout(() => {
          if (result) {
            setData(result);
          } else {
            navigate("/");
          }
        }, 100);
      }, 400);
    }
  }, [glyph]);

  const onSearch = async (value) => {
    if (!queryContent) {
      return;
    }
    setLoading(true);
    // The block in setTimeout will execute in another thread.
    // Thus, it won't block rendering.
    setTimeout(async () => {
      const result = await query(value);
      setLoading(false);
      setTimeout(() => {
        if (result) {
          setData(result);
          navigate("/" + queryContent);
        } else {
          message.error({
            content: "無該字詞",
            style: {
              marginTop: !glyph ? "75vh" : "15vh",
            },
          });
        }
      }, 100);
    }, 400);
  };

  useEffect(() => {
    console.log("data:", data);
    updateGraph(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const beginningLayout = () => {
    return (
      <Layout
        className="beginningLayout"
        style={{ display: !glyph ? undefined : "none" }}
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
      <Layout style={{ display: glyph ? undefined : "none" }}>
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
              {data?.[0]?.children?.map((zhuyinNode, i) => (
                <>
                  <SubMenu
                    key={`zhuyin${i}`}
                    icon={<TagOutlined />}
                    title={
                      <div className="zhuyin-title">
                        {zhuyinNode.lemma} （{zhuyinNode.name}）
                      </div>
                    }
                  >
                    {zhuyinNode.children?.map((posNode, j) =>
                      posNode.children?.map((senseNode, k) => (
                        <Menu.ItemGroup
                          key={`sense${i}-${j}-${k}`}
                          title={
                            <div className="sense-title">
                              {senseNode.definition}
                              {senseNode.children.map((typeNode) =>
                                typeNode.children.map((glyphNode) => (
                                  <Tooltip
                                    title={typeNode.name}
                                    color={tagColors[typeNode.name]}
                                  >
                                    <Tag
                                      color={tagColors[typeNode.name]}
                                      className="tag"
                                    >
                                      {glyphNode.ref}
                                    </Tag>
                                  </Tooltip>
                                ))
                              )}
                              <Tooltip title={posNode.label} color="magenta">
                                <Tag
                                  icon={<TagsOutlined />}
                                  color="magenta"
                                  className="tag"
                                >
                                  {posNode.name}
                                </Tag>
                              </Tooltip>
                            </div>
                          }
                        >
                          {senseNode.examples ? (
                            senseNode.examples.map((example, l) => (
                              <Menu.Item
                                className="wrapText"
                                key={`example${i}-${j}-${k}-${l}`}
                                style={{ pointerEvents: "none" }}
                              >
                                {`${l + 1}. ` + example}
                              </Menu.Item>
                            ))
                          ) : (
                            <></>
                          )}
                        </Menu.ItemGroup>
                      ))
                    )}
                  </SubMenu>
                  <Divider style={{ margin: 0 }} />
                </>
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
        <Link to="/">
          <img
            className="logo"
            src="/CwnWeb2/cwn-logo-main.svg"
            alt="中文詞彙網路 CWN"
            style={{ cursor: "pointer" }}
          />
        </Link>
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
