import Modal from "./Modal";
import Form from "../Form/Form";
import { useGlobal } from "../GlobalState/GlobalState";
import { updateJobStatus } from "../../utils/jobs";

const SetStatusModal = ({ selectedJob, setJobs, token }) => {
  const { modalOpen, setModalOpen } = useGlobal();
  if (modalOpen !== "setStatus") return;

  function editJob(values) {
    return updateJobStatus({
      token,
      jobId: selectedJob._id,
      paymentStatus: values.status,
      amountPaid: values.amountPaid || selectedJob.amountPaid,
      amountOwed: values.amountOwed || selectedJob.amountOwed,
    })
      .then((res) => {
        setJobs((prev) =>
          prev.map((job) =>
            job.invoiceNumber === res.invoiceNumber
              ? {
                  ...job,
                  paymentStatus: res.paymentStatus,
                  amountPaid: res.amountPaid,
                  amountOwed: res.amountOwed,
                }
              : job,
          ),
        );

        setModalOpen(false);
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

  return (
    <Modal title={"Set Status"}>
      <p className="invoice-num">
        Invoice Number:
        <span className="invoice-num-num"> {selectedJob.invoiceNumber}</span>
      </p>
      {selectedJob.paymentStatus !== "Not Charged" && (
        <>
          <p className="invoice-num">
            Amount Paid:
            <span className="invoice-num-num"> ${selectedJob.amountPaid}</span>
          </p>
          <p className="invoice-num">
            Amount Owed:
            <span className="invoice-num-num"> ${selectedJob.amountOwed}</span>
          </p>
        </>
      )}
      <Form
        onSuccessfulSubmit={editJob}
        initialValues={{
          status: selectedJob.paymentStatus,
          amountOwed: selectedJob.amountOwed ? selectedJob.amountOwed : "",
          amountPaid: selectedJob.amountPaid ? selectedJob.amountPaid : "",
        }}
        inputs={[
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
        ]}
      />
    </Modal>
  );
};
export default SetStatusModal;
