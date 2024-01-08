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
  nodes: Node[];
  edges: Edge[];
}

interface Action {
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addEdge: (data: Connection) => void;
}

export const useFlowState = create<RFState & { actions: Action }>()(
  (set, get) => ({
    nodes: [
      {
        id: "root",
        type: "mindmap",
        data: { label: "root" },
        position: { x: 0, y: 0 },
      },
      {
        id: "room1",
        type: "room",
        data: { label: "room1" },
        position: { x: 100, y: 100 },
      },
    ],
    edges: [],
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
    },
  })
);

export const useFlowActions = (): Action =>
  useFlowState((state) => state.actions);
