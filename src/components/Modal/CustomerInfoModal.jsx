import Modal from "./Modal";
import Form from "../Form/Form";
import { useGlobal } from "../GlobalState/GlobalState";
import { updateJob } from "../../utils/jobs";

const CustomerInfoModal = ({ setJobs, token, selectedJob, setSelectedJob }) => {
  const { modalOpen, setModalOpen } = useGlobal();

  function updateCustomer(values) {
    return updateJob({
      token,
      jobId: selectedJob._id,
      location: values.location,
      name: values.name,
      notes: values.notes,
      email: values.email,
      phone: values.phone,
      description: values.description,
      paymentTerms: values.paymentTerms,
      dateDue: values.dateDue,

      paymentStatus: selectedJob.status,
      amountOwed: selectedJob.amountOwed || 0,
      amountPaid: selectedJob.amountPaid || 0,
      dateStarted: selectedJob.dateStarted,
      dateEnded: selectedJob.dateEnded || "",
    })
      .then((res) => {
        setModalOpen("confirm");
        setJobs((prev) =>
          prev.map((job) =>
            job.invoiceNumber === res.invoiceNumber ? res : job,
          ),
        );
        setSelectedJob(res);
        return { success: true };
      })
      .catch((err) => {
        console.error(err);
        return {
          success: false,
          message:
            err?.message ||
            err?.response?.data?.message ||
            "Failed to update job",
        };
      });
  }

  if (modalOpen !== "customer") return;
  return (
    <Modal
      title={"Customer Information"}
      backTo={() => {
        setModalOpen("invoice");
      }}
    >
      <Form
        initialValues={{
          location: selectedJob.location,
          name: selectedJob.name,
          notes: selectedJob.notes,
          email: selectedJob.email,
          phone: selectedJob.phone,
          description: selectedJob.description,
          paymentTerms: selectedJob.paymentTerms,
          dateDue: selectedJob.dateDue
            ? new Date(selectedJob.dateDue).toISOString().split("T")[0]
            : "",
        }}
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
            labelText: "Email *",
            required: true,
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
          {
            name: "paymentTerms",
            type: "text",
            placeholder: "Payment Terms",
            labelText: "Payment Terms *",
            required: true,
          },
          {
            name: "dateDue",
            type: "date",
            placeholder: "Date Due",
            labelText: "Date Due *",
            required: true,
          },
        ]}
        onSuccessfulSubmit={updateCustomer}
      />
    </Modal>
  );
};
export default CustomerInfoModal;
