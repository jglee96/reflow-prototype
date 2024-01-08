import ReactFlow, {
  Controls,
  Panel,
  NodeOrigin,
  OnConnectStart,
  OnConnectEnd,
  useStoreApi,
  Node,
  useReactFlow,
  Edge,
} from "reactflow";
import Dagre, { GraphLabel } from "@dagrejs/dagre";
import MindMapNode from "./components/MindMapNode";
import MindMapEdge from "./components/MindMapEdge";
import { useCallback, useRef } from "react";
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
  const { setNodes, setEdges, onNodesChange, onEdgesChange, addChildNode } =
    useFlowActions();

  const connectingNodeId = useRef<string | null>(null);
  const store = useStoreApi();
  const { screenToFlowPosition, fitView } = useReactFlow();

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

  const getChildNodePosition = useCallback(
    (event: MouseEvent | TouchEvent, parentNode?: Node) => {
      const { domNode } = store.getState();

      if (
        !domNode ||
        // we need to check if these properites exist, because when a node is not initialized yet,
        // it doesn't have a positionAbsolute nor a width or height
        !parentNode?.positionAbsolute ||
        !parentNode?.width ||
        !parentNode?.height
      ) {
        return;
      }

      const isTouchEvent = "touches" in event;
      const x = isTouchEvent ? event.touches[0].clientX : event.clientX;
      const y = isTouchEvent ? event.touches[0].clientY : event.clientY;
      // we need to remove the wrapper bounds, in order to get the correct mouse position
      const panePosition = screenToFlowPosition({
        x,
        y,
      });

      // we are calculating with positionAbsolute here because child nodes are positioned relative to their parent
      return {
        x:
          panePosition.x - parentNode.positionAbsolute.x + parentNode.width / 2,
        y:
          panePosition.y -
          parentNode.positionAbsolute.y +
          parentNode.height / 2,
      };
    },
    [screenToFlowPosition, store]
  );

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      const { nodeInternals } = store.getState();
      const targetIsPane = (event.target as Element).classList.contains(
        "react-flow__pane"
      );

      if (targetIsPane && connectingNodeId.current) {
        const parentNode = nodeInternals.get(connectingNodeId.current);
        const childNodePosition = getChildNodePosition(event, parentNode);

        if (parentNode && childNodePosition) {
          addChildNode(parentNode, childNodePosition);
        }
      }
    },
    [addChildNode, getChildNodePosition, store]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnectStart={onConnectStart}
      onConnectEnd={onConnectEnd}
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
