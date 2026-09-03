import Modal from "./Modal";
import Form from "../Form/Form";
import { useGlobal } from "../GlobalState/GlobalState";
import { createPart } from "../../utils/parts";

const CreateNewPartModal = ({ token, setParts, back = false }) => {
  const { modalOpen, setModalOpen } = useGlobal();
  if (modalOpen !== "createPart") return;

  function createNewPart(e) {
    return createPart({
      token,
      name: e.name,
      cost: e.cost,
      partNumber: e.partNumber,
    })
      .then((res) => {
        setParts((prev) => [
          ...prev,
          {
            _id: res._id,
            name: res.name,
            cost: res.cost,
            partNumber: res.partNumber,
            quantity: 0,
          },
        ]);
        setModalOpen(back || "part");
        return { success: true };
      })
      .catch((err) => {
        console.error(err);
        return {
          success: false,
          message:
            err?.message ||
            err?.response?.data?.message ||
            "Failed to create new part",
        };
      });
  }

  return (
    <Modal
      title={"Create New Part"}
      backTo={() => {
        setModalOpen("part");
      }}
    >
      <Form
        onSuccessfulSubmit={createNewPart}
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
            type: "text",
            placeholder: "Part Number",
            labelText: "Part Number",
          },
        ]}
      />
    </Modal>
  );
};
export default CreateNewPartModal;
