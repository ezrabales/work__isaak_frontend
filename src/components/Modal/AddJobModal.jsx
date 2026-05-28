import Modal from "./Modal";
import Form from "../Form/Form";
import { useGlobal } from "../GlobalState/GlobalState";
import { createJob } from "../../utils/jobs";

const AddJobModal = ({ setJobs, token }) => {
  const { modalOpen, setModalOpen } = useGlobal();

  function addJob(values) {
    createJob({
      location: values.location,
      notes: values.notes,
      email: values.email,
      token,
    })
      .then((res) => {
        setModalOpen(false);
        setJobs((prev) => [...prev, res]);
      })
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
          {
            name: "email",
            type: "email",
            placeholder: "Email",
            labelText: "Email",
          },
        ]}
        onSuccessfulSubmit={addJob}
      />
    </Modal>
  );
};
export default AddJobModal;
