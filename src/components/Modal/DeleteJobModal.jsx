import "./DeleteJobModal.css";
import Modal from "./Modal";
import { useGlobal } from "../GlobalState/GlobalState";
import { deleteJob } from "../../utils/jobs";

const DeleteJobModal = ({ selectedJob, token, setBody }) => {
  const { modalOpen, setModalOpen } = useGlobal();
  if (modalOpen !== "deleteJob") return;

  function handleDeleteJob(e) {
    deleteJob({ token, jobId: selectedJob._id })
      .then((res) => {
        setBody((prev) => prev.filter((job) => job._id !== res.id));
        setModalOpen(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <Modal title={"Delete Job"}>
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
        <div className="delete__value">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
          libero et accusamus fuga, unde saepe autem, necessitatibus deleniti
          officia possimus, temporibus vero quam? Expedita facilis asperiores
          saepe aut sequi nobis?
        </div>
        <p className="delete__key">Payment Status: </p>
        <div className="delete__value">{selectedJob.paymentStatus}</div>
        <p className="delete__key">Invoice Information: </p>
        <div className="delete__value">{selectedJob.invoiceInfo}</div>
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
    </Modal>
  );
};
export default DeleteJobModal;
