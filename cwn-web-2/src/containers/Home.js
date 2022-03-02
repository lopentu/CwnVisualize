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
  Button,
} from "antd";
import { TagOutlined, QuestionCircleOutlined } from "@ant-design/icons";

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
  const [query, highlight] = useData();
  const { glyph } = useParams();
  const navigate = useNavigate();
  const [lastClickedSense, setLastClickedSense] = useState("");
  const [lastClickedRefGlyph, setLastClickedRefGlyph] = useState("");
  const [openKeys, setOpenKeys] = useState([]);

  const onQueryChange = (e) => {
    setQueryContent(e.target.value);
  };

  useEffect(() => {
    setOpenKeys([]);
  }, [glyph]);

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
            // navigate("/");
            message.error({
              content: "無該字詞",
              style: {
                marginTop: !glyph ? "75vh" : "15vh",
              },
            });
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

  const onClickSense = (e) => {
    const id = e.target.getAttribute("data-id");
    if (lastClickedSense) {
      if (id === lastClickedSense) {
        return;
      }
      setLastClickedRefGlyph("");
      highlight(lastClickedSense, false);
    }
    setLastClickedSense(id);
    setData(highlight(id));
  };

  const onClickRefGlyph = (e) => {
    const id = e.target.getAttribute("data-id");
    const senseID =
      e.target.parentNode.parentNode.parentNode.parentNode.childNodes?.[0].childNodes?.[0].childNodes?.[0].getAttribute(
        "data-id"
      );
    if (senseID !== lastClickedSense) {
      if (lastClickedSense) {
        highlight(lastClickedSense, false);
      }
      setLastClickedSense(senseID);
    }
    if (lastClickedRefGlyph) {
      if (id === lastClickedRefGlyph) {
        return;
      }
      highlight(lastClickedRefGlyph, false);
    }
    setLastClickedRefGlyph(id);
    setData(highlight(id));
  };

  useEffect(() => {
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
              defaultOpenKeys={[]}
              openKeys={openKeys}
              className="result-menu"
              onOpenChange={(openKeys) => setOpenKeys(openKeys)}
            >
              {data?.[0]?.children?.map((zhuyinNode, i) => (
                <Fragment key={zhuyinNode.id}>
                  <SubMenu
                    key={zhuyinNode.id}
                    icon={<TagOutlined />}
                    title={
                      <div className="zhuyin-title">
                        {zhuyinNode.lemma} （{zhuyinNode.name.split("]")[1]}）
                      </div>
                    }
                  >
                    {zhuyinNode.children?.map((posNode, j) =>
                      posNode.children?.map((senseNode, k) => (
                        <Fragment key={senseNode.id}>
                          <Menu.ItemGroup
                            className={
                              lastClickedSense === senseNode.id
                                ? "selected"
                                : ""
                            }
                            title={
                              <div className={"sense-title"}>
                                <span
                                  className="sense-span"
                                  onClick={onClickSense}
                                  data-id={senseNode.id}
                                >
                                  {senseNode.definition}
                                </span>
                                <Tag color={colors.tag.POS} className="tag">
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
                                key={senseNode.id + `-example-${l}`}
                              >
                                {`${l + 1}. ` + example}
                              </Menu.Item>
                            ))}
                            <Menu.Item
                              className="list-item related-words"
                              key={`relatedWords${i}-${j}-${k}`}
                            >
                              {senseNode.children.map((typeNode, i) => (
                                <Fragment key={i}>
                                  <span className="typeNode-name">
                                    {typeNode.name}：
                                  </span>
                                  {typeNode.children.map((glyphNode, index) => (
                                    <Tag
                                      color={colors.tag[typeNode.name][0]}
                                      className={
                                        "tag" +
                                        (lastClickedRefGlyph === glyphNode.id
                                          ? " selected"
                                          : "")
                                      }
                                      key={`${glyphNode.name}-tag-${index}`}
                                      onClick={onClickRefGlyph}
                                      data-id={glyphNode.id}
                                    >
                                      {glyphNode.ref}
                                    </Tag>
                                  ))}
                                  <br />
                                </Fragment>
                              ))}
                            </Menu.Item>
                          </Menu.ItemGroup>
                          {j < zhuyinNode.children?.length - 1 && (
                            <Menu.Divider dashed={true} />
                          )}
                        </Fragment>
                      ))
                    )}
                  </SubMenu>
                  <Menu.Divider />
                </Fragment>
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
        <div className="header-btns">
          {/* <Button
            className="intro-btn"
            icon={<QuestionCircleOutlined />}
            type="ghost"
            size="large"
          >
            使用說明
          </Button> */}
        </div>
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
