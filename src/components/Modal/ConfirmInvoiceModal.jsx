import { useEffect, useRef, useState } from "react";
import "./ConfirmInvoiceModal.css";
import { useGlobal } from "../GlobalState/GlobalState";
import Modal from "./Modal";
import Table from "../Table/Table";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { sendInvoice } from "../../utils/invoice";
import { checkToken } from "../../utils/auth";

// change from invoice pdf preview to just show inputs (not changeable here)

const ConfirmInvoiceModal = ({ invoiceNum, selectedJob, token, setJobs }) => {
  const pdfRef = useRef();
  const { modalOpen, setModalOpen } = useGlobal();
  const [invoice, setInvoice] = useState({});
  const [total, setTotal] = useState("");
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});

  useEffect(() => {
    checkToken(token)
      .then((res) => {
        setUser(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    setInvoice(JSON.parse(localStorage.getItem(invoiceNum) || "{}"));
  }, [modalOpen == "confirm"]);

  useEffect(() => {
    if (invoice) {
      let calcTotal = 0;
      invoice.additions?.map((addition) => (calcTotal += addition.cost));
      invoice.parts?.map(
        (part) =>
          (calcTotal += part.cost * (part.quantity || 1) + (part.extra || 0)),
      );
      calcTotal += invoice.service?.totalForHours;
      setTotal(calcTotal);
    }
  }, [invoice]);

  const formatDate = (date) => {
    const [year, month, day] = date.split("T")[0].split("-");

    return `${Number(month)}/${Number(day)}/${year}`;
  };

  const formatMoney = (amount, places = 2) => {
    if (amount) {
      return Number(amount).toFixed(places);
    }
    return;
  };

  const formatPhone = (p = "") =>
    p.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");

  function handleSendInvoice() {
    setIsLoading(true);
    return sendInvoice(
      { token, jobId: selectedJob._id },
      {
        invoiceNumber: selectedJob.invoiceNumber,
        customerName: selectedJob.name,
        customerEmail: selectedJob.email,
        customerPhone: selectedJob.phone,
        date: new Date(),
        craftsmanName: user.name,
        craftsmanEmail: user.email,
        craftsmanPhone: user.phone,
        jobDescription: selectedJob.description,
        jobLocation: selectedJob.location,
        paymentTerms: selectedJob.paymentTerms,
        dateDue: selectedJob.dateDue,
        parts: invoice.parts,
        service: invoice.service,
        additions: invoice.additions,
        grandTotal: total || 0,
        footer: {
          companyName: user.footer?.companyName,
          address: user.footer?.address,
          phone: formatPhone(user.phone),
          payableNote: user.footer?.payableNote,
          thankYou: user.footer?.thankYou || "Thank you for your business!",
        },
      },
    )
      .then((res) => {
        setJobs((prev) =>
          prev.map((job) =>
            job.invoiceNumber === res.job.invoiceNumber ? res.job : job,
          ),
        );
        localStorage.removeItem(res.job.invoiceNumber);
        setModalOpen(false);
      })

      .catch((err) => {
        setError(err);
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }

  if (modalOpen !== "confirm") return null;
  return (
    <Modal
      title={"Confirm Invoice"}
      backTo={() => {
        setModalOpen("customer");
      }}
    >
      <div className="confirm__container">
        <div className="confirm" ref={pdfRef}>
          <Table
            body={
              [
                { key: "Customer Name", value: selectedJob.name },
                { key: "Customer Email", value: selectedJob.email },
                {
                  key: "Customer Phone",
                  value: formatPhone(selectedJob.phone),
                },
                { key: "Invoice Number", value: invoiceNum },
                { key: "Date", value: new Date().toLocaleDateString() },
                { key: "Craftsman Name", value: user.name },
                { key: "Craftsman Email", value: user.email },
                { key: "Craftsman Phone", value: formatPhone(user.phone) },
                { key: "Job", value: selectedJob.description },
                { key: "Job Location", value: selectedJob.location },
                { key: "Payment Terms", value: selectedJob.paymentTerms },
                { key: "Due Date", value: formatDate(selectedJob.dateDue) },
              ].map((pair) => [pair.key, pair.value]) || []
            }
          />

          <div className="confirm__invoice-info">
            {invoice?.parts?.length > 0 && (
              <>
                <h3 className="confirm__info-title">Parts</h3>
                <Table
                  head={["NAME", "QUANTITY", "UNIT PRICE", "LINE TOTAL"]}
                  body={
                    invoice.parts?.map((part) => [
                      part.name,
                      part.quantity || 1,
                      `$${formatMoney(((part.quantity || 1) * part.cost + (part.extra || 0)) / (part.quantity || 1), 3)}`,
                      `$${formatMoney((part.quantity || 1) * part.cost + (part.extra || 0))}`,
                    ]) || []
                  }
                />
              </>
            )}
            {invoice?.service?.hours && (
              <>
                <h3 className="confirm__info-title">Service</h3>
                <Table
                  head={["LABOR", "UNIT PRICE", "LINE TOTAL"]}
                  body={[
                    [
                      `${invoice.service?.hours} hours`,
                      `$${formatMoney(invoice.service?.hrRate || 0, 3)} /hr`,
                      `${formatMoney(invoice.service?.totalForHours)}`,
                    ],
                  ]}
                />
              </>
            )}
            {invoice?.additions?.length > 0 && (
              <>
                <h3 className="confirm__info-title">
                  Additional Charges and Discounts
                </h3>
                <Table
                  head={["ADDITION", "UNIT PRICE", "LINE TOTAL"]}
                  body={
                    invoice.additions?.map((addition) => [
                      addition.reason,
                      `$${formatMoney(addition.cost)}`,
                      `$${formatMoney(addition.cost)}`,
                    ]) || []
                  }
                />
              </>
            )}
          </div>
          <div className="confirm__invoice-total-container">
            <p>GRAND TOTAL: </p>
            <div>${formatMoney(total)}</div>
          </div>
        </div>
        {isLoading ? <div>Loading...</div> : ""}
        {error ? <div className="confirm__error">{error.message}</div> : ""}
        <div className="confirm__btn-container">
          <button className="confirm__confirm-btn" onClick={handleSendInvoice}>
            Invoice
          </button>
          <button
            className="confirm__cancel-btn"
            onClick={() => setModalOpen("invoice")}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default ConfirmInvoiceModal;
