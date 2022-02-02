import { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { chunkString } from "../utils/utility";

const useForceDirectedGraph = () => {
  const graphRef = useRef(null);
  const seriesRef = useRef();
  const legendRef = useRef();

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
          minRadius: 10,
          maxRadius: 40,
          nodePadding: 10,
          xField: "x",
          yField: "y",
        })
      );
      series.nodes.template.adapters.add("tooltipText", (text, target) => {
        if (target.dataItem) {
          switch (target.dataItem.dataContext?.node_type) {
            case "sense":
              const examplesText = target.dataItem.dataContext.examples
                ?.map((v, i) => `${i + 1}. ${chunkString(v, 16)}`)
                ?.join("\r\n");

              return (
                chunkString(`定義：${target.dataItem.dataContext.def}`, 16) +
                (examplesText ? `\n例句：\n${examplesText}` : "")
              );
            default:
              return "";
          }
        }
        return text;
      });
      seriesRef.current = series;
      console.log(series);

      const legend = container.children.push(
        am5.Legend.new(graphRef.current, {
          centerX: am5.percent(50),
          x: am5.percent(50),
          layout: graphRef.current.horizontalLayout,
        })
      );
      legendRef.current = legend;
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
      legendRef.current?.data?.setAll(
        seriesRef.current?.dataItems?.[0]?.get("children") ?? []
      );
    }
  };

  return [updateGraph];
};

export default useForceDirectedGraph;
