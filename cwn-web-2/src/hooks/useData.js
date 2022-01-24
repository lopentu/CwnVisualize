import React, { useEffect, useState } from "react";
import Nodes from "../data/cwn_base_nodes.json";
import Edges from "../data/cwn_base_edges.json";

const useData = () => {
  // const [glyphs, setGlyphs] = useState([]);

  const queryGlyph = (glyph) => {
    console.log(glyph);
    const [nodeName] = Object.keys(Nodes).filter((name) => {
      return (
        Nodes[name]["node_type"] === "glyph" && Nodes[name]["glyph"] === glyph
      );
    });
    const connectedNodesNames = Object.keys(Edges).reduce((result, name) => {
      const splitName = name.split("-");
      if (splitName.find((n) => n === nodeName)) {
        result = [
          ...result,
          splitName[0] === nodeName ? splitName[1] : splitName[0],
        ];
      }
      return result;
    }, []);

    const connectedNodes = connectedNodesNames.map((name) => Nodes[name]);
    return [nodeName, Nodes[nodeName], connectedNodesNames, connectedNodes];
  };

  return queryGlyph;
};

export default useData;
