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
import DeleteJobModal from "../Modal/DeleteJobModal";
import { getJobs } from "../../utils/jobs";
import CustomerInfoModal from "../Modal/CustomerInfoModal";
import ConfirmInvoiceModal from "../Modal/ConfirmInvoiceModal";
import { getInvoice } from "../../utils/invoice";

const History = () => {
  const { parts, setParts } = useGlobal();
  const { modalOpen, setModalOpen } = useGlobal();
  const { setSubmitTo } = useGlobal();
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

  const formatDate = (date) => {
    const [year, month, day] = date.split("T")[0].split("-");

    return `${Number(month)}/${Number(day)}/${year}`;
  };

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
      jobs.map((job, i) => {
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
              setSubmitTo("pictures");
            }}
          >
            Pictures
          </button>,
          setStatus(job.paymentStatus),
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
          ) : job.paymentStatus == "Paid in Full" ? (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                Paid: ${formatMoney(job.amountPaid) || 0}
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
          formatDate(job.dateStarted),
          job.dateEnded ? formatDate(job.dateEnded) : "",
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
        <div className="no-data">No Jobs</div>
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
            "Date Started",
            "Date Ended",
            "Total Time",
            "Edit",
          ]}
          body={body}
        />
      )}
      <CreateNewPartModal token={token} setParts={setParts} />
      <AdditionalChargesDiscountsModal invoiceNum={invoiceNum} />
      <AddPartModal token={token} invoiceNum={invoiceNum} />
      <InvoiceModal invoiceNum={invoiceNum} token={token} />
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
        setInvoiceNum={setInvoiceNum}
      />
      <EditPicturesModal invoiceNum={invoiceNum} token={token} />
      <DeleteJobModal
        selectedJob={selectedJob}
        token={token}
        setBody={setBody}
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
export default History;
