import Modal from "./Modal";
import Form from "../Form/Form";
import { useGlobal } from "../GlobalState/GlobalState";

const AddJobModal = () => {
  const { modalOpen, setModalOpen } = useGlobal();
  if (modalOpen !== "job") return;
  return (
    <Modal title={"Add Job"}>
      <Form
        inputs={[
          {
            name: "location",
            type: "text",
            placeholder: "Location",
            labelText: "Location *",
            required: "true",
          },
          {
            name: "name",
            type: "text",
            placeholder: "Name",
            labelText: "Name",
          },
          {
            name: "notes",
            type: "text",
            placeholder: "Notes",
            labelText: "Notes",
          },
        ]}
      />
    </Modal>
  );
};
export default AddJobModal;
