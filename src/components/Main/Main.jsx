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
import ConfirmInvoiceModal from "../Modal/ConfirmInvoiceModal";
import CustomerInfoModal from "../Modal/CustomerInfoModal";
import { getInvoice } from "../../utils/invoice";

const Main = () => {
  const { modalOpen, setModalOpen } = useGlobal();
  const { parts, setParts } = useGlobal();
  const [invoiceNum, setInvoiceNum] = useState();
  const [photos, setPhotos] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState();
  const [body, setBody] = useState([]);
  const token = localStorage.getItem("jwt");

  const formatMoney = (amount, places = 2) => {
    if (amount) {
      return Number(amount).toFixed(places);
    }
    return;
  };

  function handleViewInvoice(e) {
    return getInvoice({
      token,
      invoiceNumber: e.target.id,
    })
      .then((res) => {
        const base64 = res.pdf;

        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], {
          type: "application/pdf",
        });

        const url = URL.createObjectURL(blob);

        // Open in new tab
        const newTab = window.open();

        newTab.document.write(`
  <html>
    <head>
      <title>Invoice #${e.target.id} copy</title>
    </head>
    <body style="margin:0">
      <iframe
        src="${url}"
        width="100%"
        height="100%"
        style="border:none;"
      ></iframe>
    </body>
  </html>
`);

        // Cleanup
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      })
      .catch(console.error);
  }

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
        ?.filter((job) => job.paymentStatus !== "Paid in Full")
        .map((job) => {
          return [
            job.invoiceNumber,
            job.location,
            job.name,
            job.notes,
            job.email,
            job.phone,
            job.description,
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
            job.paymentStatus == "Awaiting Payment" ||
            job.paymentStatus == "Partially Paid" ? (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  Invoiced: ${formatMoney(job.amountOwed) || 0}
                </div>
                <button
                  id={job.invoiceNumber}
                  className="table__btn"
                  style={{ width: "fit-content" }}
                  onClick={handleViewInvoice}
                >
                  view invoice
                </button>
              </div>
            ) : (
              <button
                className="table__btn"
                onClick={(e) => {
                  setInvoiceNum(job.invoiceNumber);
                  setSelectedJob(job);
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
      {jobs?.length <= 0 ? (
        <div>No Jobs</div>
      ) : (
        <Table
          head={[
            "Invoice Number",
            "Location",
            "Name",
            "Notes",
            "Email",
            "Phone",
            "Job Description",
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
      <ConfirmInvoiceModal
        invoiceNum={invoiceNum}
        selectedJob={selectedJob}
        token={token}
        setJobs={setJobs}
      />
      <CustomerInfoModal
        setJobs={setJobs}
        token={token}
        selectedJob={selectedJob}
        setSelectedJob={setSelectedJob}
      />
    </div>
  );
};
export default Main;
