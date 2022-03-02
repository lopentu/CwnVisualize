import { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { chunkString } from "../utils/utility";
import { useNavigate } from "react-router-dom";
import { colors, getNodeColors } from "../ui/colors";

const useForceDirectedGraph = () => {
  const graphRef = useRef(null);
  const seriesRef = useRef();
  const navigate = useNavigate();
  // const legendRef = useRef();

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
          idField: "id",
          minRadius: 15,
          maxRadius: 60,
          nodePadding: 10,
          strokeWidth: 5,
          xField: "x",
          yField: "y",
          centerStrength: 2,
          manyBodyStrength: -50,
          // initialFrames: 500,
          showOnFrame: 100,
          velocityDecay: 0.85,
          singleBranchOnly: true,
        })
      );

      series.outerCircles.template.setAll({
        strokeWidth: 1.5,
      });

      series.links.template.setAll({
        strokeWidth: 3,
        strokeOpacity: 0.35,
      });

      series.nodes.template.adapters.add(
        "cursorOverStyle",
        (cursorOverStyle, target) => {
          if (target?.dataItem?.dataContext?.ref) {
            return "pointer";
          }
          return cursorOverStyle;
        }
      );

      series.nodes.template.adapters.add("tooltipText", (text = "", target) => {
        if (target.dataItem) {
          const node = target.dataItem.dataContext;
          switch (node.node_type) {
            case "POS":
              return node.label;
            case "sense":
              let examplesText = node.examples;
              if (examplesText) {
                examplesText = examplesText
                  .map((v, i) => `${i + 1}. ${chunkString(v, 16)}`)
                  .join("\r\n");
              }
              return (
                chunkString(`定義：${node.definition}`, 16) +
                (examplesText ? `\n例句：\n${examplesText}` : "")
              );
            case "relation":
              return node.relation;
            default:
              return "";
          }
        }
        return text;
      });

      series.nodes.template.events.on("click", (e) => {
        // console.log("~~~", e.target.dataItem.dataContext);
        const linkedGlyph = e.target.dataItem.dataContext.ref;
        if (linkedGlyph) {
          navigate(`/${linkedGlyph}`);
        }
      });

      series.circles.template.adapters.add("fill", function (fill, target) {
        if (
          target.dataItem.dataContext["end_node"] &&
          target.dataItem.dataContext["highlight"]
        ) {
          return am5.color(colors.highlight);
        }
        return getNodeColors(fill, target);
      });

      series.outerCircles.template.adapters.add(
        "stroke",
        function (fill, target) {
          if (target.dataItem.dataContext["highlight"]) {
            return am5.color(colors.highlight);
          }
          return getNodeColors(fill, target);
        }
      );

      series.outerCircles.template.adapters.add(
        "strokeWidth",
        function (width, target) {
          if (target.dataItem.dataContext["highlight"]) {
            return 3;
          }
          return width;
        }
      );

      series.links.template.adapters.add("stroke", function (fill, target) {
        if (target.get("target").dataContext["highlight"]) {
          return am5.color(colors.highlight);
        }
        return am5.color(colors.stroke);
      });

      series.links.template.adapters.add(
        "strokeWidth",
        function (width, target) {
          if (target.get("target").dataContext["highlight"]) {
            return 6;
          }
          return width;
        }
      );

      console.log(series.nodes.values);
      seriesRef.current = series;

      // const legend = container.children.push(
      //   am5.Legend.new(graphRef.current, {
      //     centerX: am5.percent(50),
      //     x: am5.percent(50),
      //     layout: graphRef.current.horizontalLayout,
      //   })
      // );
      // legendRef.current = legend;
    }

    return () => {
      if (graphRef.current) {
        graphRef.current.dispose();
      }
    };
  }, []);

  const updateGraph = (data) => {
    if (graphRef.current && data.length > 0) {
      seriesRef.current?.data?.setAll(data);
      // series.set("selectedDataItem", series.dataItems[0]);
      // legendRef.current?.data?.setAll(
      //   seriesRef.current?.dataItems?.[0]?.get("children") ?? []
      // );
    }
  };

  return [updateGraph];
};

export default useForceDirectedGraph;
