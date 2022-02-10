import * as am5 from "@amcharts/amcharts5";

const tagColors = {
  node: {
    glyph: ["#492FB1"],
    zhuyin: ["#739ED3", "#5F817D", "#6B67A2"],
    POS: ["#ff85c0"],
    sense: ["#81A2EF"],
    relation: ["#6F94EC", "#7BB7A0", "#8A7DB5"],
  },
  stroke: "#706D8B",
  tag: {
    POS: "magenta",
  },

  整體詞: ["geekblue", "#85a5ff"],
  反義詞: ["cyan", "#5cdbd3"],
  部分詞: ["red", "#ff7875"],
  上位詞: ["green", "#95de64"],
  下位詞: ["lime", "#d3f261"],
  異體詞: ["volcano", "#ff9c6e"], // variant
  近義詞: ["orange", "#ffc069"],
  類義詞: ["gold", "#ffd666"],
  同義詞: ["blue", "#69c0ff"],
  // 異體詞: ["purple", "#b37feb"], // varword
};

const getNodeColors = (fill, target) => {
  if (target.dataItem) {
    const node = target.dataItem.dataContext;
    switch (node.node_type) {
      case "glyph":
        return am5.color(tagColors.node.glyph[0]);
      case "zhuyin":
        return am5.color(tagColors.node.zhuyin[node.idx]);
      case "POS":
        return am5.Color.brighten(
          am5.color(tagColors.node.zhuyin[node.zhuyin_idx]),
          0.5
        );
      case "sense":
        return am5.Color.brighten(
          am5.color(tagColors.node.zhuyin[node.zhuyin_idx]),
          0.75
        );
      case "relation":
      case "ref_glyph":
        return am5.color(tagColors.node.relation[node.zhuyin_idx]);
      default:
        return fill;
    }
  }
  return fill;
};

export { tagColors, getNodeColors };
