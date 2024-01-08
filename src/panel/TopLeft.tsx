import { Button } from "antd";
import { Panel, Node, Edge, useReactFlow } from "reactflow";
import Dagre, { GraphLabel } from "@dagrejs/dagre";
import { useCallback } from "react";
import { useFlowActions, useFlowState } from "../store";
import { useShallow } from "zustand/react/shallow";

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  options: GraphLabel
) => {
  g.setGraph(options);

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  nodes.forEach((node) => g.setNode(node.id, node));

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const { x, y } = g.node(node.id);

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

export default function TopLeft() {
  const nodes = useFlowState(useShallow((state) => state.nodes));
  const edges = useFlowState(useShallow((state) => state.edges));
  const { setNodes, setEdges } = useFlowActions();
  const { fitView } = useReactFlow();

  const onLayout = useCallback(
    (options: GraphLabel) => {
      const layouted = getLayoutedElements(nodes, edges, options);

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);

      window.requestAnimationFrame(() => {
        fitView();
      });
    },
    [nodes, edges, setNodes, setEdges, fitView]
  );

  return (
    <Panel position="top-left">
      <Button onClick={() => onLayout({ rankdir: "TB" })}>Layout</Button>
    </Panel>
  );
}
