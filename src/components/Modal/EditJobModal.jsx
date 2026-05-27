import Modal from "./Modal";
import Form from "../Form/Form";
import { useGlobal } from "../GlobalState/GlobalState";

const EditJobModal = () => {
  const { modalOpen, setModalOpen } = useGlobal();
  if (modalOpen !== "editJob") return;
  return (
    <Modal title={"Edit Job"}>
      <p className="invoice-num">
        Invoice Number: <span className="invoice-num-num">invoice_1</span>
      </p>
      <Form
        inputs={[
          {
            name: "invoice",
            type: "text",
            placeholder: "Invoice number",
            labelText: "Invoice Number *",
            required: true,
          },
          {
            name: "location",
            type: "address",
            placeholder: "Location",
            labelText: "Address *",
            required: true,
          },
          {
            name: "notes",
            type: "text",
            placeholder: "Notes",
            labelText: "Notes",
          },
          <button
            className="edit__btn"
            onClick={() => setModalOpen("editPictures")}
          >
            Edit Pictures
          </button>,
          {
            name: "status",
            type: "radio",
            labelText: "Payment Status *",
            required: true,
            options: [
              { value: "notCharged", label: "Not Charged" },
              { value: "awaitingPayment", label: "Awaiting Payment" },
              { value: "partialPayment", label: "Partially Paid" },
              { value: "fullPayment", label: "Paid in Full" },
            ],
          },
          {
            name: "dateStated",
            type: "date",
            labelText: "Date Started *",
            required: true,
          },
          {
            name: "dateEnded",
            type: "date",
            labelText: "Date Ended",
          },
          <button className="edit__btn_delete">Delete</button>,
        ]}
      />
    </Modal>
  );
};
export default EditJobModal;
