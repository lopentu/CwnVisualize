import { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { chunkString } from "../utils/utility";

const useForceDirectedGraph = () => {
  const graphRef = useRef(null);
  const seriesRef = useRef();
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
          initialDepth: 1,
          topDepth: 0,
          valueField: "value",
          categoryField: "name",
          childDataField: "children",
          minRadius: 20,
          maxRadius: 60,
          nodePadding: 10,
          xField: "x",
          yField: "y",
          centerStrength: 2,
          manyBodyStrength: -30,
          // initialFrames: 500,
          showOnFrame: 100,
          velocityDecay: 0.85,
          singleBranchOnly: true,
        })
      );
      series.nodes.template.adapters.add("tooltipText", (text = "", target) => {
        if (target.dataItem) {
          if (target.dataItem.dataContext?.definition) {
            let examplesText = target.dataItem.dataContext.examples;
            if (examplesText) {
              examplesText = examplesText
                .map((v, i) => `${i + 1}. ${chunkString(v, 16)}`)
                .join("\r\n");
            }
            return (
              chunkString(
                `定義：${target.dataItem.dataContext.definition}`,
                16
              ) + (examplesText ? `\n例句：\n${examplesText}` : "")
            );
          } else if (target.dataItem.dataContext.relation_type) {
            return target.dataItem.dataContext.relation_type;
          } else {
            return "";
          }
        }
        return text;
      });

      series.nodes.template.events.on("click", (e) => {
        console.log("~~~", e.target.dataItem.dataContext);
      });

      seriesRef.current = series;
      console.log(series);

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
