import Modal from "./Modal";
import Form from "../Form/Form";
import { useGlobal } from "../GlobalState/GlobalState";

const AddPartModal = () => {
  const { modalOpen, setModalOpen } = useGlobal();
  if (modalOpen !== "part") return;
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
            type: "num",
            placeholder: "Cost",
            labelText: "Cost *",
            required: "true",
          },
        ]}
      />
    </Modal>
  );
};
export default AddPartModal;
