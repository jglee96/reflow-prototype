import { Input } from "antd";
import { Handle, NodeProps, Position } from "reactflow";

export type NodeData = {
  label: string;
};

function MindMapNode({ data }: NodeProps<NodeData>) {
  return (
    <>
      <Input defaultValue={data.label} />
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}

export default MindMapNode;
