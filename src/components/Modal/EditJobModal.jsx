import Modal from "./Modal";
import Form from "../Form/Form";
import { useGlobal } from "../GlobalState/GlobalState";
import { updateJob } from "../../utils/jobs";

const EditJobModal = ({ selectedJob, token, setBody, setStatus }) => {
  const { modalOpen, setModalOpen } = useGlobal();
  if (modalOpen !== "editJob") return;

  function editJob(values) {
    updateJob({
      token,
      jobId: selectedJob._id,
      location: values.location,
      notes: values.notes,
      email: values.email,
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
                  new Date(res.dateStarted).toLocaleDateString(),
                  res.dateEnded
                    ? new Date(res.dateEnded).toLocaleDateString()
                    : "",
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
      })
      .catch((err) => {
        console.error(err);
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
          notes: selectedJob.notes,
          email: selectedJob.email,
          status: selectedJob.paymentStatus,
          dateStarted: selectedJob.dateStarted
            ? new Date(selectedJob.dateStarted).toISOString().split("T")[0]
            : "",
          dateEnded: selectedJob.dateEnded
            ? new Date(selectedJob.dateEnded).toISOString().split("T")[0]
            : "",
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
          <button
            className="edit__btn"
            onClick={() => setModalOpen("editPictures")}
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
