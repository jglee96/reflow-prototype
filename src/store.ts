import { nanoid } from "nanoid";
import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  XYPosition,
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
  addChildNode: (parentNode: Node, position: XYPosition) => void;
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
      addChildNode: (parentNode: Node, position: XYPosition) => {
        const newNode = {
          id: nanoid(),
          type: "mindmap",
          data: { label: "New Node" },
          position,
          parentNode: parentNode.id,
        };

        const newEdge = {
          id: nanoid(),
          source: parentNode.id,
          target: newNode.id,
        };

        set({
          nodes: [...get().nodes, newNode],
          edges: [...get().edges, newEdge],
        });
      },
    },
  })
);

export const useFlowActions = (): Action =>
  useFlowState((state) => state.actions);
