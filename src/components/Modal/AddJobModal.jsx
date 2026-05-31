import Modal from "./Modal";
import Form from "../Form/Form";
import { useGlobal } from "../GlobalState/GlobalState";
import { createJob } from "../../utils/jobs";

const AddJobModal = ({ setJobs, token }) => {
  const { modalOpen, setModalOpen } = useGlobal();

  function addJob(values) {
    return createJob({
      location: values.location,
      name: values.name,
      notes: values.notes,
      email: values.email,
      phone: values.phone,
      description: values.description,
      token,
    })
      .then((res) => {
        setModalOpen(false);
        setJobs((prev) => [...prev, res]);
        return { success: true };
      })
      .catch((err) => {
        console.error(err);
        return {
          success: false,
          message:
            err?.message || err?.response?.data?.message || "Failed to add Job",
        };
      });
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
          {
            name: "email",
            type: "email",
            placeholder: "Email",
            labelText: "Email",
          },
          {
            name: "phone",
            type: "tel",
            placeholder: "Phone Number",
            labelText: "Phone Number",
          },
          {
            name: "description",
            type: "text",
            placeholder: "Description",
            labelText: "Description",
          },
        ]}
        onSuccessfulSubmit={addJob}
      />
    </Modal>
  );
};
export default AddJobModal;
