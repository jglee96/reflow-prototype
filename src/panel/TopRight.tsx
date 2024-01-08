import { Button, Flex, Input, Modal, Select } from "antd";
import { useState } from "react";
import { Panel } from "reactflow";
import { useFlowActions } from "../store";
import { nanoid } from "nanoid";

export default function TopRight() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectValue, setSelectValue] = useState<"c1" | "c2" | "person">(
    "person"
  );
  const [label, setLabel] = useState<string>("");
  const { addNode } = useFlowActions();
  const handleOk = () => {
    addNode({
      id: nanoid(),
      type: selectValue,
      data: { label },
      position: { x: Math.random() * 400 - 200, y: 200 },
    });

    setIsModalOpen(false);
  };

  return (
    <Panel position="top-right">
      <Button onClick={() => setIsModalOpen(true)}>Add Node</Button>
      <Modal
        open={isModalOpen}
        title="Add Node"
        destroyOnClose
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Flex vertical gap="small">
          <Select
            style={{ width: "100%" }}
            defaultValue={selectValue}
            onSelect={(value) => setSelectValue(value)}
            options={[
              { value: "c1", label: "c1" },
              { value: "c2", label: "c2" },
              { value: "person", label: "person" },
            ]}
          />
          <Input
            placeholder="label"
            value={label}
            onChange={(ev) => setLabel(ev.target.value)}
          />
        </Flex>
      </Modal>
    </Panel>
  );
}
