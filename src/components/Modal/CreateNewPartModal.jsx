import Modal from "./Modal";
import Form from "../Form/Form";
import { useGlobal } from "../GlobalState/GlobalState";

const CreateNewPartModal = () => {
  const { modalOpen, setModalOpen } = useGlobal();
  if (modalOpen !== "createPart") return;
  return (
    <Modal title={"Add New Part"}>
      <Form
        inputs={[
          {
            name: "name",
            type: "text",
            placeholder: "Name",
            labelText: "Name *",
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
export default CreateNewPartModal;
