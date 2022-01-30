import React, { useEffect, useState } from "react";
import Nodes from "../data/cwn_base_nodes.json";
import Edges from "../data/cwn_base_edges.json";

const useData = () => {
  const findConnectedNodes = (nodeName) => {
    return Object.keys(Edges).reduce((result, name) => {
      const splitName = name.split("-");
      if (splitName[0] === nodeName) {
        // console.log("~~~", name, Nodes[splitName[1]]);
        result = [...result, { name: splitName[1], ...Nodes[splitName[1]] }];
      }
      return result;
    }, []);
  };

  const queryGlyph = (glyph) => {
    console.log(glyph);
    const [nodeName] = Object.keys(Nodes).filter((name) => {
      return (
        Nodes[name]["node_type"] === "glyph" && Nodes[name]["glyph"] === glyph
      );
    });
    const connectedNodes = findConnectedNodes(nodeName);

    return [
      {
        name: Nodes[nodeName].glyph,
        children: connectedNodes.map((n) => ({
          ...n,
          name: n.zhuyin,
          children: queryLemma(n.name),
        })),
      },
    ];
  };

  const queryLemma = (nodeName) => {
    const connectedNodes = findConnectedNodes(nodeName, "sense"); // assert node_type === "sense"
    return connectedNodes.map((n) => ({ ...n, name: n.def, children: [] }));
  };

  return queryGlyph;
};

export default useData;
