import React, { Fragment, useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Input,
  Spin,
  message,
  Divider,
  Tag,
  Tooltip,
  List,
} from "antd";
import { TagOutlined, TagsOutlined } from "@ant-design/icons";

import "./Home.css";
import useData from "../hooks/useData";
import useForceDirectedGraph from "../hooks/useForceDirectedGraph";
import { Link, useNavigate, useParams } from "react-router-dom";
import { colors } from "../ui/colors";

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
              selectable={false}
              // defaultSelectedKeys={["1"]}
              // defaultOpenKeys={["sub1"]}
              className="result-menu"
            >
              {data?.[0]?.children?.map((zhuyinNode, i) => (
                <SubMenu
                  key={`zhuyin${i}`}
                  icon={<TagOutlined />}
                  title={
                    <div className="zhuyin-title">
                      {zhuyinNode.lemma} （{zhuyinNode.name.split("]")[1]}）
                    </div>
                  }
                >
                  {zhuyinNode.children?.map((posNode, j) =>
                    posNode.children?.map((senseNode, k) => (
                      <Fragment key={`sense${i}-${j}-${k}`}>
                        <Menu.ItemGroup
                          title={
                            <div className="sense-title">
                              <span>{senseNode.definition}</span>
                              <Tag
                                // icon={<TagsOutlined />}
                                color={colors.tag.POS}
                                className="tag"
                              >
                                {`${posNode.name.split("]")[1]} ${
                                  posNode.label
                                }`}
                              </Tag>
                            </div>
                          }
                        >
                          {senseNode.examples?.map((example, l) => (
                            <Menu.Item
                              className="list-item"
                              key={`example${i}-${j}-${k}-${l}`}
                            >
                              {`${l + 1}. ` + example}
                            </Menu.Item>
                          ))}
                          {senseNode.children.length > 0 && (
                            <Menu.Item
                              className="list-item related-words"
                              key={`relatedWords${i}-${j}-${k}-`}
                            >
                              相關詞：
                              {senseNode.children.map((typeNode) =>
                                typeNode.children.map((glyphNode, index) => (
                                  <Tooltip
                                    title={typeNode.name}
                                    color={colors.tag[typeNode.name][0]}
                                    key={`${glyphNode.name}-${index}`}
                                  >
                                    <Tag
                                      color={colors.tag[typeNode.name][0]}
                                      className="tag"
                                      onClick={() => {
                                        navigate(`/${glyphNode.ref}`);
                                      }}
                                    >
                                      {glyphNode.ref}
                                    </Tag>
                                  </Tooltip>
                                ))
                              )}
                            </Menu.Item>
                          )}
                        </Menu.ItemGroup>
                        <Menu.Divider
                          style={{ marginBottom: 0, marginTop: 10 }}
                        />
                      </Fragment>
                    ))
                  )}
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
