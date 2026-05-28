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

const Main = () => {
  const { modalOpen, setModalOpen } = useGlobal();
  const { parts, setParts } = useGlobal();
  const [invoiceNum, setInvoiceNum] = useState();
  const [photos, setPhotos] = useState([]);
  const [jobs, setJobs] = useState([]);
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
    </div>
  );
};
export default Main;
