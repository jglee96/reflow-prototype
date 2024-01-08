import ReactFlow, {
  Controls,
  Panel,
  NodeOrigin,
  Node,
  useReactFlow,
  Edge,
} from "reactflow";
import Dagre, { GraphLabel } from "@dagrejs/dagre";
import MindMapNode from "./components/MindMapNode";
import MindMapEdge from "./components/MindMapEdge";
import { useCallback } from "react";
import { Button } from "antd";
import { useFlowActions, useFlowState } from "./store";
import { useShallow } from "zustand/react/shallow";

// we have to import the React Flow styles for it to work
import "reactflow/dist/style.css";

const nodeTypes = {
  mindmap: MindMapNode,
  room: MindMapNode,
};

const edgeTypes = {
  mindmap: MindMapEdge,
};

// this places the node origin in the center of a node
const nodeOrigin: NodeOrigin = [0.5, 0.5];

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

function Flow() {
  const nodes = useFlowState(useShallow((state) => state.nodes));
  const edges = useFlowState(useShallow((state) => state.edges));
  const { setNodes, setEdges, onNodesChange, onEdgesChange, addEdge } =
    useFlowActions();
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
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={addEdge}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      nodeOrigin={nodeOrigin}
      fitView
    >
      <Controls showInteractive={false} />
      <Panel position="top-left">
        <Button onClick={() => onLayout({ rankdir: "TB" })}>Layout</Button>
      </Panel>
    </ReactFlow>
  );
}

export default Flow;
