import Modal from "./Modal";
import { useGlobal } from "../GlobalState/GlobalState";
import Table from "../Table/Table";
import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import Form from "../Form/Form";

const AdditionalChargesDiscountsModal = ({ invoiceNum }) => {
  const { modalOpen, setModalOpen } = useGlobal();

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
          const savedInvoice =
            JSON.parse(localStorage.getItem(invoiceNum)) || {};

          const currentAdditions = savedInvoice.additions || [];

          localStorage.setItem(
            invoiceNum,
            JSON.stringify({
              ...savedInvoice,
              additions: [
                ...currentAdditions,
                {
                  reason: e.reason,
                  cost: Number(e.cost),
                },
              ],
            }),
          );

          setModalOpen("invoice");
        }}
        inputs={[
          {
            name: "reason",
            type: "text",
            placeholder: "Reason",
            labelText: "Reason *",
            required: true,
          },
          {
            name: "cost",
            type: "number",
            placeholder: "Cost",
            labelText: "Cost *",
            required: true,
          },
        ]}
      />
    </Modal>
  );
};
export default AdditionalChargesDiscountsModal;
