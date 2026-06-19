import Modal from "./Modal";
import Form from "../Form/Form";
import { useGlobal } from "../GlobalState/GlobalState";
import { updatePart } from "../../utils/parts";

const EditPartModal = ({ token, setParts, selectedPart }) => {
  const { modalOpen, setModalOpen } = useGlobal();
  if (modalOpen !== "editPart") return;

  function editPart(values) {
    console.log(values);
    return updatePart({
      token,
      id: selectedPart._id,
      partNumber: values.partNumber,
      name: values.name,
      cost: values.cost,
    })
      .then((res) => {
        setParts((prev) =>
          prev.map((part) => (part._id === res._id ? res : part)),
        );
        setModalOpen(false);
        return { success: true };
      })
      .catch((err) => {
        console.error(err);
        return {
          success: false,
          message: err?.message || err?.response?.data?.message || "Failed to ",
        };
      });
  }

  return (
    <Modal title={"Edit Part"}>
      <Form
        onSuccessfulSubmit={editPart}
        initialValues={{
          partNumber: selectedPart.partNumber,
          name: selectedPart.name,
          cost: selectedPart.cost,
        }}
        inputs={[
          {
            name: "name",
            type: "text",
            placeholder: "Name",
            labelText: "Name *",
            required: true,
          },
          {
            name: "cost",
            type: "number",
            placeholder: "Cost",
            labelText: "Cost *",
            required: true,
          },
          {
            name: "partNumber",
            type: "number",
            placeholder: "Part Number",
            labelText: "Part Number",
          },
        ]}
      />
    </Modal>
  );
};
export default EditPartModal;
