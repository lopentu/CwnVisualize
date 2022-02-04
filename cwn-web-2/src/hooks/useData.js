import Nodes from "../data/cwn_base_nodes.json";
import Edges from "../data/cwn_base_edges.json";

const useData = () => {
  const findConnectedNodes = (nodeName, second = true) => {
    return Object.keys(Edges).reduce((result, name) => {
      const splitName = name.split("-");
      if (splitName[(second + 1) % 2] === nodeName) {
        result = [
          ...result,
          { name: splitName[+second], ...Nodes[splitName[+second]] },
        ];
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
    if (!nodeName) return null;

    const connectedNodes = findConnectedNodes(nodeName);
    return [
      {
        name: `[fontSize: 20px]${Nodes[nodeName].glyph}`,
        value: 100,
        children: connectedNodes.map((n) => ({
          ...n,
          name: `[fontSize: 15px]${n.zhuyin}`,
          value: 50,
          children: queryLemma(n.name),
        })),
      },
    ];
  };

  const queryLemma = (nodeName) => {
    const connectedNodes = findConnectedNodes(nodeName); // assert node_type === "sense"
    return connectedNodes.map((n) => ({
      ...n,
      name: n.pos,
      value: 10,
      children: [], //queryRelation(n.name),
    }));
  };

  // const queryRelation = (nodeName) => {
  //   console.log(Nodes[nodeName]);
  //   const connectedRelationNodes = findConnectedNodes(nodeName);
  //   return connectedRelationNodes.map((n) => {
  //     const connectedSenseNodes = findConnectedNodes(n.name, false);
  //     return connectedSenseNodes.reduce((result, nn) => {
  //       const [lemmaNode] = findConnectedNodes(nn.name, false);
  //       if (lemmaNode) {
  //         return [
  //           ...result,
  //           {
  //             ...lemmaNode,
  //             name: Nodes[lemmaNode.name][Nodes[lemmaNode.name].node_type], // lemma || glyph ??
  //             value: 100,
  //             children: [],
  //           },
  //         ];
  //       }
  //       return result;
  //     }, [])[0];
  //   });
  // };

  return queryGlyph;
};

export default useData;
