import wordMap from "../data/word_map.json";
import relationLabels from "../data/relation_labels.json";

const useData = () => {
  const groupBy = (nodes, prop) => {
    return nodes.reduce((groups, node) => {
      console.log(node[prop]);
      groups[node[prop]] = groups[node[prop]] || [];
      groups[node[prop]].push(node);
      return groups;
    }, {});
  };

  const getRelationNodes = (relationsObj) => {
    return Object.keys(relationsObj).reduce((children, type) => {
      children = [
        ...children,
        ...relationsObj[type].map((node) => ({
          name: `[fontSize: 20px]${node[0]}`,
          value: 15,
          children: [],
          cwn_id: node[1],
          relation_type: `${relationLabels[type]} ${type}`,
        })),
      ];
      return children;
    }, []);
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
        name: `[fontSize: 30px]${glyph}`,
        value: 100,
        children: Object.keys(groupedNodes).map((zhuyin) => ({
          name: zhuyin,
          value: 50,
          children: groupedNodes[zhuyin].map((n) => ({
            ...n,
            name: n.pos,
            value: 10,
            children: getRelationNodes(n.relations),
          })),
          lemma: glyph,
        })),
      },
    ];
  };

  return queryGlyph;
};

export default useData;
