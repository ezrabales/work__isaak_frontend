import Modal from "./Modal";
import Form from "../Form/Form";
import { useGlobal } from "../GlobalState/GlobalState";

const AddJobModal = ({ onSuccessfulSubmit }) => {
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
            required: true,
          },
          {
            name: "notes",
            type: "text",
            placeholder: "Notes",
            labelText: "Notes",
          },
        ]}
        onSuccessfulSubmit={onSuccessfulSubmit}
      />
    </Modal>
  );
};
export default AddJobModal;
