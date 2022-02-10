import wordMap from "../data/word_map.json";
import relationLabels from "../data/relation_labels.json";
import POS_LABELS from "../data/cwn-pos-label.json";
import * as am5 from "@amcharts/amcharts5";

const posLabels = {};
POS_LABELS.forEach((pos_label) => (posLabels[pos_label.pos] = pos_label.label));

const useData = () => {
  const groupBy = (nodes, prop) => {
    return nodes.reduce((groups, node) => {
      groups[node[prop]] = groups[node[prop]] || [];
      groups[node[prop]].push(node);
      return groups;
    }, {});
  };

  const getRelationNodes = (relations, zhuyin_idx) => {
    return Object.keys(relations).map((type) => ({
      node_type: "relation",
      name: relationLabels[type],
      value: 30,
      children: relations[type].map((node) => ({
        node_type: "ref_glyph",
        name: `[fontSize: 20px]${node[0]}`,
        value: 50,
        children: [],
        cwn_id: node[1],
        ref: node[0],
        relation_type: relationLabels[type],
        zhuyin_idx,
      })),
      relation: type,
      zhuyin_idx,
    }));
  };

  const getPosNodes = (pos, zhuyin_idx) => {
    return Object.keys(pos).map((type) => ({
      node_type: "POS",
      name: `[bold]${type}`,
      value: 20,
      children: pos[type].map((node) => ({
        ...node,
        node_type: "sense",
        name: "",
        value: 0,
        children: getRelationNodes(node.relations, zhuyin_idx),
        zhuyin_idx,
      })),
      label: posLabels[type],
      zhuyin_idx,
    }));
  };

  const queryGlyph = async (glyph) => {
    const idx = wordMap[glyph];
    if (!idx) return null;
    const response = await fetch(`./data/cwn_data/cwn_web_data_${idx}.json`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const nodes = await response.json();
    console.log(nodes[glyph]);
    const groupedNodes = groupBy(nodes[glyph], "zhuyin");

    return [
      {
        node_type: "glyph",
        name: `[fontSize: 30px]${glyph}`,
        value: 100,
        children: Object.keys(groupedNodes).map((zhuyin, i) => ({
          node_type: "zhuyin",
          name: `[bold]${zhuyin.split("　").join("\n")}`,
          value: 50,
          children: getPosNodes(groupBy(groupedNodes[zhuyin], "pos"), i),
          lemma: glyph,
          idx: i,
        })),
        // x: am5.percent(50),
        // y: am5.percent(50),
      },
    ];
  };

  return queryGlyph;
};

export default useData;
