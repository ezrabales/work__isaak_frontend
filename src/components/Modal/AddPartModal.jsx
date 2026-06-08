import Modal from "./Modal";
import { useGlobal } from "../GlobalState/GlobalState";
import Table from "../Table/Table";
import { useEffect, useState } from "react";
import { useForm } from "../../hooks/useForm";
import { getParts } from "../../utils/parts";

const AddPartModal = ({ token, invoiceNum }) => {
  const { modalOpen, setModalOpen } = useGlobal();
  const { parts, setParts } = useGlobal();
  const [localParts, setLocalParts] = useState([]);
  const [search, setSearch] = useState("");

  function setPartsValue(id, value) {
    setParts((prev) =>
      prev.map((part, index) =>
        part._id === id
          ? {
              ...part,
              quantity: value != null ? Number(value) : part.quantity + 1,
            }
          : part,
      ),
    );
  }

  useEffect(() => {
    const localInvoice = JSON.parse(localStorage.getItem(invoiceNum) || "{}");
    setLocalParts(localInvoice.parts || []);
  }, [invoiceNum]);

  useEffect(() => {
    getParts({ token })
      .then((res) => {
        setParts(
          res.data.map((part) => {
            const localPart = localParts.find((lp) => lp._id === part._id);

            return {
              ...part,
              quantity: localPart ? localPart.quantity : 0,
            };
          }),
        );
      })
      .catch((err) => console.error(err));
  }, [token, localParts]);

  if (modalOpen !== "part") return;
  return (
    <Modal
      title={"Parts"}
      backTo={() => {
        setModalOpen("invoice");
      }}
    >
      {parts.length <= 0 ? (
        <div className="no-data">No Parts</div>
      ) : (
        <>
          <div className="settings__search-container">
            <input
              className="settings__search-bar"
              type="text"
              placeholder="Search parts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Table
            head={["Name", "Cost", "Add", "Quantity"]}
            body={parts
              .filter((part) =>
                part.name.toLowerCase().includes(search.toLowerCase()),
              )
              .map((part, index) => {
                return [
                  part.name,
                  `$${part.cost}`,
                  <button
                    className="sections__section-row-btn"
                    onClick={() => {
                      setPartsValue(part._id);
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
                        setPartsValue(part._id, e.target.value);
                      }}
                    />
                  ) : (
                    ""
                  ),
                ];
              })}
          />
        </>
      )}

      {parts.length <= 0 ? (
        ""
      ) : (
        <button
          className="sections__section-btn"
          onClick={() => {
            const usedParts = parts.filter((part) => Number(part.quantity) > 0);

            const savedInvoice =
              JSON.parse(localStorage.getItem(invoiceNum)) || {};

            localStorage.setItem(
              invoiceNum,
              JSON.stringify({
                ...savedInvoice,
                parts: usedParts,
              }),
            );
            setModalOpen("invoice");
          }}
        >
          Add to Invoice
        </button>
      )}

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
