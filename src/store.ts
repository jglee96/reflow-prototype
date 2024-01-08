import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
  addEdge,
} from "reactflow";
import { create } from "zustand";

export interface RFState {
  nodes: Node<NodeData>[];
  edges: Edge[];
}

interface Action {
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addEdge: (data: Connection) => void;
  addNode: (data: Node) => void;
}

export type NodeData = {
  label: string;
};

export const useFlowState = create<RFState & { actions: Action }>()(
  (set, get) => ({
    nodes: [
      {
        id: "root",
        type: "root",
        data: { label: "root" },
        position: { x: 0, y: 0 },
      },
      {
        id: "c1-1",
        type: "c1",
        data: { label: "c1-1" },
        position: { x: -100, y: 100 },
      },
      {
        id: "c1-2",
        type: "c1",
        data: { label: "c1-2" },
        position: { x: 0, y: 100 },
      },
      {
        id: "c1-3",
        type: "c1",
        data: { label: "c1-3" },
        position: { x: 100, y: 100 },
      },
    ],
    edges: [
      {
        id: "root-c1-1",
        source: "root",
        target: "c1-1",
      },
      {
        id: "root-c1-2",
        source: "root",
        target: "c1-2",
      },
      {
        id: "root-c1-3",
        source: "root",
        target: "c1-3",
      },
    ],
    actions: {
      setNodes: (nodes: Node[]) => set({ nodes }),
      setEdges: (edges: Edge[]) => set({ edges }),
      onNodesChange: (changes: NodeChange[]) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },
      onEdgesChange: (changes: EdgeChange[]) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },
      addEdge: (data: Connection) => {
        const edges = addEdge(data, get().edges);
        set({ edges });
      },
      addNode: (data: Node) => {
        set({ nodes: [...get().nodes, data] });
      },
    },
  })
);

export const useFlowActions = (): Action =>
  useFlowState((state) => state.actions);
