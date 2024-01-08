import ReactFlow, { Controls, NodeOrigin } from "reactflow";
import MindMapNode from "./components/MindMapNode";
import MindMapEdge from "./components/MindMapEdge";
import { useFlowActions, useFlowState } from "./store";
import { useShallow } from "zustand/react/shallow";

// we have to import the React Flow styles for it to work
import "reactflow/dist/style.css";
import TopLeft from "./panel/TopLeft";
import TopRight from "./panel/TopRight";

const nodeTypes = {
  root: MindMapNode,
  c1: MindMapNode,
  c2: MindMapNode,
  person: MindMapNode,
};

const edgeTypes = {
  mindmap: MindMapEdge,
};

// this places the node origin in the center of a node
const nodeOrigin: NodeOrigin = [0.5, 0.5];

function Flow() {
  const nodes = useFlowState(useShallow((state) => state.nodes));
  const edges = useFlowState(useShallow((state) => state.edges));
  const { onNodesChange, onEdgesChange, addEdge } = useFlowActions();

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
      <Controls />
      <TopLeft />
      <TopRight />
    </ReactFlow>
  );
}

export default Flow;
