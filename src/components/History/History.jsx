import "./History.css";
import Table from "../Table/Table";
import { useGlobal } from "../GlobalState/GlobalState";
import AddJobModal from "../Modal/AddJobModal";
import CreateNewPartModal from "../Modal/CreateNewPartModal";
import InvoiceModal from "../Modal/InvoiceModal";
import { useEffect, useState } from "react";
import AddPartModal from "../Modal/AddPartModal";
import AdditionalChargesDiscountsModal from "../Modal/AdditionalChargesDiscountsModal";
import PictureModal from "../Modal/PictureModal";
import AddPictureModal from "../Modal/AddPictureModal";
import EditJobModal from "../Modal/EditJobModal";
import EditPicturesModal from "../Modal/EditPicturesModal";
import { getJobs } from "../../utils/jobs";

const History = () => {
  const { modalOpen, setModalOpen } = useGlobal();
  const [invoiceNum, setInvoiceNum] = useState();
  const [photos, setPhotos] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState();
  const [body, setBody] = useState([]);
  const token = localStorage.getItem("jwt");

  useEffect(() => {
    getJobs({ token })
      .then((data) => {
        setJobs(data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [modalOpen == false]);

  function setStatus(status) {
    if (status === "Not Charged") {
      return (
        <div style={{ display: "flex" }}>
          <span className="red-dot" />
          Not charged
        </div>
      );
    }
    if (status === "Awaiting Payment") {
      return (
        <div style={{ display: "flex" }}>
          <span className="orange-dot" />
          Awaiting Payment
        </div>
      );
    }
    if (status === "Partially Paid") {
      return (
        <div style={{ display: "flex" }}>
          <span className="blue-dot" />
          Partially Paid
        </div>
      );
    }
    if (status === "Paid in Full") {
      return (
        <div style={{ display: "flex" }}>
          <span className="green-dot" />
          Paid in Full
        </div>
      );
    }
  }

  useEffect(() => {
    setBody(
      jobs.map((job) => {
        return [
          job.invoiceNumber,
          job.location,
          job.notes,
          <button
            className="table__btn"
            onClick={(e) => {
              setInvoiceNum(job.invoiceNumber);
              setModalOpen("pictures");
            }}
          >
            Pictures
          </button>,
          setStatus(job.paymentStatus),
          job.invoiceInfo ? (
            job.invoiceInfo
          ) : (
            <button
              className="table__btn"
              onClick={(e) => {
                setInvoiceNum(job.invoiceNumber);
                setModalOpen("invoice");
              }}
            >
              Invoice
            </button>
          ),
          new Date(job.dateStarted).toLocaleDateString(),
          job.dateEnded ? new Date(job.dateEnded).toLocaleDateString() : "",
          job.dateEnded
            ? (() => {
                const diff =
                  new Date(job.dateEnded) - new Date(job.dateStarted);

                const days = diff / (1000 * 60 * 60 * 24);

                return `${days.toFixed(1)} days`;
              })()
            : "",
          <button
            className="table__btn"
            onClick={() => {
              setSelectedJob(job);
              setModalOpen("editJob");
            }}
          >
            Edit
          </button>,
        ];
      }),
    );
  }, [jobs]);

  return (
    <div className="main">
      {body.length <= 0 ? (
        <div>No Jobs</div>
      ) : (
        <Table
          head={[
            "Invoice Number",
            "Location",
            "Notes",
            "Pictures",
            "Payment Status",
            "Invoice",
            "Date Started",
            "Date Ended",
            "Total Time",
            "Edit",
          ]}
          body={body}
        />
      )}
      <CreateNewPartModal token={token} setParts={setParts} />
      <AdditionalChargesDiscountsModal />
      <AddPartModal />
      <InvoiceModal invoiceNum={invoiceNum} />
      <PictureModal invoiceNum={invoiceNum} token={token} />
      <AddPictureModal
        setPhotos={setPhotos}
        invoiceNum={invoiceNum}
        token={token}
      />
      <EditJobModal
        selectedJob={selectedJob}
        token={token}
        setBody={setBody}
        setStatus={setStatus}
      />
      <EditPicturesModal photos={photos} />
    </div>
  );
};
export default History;
