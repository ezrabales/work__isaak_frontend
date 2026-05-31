import Modal from "./Modal";
import Form from "../Form/Form";
import { useGlobal } from "../GlobalState/GlobalState";
import { updateJob } from "../../utils/jobs";

const EditJobModal = ({
  selectedJob,
  token,
  setBody,
  setStatus,
  setInvoiceNum,
}) => {
  const { modalOpen, setModalOpen } = useGlobal();
  const { setSubmitTo } = useGlobal();
  if (modalOpen !== "editJob") return;

  function editJob(values) {
    updateJob({
      token,
      jobId: selectedJob._id,
      location: values.location,
      name: values.name,
      notes: values.notes,
      email: values.email,
      phone: values.phone,
      description: values.description,
      paymentStatus: values.status,
      amountOwed: values.amountOwed || selectedJob.amountOwed || "",
      amountPaid: values.amountPaid || selectedJob.amountPaid || "",
      dateStarted: values.dateStarted,
      dateEnded: values.dateEnded,
    })
      .then((res) => {
        setBody((prev) =>
          prev.map((row) =>
            row[0] === res.invoiceNumber
              ? [
                  res.invoiceNumber,
                  res.location,
                  res.notes,
                  res.email,
                  row[4],
                  setStatus(res.paymentStatus),
                  row[6],
                  res.dateStarted,
                  res.dateEnded,
                  res.dateEnded
                    ? (() => {
                        const diff =
                          new Date(res.dateEnded) - new Date(res.dateStarted);

                        const days = diff / (1000 * 60 * 60 * 24);

                        return `${days.toFixed(1)} days`;
                      })()
                    : "",
                  row[10],
                ]
              : row,
          ),
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
    <Modal title={"Edit Job"}>
      <p className="invoice-num">
        Invoice Number:
        <span className="invoice-num-num">{selectedJob.invoiceNumber}</span>
      </p>
      <Form
        onSuccessfulSubmit={editJob}
        initialValues={{
          location: selectedJob.location,
          name: selectedJob.name,
          notes: selectedJob.notes,
          email: selectedJob.email,
          phone: selectedJob.phone,
          description: selectedJob.description,
          status: selectedJob.paymentStatus,
          dateStarted: selectedJob.dateStarted,
          dateEnded: selectedJob.dateEnded,
          amountOwed: selectedJob.amountOwed ? selectedJob.amountOwed : "",
          amountPaid: selectedJob.amountPaid ? selectedJob.amountPaid : "",
        }}
        inputs={[
          {
            name: "location",
            type: "address",
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
          <button
            className="edit__btn"
            type="button"
            onClick={() => {
              setInvoiceNum(selectedJob.invoiceNumber);
              setSubmitTo("editPictures");
              setModalOpen("editPictures");
            }}
          >
            Edit Pictures
          </button>,
          {
            name: "status",
            type: "radio",
            labelText: "Payment Status *",
            required: true,
            options: [
              { value: "Not Charged", label: "Not Charged" },
              { value: "Awaiting Payment", label: "Awaiting Payment" },
              { value: "Partially Paid", label: "Partially Paid" },
              { value: "Paid in Full", label: "Paid in Full" },
            ],
          },
          {
            name: "dateStarted",
            type: "date",
            labelText: "Date Started *",
            required: true,
          },
          {
            name: "dateEnded",
            type: "date",
            labelText: "Date Ended",
          },
          <button
            className="edit__btn_delete"
            type="button"
            id={selectedJob._id}
            onClick={() => setModalOpen("deleteJob")}
          >
            Delete
          </button>,
        ]}
      />
    </Modal>
  );
};
export default EditJobModal;
