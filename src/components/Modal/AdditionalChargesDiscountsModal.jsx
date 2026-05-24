import Modal from "./Modal";
import { useGlobal } from "../GlobalState/GlobalState";
import Table from "../Table/Table";
import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import Form from "../Form/Form";

const AdditionalChargesDiscountsModal = () => {
  const { modalOpen, setModalOpen } = useGlobal();
  const [additions, setAdditions] = useState([
    { reason: "some reason", cost: 20 },
    { reason: "some other reason", cost: -10 },
  ]);

  if (modalOpen !== "additional") return;
  return (
    <Modal
      title={"Parts"}
      backTo={() => {
        setModalOpen("invoice");
      }}
    >
      <Form
        onSuccessfulSubmit={(e) => {
          const currentAdditions =
            JSON.parse(localStorage.getItem("invoice_1.additions")) || [];

          localStorage.setItem(
            "invoice_1.additions",
            JSON.stringify([
              ...currentAdditions,
              { reason: e.reason, cost: Number(e.cost) },
            ]),
          );

          setModalOpen("invoice");
        }}
        inputs={[
          {
            name: "reason",
            type: "text",
            placeholder: "Reason",
            labelText: "Reason *",
            required: "true",
          },
          {
            name: "cost",
            type: "number",
            placeholder: "Cost",
            labelText: "Cost *",
            required: "true",
          },
        ]}
      />
    </Modal>
  );
};
export default AdditionalChargesDiscountsModal;
