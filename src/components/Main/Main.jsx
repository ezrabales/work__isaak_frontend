import "./Main.css";
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
import { getJobs } from "../../utils/jobs";
import SetStatusModal from "../Modal/SetStatusModal";

const Main = () => {
  const { modalOpen, setModalOpen } = useGlobal();
  const { parts, setParts } = useGlobal();
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
  }, []);

  function setStatus(job) {
    if (job.paymentStatus === "Not Charged") {
      return (
        <div style={{ display: "flex" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="red-dot" />
            Not Charged
          </div>
          <div
            className="table__btn_status-btn"
            onClick={() => {
              setSelectedJob(job);
              setModalOpen("setStatus");
            }}
          >
            Set Status
          </div>
        </div>
      );
    }

    if (job.paymentStatus === "Awaiting Payment") {
      return (
        <div style={{ display: "flex" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="orange-dot" />
            Awaiting Payment
          </div>
          <div
            className="table__btn_status-btn"
            onClick={() => {
              setSelectedJob(job);
              setModalOpen("setStatus");
            }}
          >
            Set Status
          </div>
        </div>
      );
    }

    if (job.paymentStatus === "Partially Paid") {
      return (
        <div style={{ display: "flex" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="blue-dot" />
            Partially Paid
          </div>
          <div
            className="table__btn_status-btn"
            onClick={() => {
              setSelectedJob(job);
              setModalOpen("setStatus");
            }}
          >
            Set Status
          </div>
        </div>
      );
    }

    if (job.paymentStatus === "Paid in Full") {
      return (
        <div style={{ display: "flex" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="green-dot" />
            Paid in Full
          </div>
          <div
            className="table__btn_status-btn"
            onClick={() => {
              setSelectedJob(job);
              setModalOpen("setStatus");
            }}
          >
            Set Status
          </div>
        </div>
      );
    }
  }

  useEffect(() => {
    setBody(
      jobs
        .filter((job) => job.paymentStatus !== "Paid in Full")
        .map((job) => {
          return [
            job.invoiceNumber,
            job.location,
            job.notes,
            job.email,
            <button
              className="table__btn"
              onClick={(e) => {
                setInvoiceNum(job.invoiceNumber);
                setModalOpen("pictures");
              }}
            >
              Pictures
            </button>,
            setStatus(job),
            job.amountOwed ? (
              `Invoiced: $${job.amountOwed}`
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
          ];
        }),
    );
  }, [jobs]);

  return (
    <div className="main">
      {jobs.length <= 0 ? (
        <div>No Jobs</div>
      ) : (
        <Table
          head={[
            "Invoice Number",
            "Location",
            "Notes",
            "Email",
            "Pictures",
            "Payment Status",
            "Invoice",
          ]}
          body={body}
        />
      )}

      <button className="main__job-btn" onClick={() => setModalOpen("job")}>
        Add Job
      </button>
      <AddJobModal setJobs={setJobs} token={token} />
      <CreateNewPartModal token={token} setParts={setParts} back={"part"} />
      <AdditionalChargesDiscountsModal invoiceNum={invoiceNum} />
      <AddPartModal token={token} invoiceNum={invoiceNum} />
      <InvoiceModal invoiceNum={invoiceNum} token={token} />
      <PictureModal invoiceNum={invoiceNum} token={token} />
      <AddPictureModal
        setPhotos={setPhotos}
        invoiceNum={invoiceNum}
        token={token}
      />
      <SetStatusModal
        selectedJob={selectedJob}
        setJobs={setJobs}
        token={token}
      />
    </div>
  );
};
export default Main;
