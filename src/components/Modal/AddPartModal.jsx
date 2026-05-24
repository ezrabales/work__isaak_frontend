import Modal from "./Modal";
import { useGlobal } from "../GlobalState/GlobalState";
import Table from "../Table/Table";
import { useState } from "react";
import { useForm } from "../../hooks/useForm";

const AddPartModal = () => {
  const { modalOpen, setModalOpen } = useGlobal();
  const [parts, setParts] = useState([
    { name: "some pvc elbow", quantity: 0, cost: 10 },
    { name: "some pvc part", quantity: 0, cost: 8 },
  ]);

  function setPartsValue(num, value) {
    setParts((prev) =>
      prev.map((part, index) =>
        index === num
          ? {
              ...part,
              quantity: value != null ? Number(value) : part.quantity + 1,
            }
          : part,
      ),
    );
  }

  if (modalOpen !== "part") return;
  return (
    <Modal
      title={"Parts"}
      backTo={() => {
        setModalOpen("invoice");
      }}
    >
      <Table
        head={["Name", "Cost", "Add", "Quantity"]}
        body={parts.map((part, index) => {
          return [
            part.name,
            `$${part.cost}`,
            <button
              className="sections__section-row-btn"
              onClick={() => {
                setPartsValue(index);
              }}
            >
              Add Part
            </button>,
            part.quantity > 0 ? (
              <input
                type="number"
                className="sections__section-input"
                value={part.quantity}
                onChange={(e) => {
                  setPartsValue(index, e.target.value);
                }}
              />
            ) : (
              ""
            ),
          ];
        })}
      />
      <button
        className="sections__section-btn"
        onClick={() => {
          const usedParts = parts.filter((part) => Number(part.quantity) > 0);

          localStorage.setItem("invoice_1.parts", JSON.stringify(usedParts));
          setModalOpen("invoice");
        }}
      >
        Add to Invoice
      </button>
      <button
        className="sections__section-btn"
        onClick={() => setModalOpen("createPart")}
      >
        Create New Part
      </button>
    </Modal>
  );
};
export default AddPartModal;
