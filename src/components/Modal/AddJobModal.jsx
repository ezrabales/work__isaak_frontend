import Modal from "./Modal";
import Form from "../Form/Form";
import { useGlobal } from "../GlobalState/GlobalState";
import { createJob } from "../../utils/jobs";

const AddJobModal = () => {
  const token = localStorage.getItem("jwt");
  const { modalOpen, setModalOpen } = useGlobal();

  function addJob(values) {
    createJob({ location: values.location, notes: values.notes, token })
      .then(() => setModalOpen(false))
      .catch((err) => console.error(err));
  }

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
        onSuccessfulSubmit={addJob}
      />
    </Modal>
  );
};
export default AddJobModal;
