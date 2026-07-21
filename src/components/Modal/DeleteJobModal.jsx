import "./DeleteJobModal.css";
import Modal from "./Modal";
import { useGlobal } from "../GlobalState/GlobalState";
import { deleteJob } from "../../utils/jobs";
import { useState } from "react";

const DeleteJobModal = ({ selectedJob, token, setBody }) => {
  const { modalOpen, setModalOpen } = useGlobal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});
  if (modalOpen !== "deleteJob") return;

  function handleDeleteJob(e) {
    setIsLoading(true);
    deleteJob({
      token,
      jobId: selectedJob._id,
      invoiceNumber: selectedJob.invoiceNumber,
    })
      .then((res) => {
        localStorage.removeItem(selectedJob.invoiceNumber);
        setBody((prev) => prev.filter((job) => job._id !== res.id));
        setModalOpen(false);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
        setIsLoading(false);
      });
  }

  return (
    <Modal title={"Delete Job"}>
      <>
        <h3 className="delete__title">
          Are you sure you want to delete this job?
        </h3>
        <h3 className="delete__warning">THIS ACTION CANNOT BE UNDONE</h3>
        <div className="delete__container">
          <p className="delete__key">Invoice Number: </p>
          <div className="delete__value">{selectedJob.invoiceNumber}</div>
          <p className="delete__key">Location: </p>
          <div className="delete__value">{selectedJob.location}</div>
          <p className="delete__key">Notes: </p>
          <div className="delete__value">{selectedJob.notes}</div>
          <p className="delete__key">Email: </p>
          <div className="delete__value">{selectedJob.email}</div>
          <p className="delete__key">Payment Status: </p>
          <div className="delete__value">{selectedJob.paymentStatus}</div>
          <p className="delete__key">Amount Owed: </p>
          <div className="delete__value">${selectedJob.amountOwed}</div>
          <p className="delete__key">Amount Paid: </p>
          <div className="delete__value">${selectedJob.amountPaid}</div>
          <p className="delete__key">Date Started: </p>
          <div className="delete__value">{selectedJob.dateStarted}</div>
          <p className="delete__key">Date Ended: </p>
          <div className="delete__value">{selectedJob.dateEnded}</div>
        </div>
        <div className="delete__btn-container">
          <button className="delete__confirm-btn" onClick={handleDeleteJob}>
            Delete
          </button>
          <button
            className="delete__cancel-btn"
            onClick={() => setModalOpen("editJob")}
          >
            Cancel
          </button>
        </div>
        {isLoading ? <div>loading...</div> : ""}
        {error ? <div className="delete__error">{error}</div> : ""}
      </>
    </Modal>
  );
};
export default DeleteJobModal;
