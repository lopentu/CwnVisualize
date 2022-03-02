import wordMap from "../data/word_map.json";
import relationLabels from "../data/relation_labels.json";
import POS_LABELS from "../data/cwn-pos-label.json";
import { useState } from "react";

const posLabels = {};
POS_LABELS.forEach((pos_label) => (posLabels[pos_label.pos] = pos_label.label));

const useData = () => {
  const [nodesMap, setNodesMap] = useState(new Map());

  const groupBy = (nodes, prop) => {
    return nodes.reduce((groups, node) => {
      groups[node[prop]] = groups[node[prop]] || [];
      groups[node[prop]].push(node);
      return groups;
    }, {});
  };

  const getRelationNodes = (relations, zhuyin_idx, pos_idx, sense_idx) => {
    return Object.keys(relations).map((type, l) => {
      const relationNode = {
        id: `relation-${zhuyin_idx}-${pos_idx}-${sense_idx}-${l}`,
        node_type: "relation",
        name: relationLabels[type],
        value: 30,
        children: relations[type].map((node, m) => {
          const refGlyphNode = {
            id: `ref_glyph-${zhuyin_idx}-${pos_idx}-${sense_idx}-${l}-${m}`,
            node_type: "ref_glyph",
            name: `[fontSize: 20px]${node[0]}`,
            value: 50,
            children: [],
            parent: `relation-${zhuyin_idx}-${pos_idx}-${sense_idx}-${l}`,
            cwn_id: node[1],
            ref: node[0],
            relation_type: relationLabels[type],
            zhuyin_idx,
          };
          setNodesMap(
            new Map(
              nodesMap.set(
                `ref_glyph-${zhuyin_idx}-${pos_idx}-${sense_idx}-${l}-${m}`,
                refGlyphNode
              )
            )
          );
          return refGlyphNode;
        }),
        parent: `sense-${zhuyin_idx}-${pos_idx}-${sense_idx}`,
        relation: type,
        zhuyin_idx,
      };
      setNodesMap(
        new Map(
          nodesMap.set(
            `relation-${zhuyin_idx}-${pos_idx}-${sense_idx}-${l}`,
            relationNode
          )
        )
      );
      return relationNode;
    });
  };

  const getPosNodes = (pos, zhuyin_idx) => {
    return Object.keys(pos).map((type, j) => {
      const POSNode = {
        id: `POS-${zhuyin_idx}-${j}`,
        node_type: "POS",
        name: `[bold]${type}`,
        value: 20,
        children: pos[type].map((node, k) => {
          const senseNode = {
            id: `sense-${zhuyin_idx}-${j}-${k}`,
            ...node,
            node_type: "sense",
            name: "",
            value: 0,
            children: getRelationNodes(node.relations, zhuyin_idx, j, k),
            parent: `POS-${zhuyin_idx}-${j}`,
            zhuyin_idx,
          };
          setNodesMap(
            new Map(nodesMap.set(`sense-${zhuyin_idx}-${j}-${k}`, senseNode))
          );
          return senseNode;
        }),
        parent: `zhuyin-${zhuyin_idx}`,
        label: type
          .split(",")
          .map((t) => posLabels[t])
          .join(","),
        zhuyin_idx,
      };

      setNodesMap(new Map(nodesMap.set(`POS-${zhuyin_idx}-${j}`, POSNode)));
      return POSNode;
    });
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

    const glyphNode = {
      id: "glyph",
      node_type: "glyph",
      name: `[fontSize: 30px]${glyph}`,
      value: 100,
      children: Object.keys(groupedNodes).map((zhuyin, i) => {
        const zhuyinNode = {
          id: `zhuyin-${i}`,
          node_type: "zhuyin",
          name: `[bold]${zhuyin.split("　").join("\n")}`,
          value: 50,
          children: getPosNodes(groupBy(groupedNodes[zhuyin], "pos"), i),
          parent: "glyph",
          lemma: glyph,
          idx: i,
        };

        setNodesMap(new Map(nodesMap.set(`zhuyin-${i}`, zhuyinNode)));
        return zhuyinNode;
      }),
      // x: am5.percent(50),
      // y: am5.percent(50),
    };
    setNodesMap(new Map(nodesMap.set("glyph", glyphNode)));
    return [glyphNode];
  };

  const highlightNodesAndPath = (id, highlight = true) => {
    let node = nodesMap.get(id);
    node.end_node = highlight;
    while (node) {
      node.highlight = highlight;
      node = nodesMap.get(node.parent);
      if (node) {
        node.end_node = false;
      }
    }
    return [nodesMap.get("glyph")];
  };

  return [queryGlyph, highlightNodesAndPath];
};

export default useData;
