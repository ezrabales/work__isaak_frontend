import "./InvoiceModal.css";
import Modal from "./Modal";
import Form from "../Form/Form";
import { useGlobal } from "../GlobalState/GlobalState";
import { useEffect, useRef, useState } from "react";
import { useForm } from "../../hooks/useForm";

const InvoiceModal = ({ invoiceNum }) => {
  const [invoice, setInvoice] = useState(
    JSON.parse(localStorage.getItem("invoice_1.parts")) || [],
  );
  const [updatedInvoice, setUpdatedInvoice] = useState(invoice);

  const [additions, setAdditions] = useState(
    JSON.parse(localStorage.getItem("invoice_1.additions")) || [],
  );
  const [updatedAdditions, setUpdatedAdditions] = useState(additions);

  const [partsTabOpen, setPartsTabOpen] = useState(true);
  const [chargesTabOpen, setChargesTabOpen] = useState(true);
  const [totalDifference, setTotalDifference] = useState();
  const [totalForParts, setTotalForParts] = useState();
  const [totalForAdditions, setTotalForAdditions] = useState();
  const [localHrRate, setLocalHrRate] = useState(75);
  const { modalOpen, setModalOpen } = useGlobal();

  useEffect(() => {
    if (modalOpen === "invoice") {
      const freshInvoice =
        JSON.parse(localStorage.getItem("invoice_1.parts")) || [];

      setInvoice(freshInvoice);
      setUpdatedInvoice(freshInvoice);

      const freshAdditions =
        JSON.parse(localStorage.getItem("invoice_1.additions")) || [];

      setAdditions(freshAdditions);
      setUpdatedAdditions(freshAdditions);
    }
  }, [modalOpen]);

  const { values, handleChange, setValues } = useForm({
    hours: "",
    totalForHours: "",
    hrRate: localHrRate,
    total: "",
  });

  useEffect(() => {
    const totalForHours = values.hours * localHrRate;
    setValues((prev) => ({
      ...prev,
      totalForHours,
    }));
  }, [values.hours]);

  useEffect(() => {
    const totalForHours = values.hours * values.hrRate;
    setValues((prev) => ({
      ...prev,
      totalForHours,
    }));
  }, [values.hrRate]);

  useEffect(() => {
    if (!values.totalForHours || !values.hours) return;

    const hrRate = values.totalForHours / values.hours;
    setValues((prev) => ({
      ...prev,
      hrRate,
    }));
  }, [values.totalForHours]);

  useEffect(() => {
    const total = totalForAdditions + totalForParts + values.totalForHours;
    const totalDifference = values.total - total;
    setTotalDifference(totalDifference);
  }, [values.total]);

  useEffect(() => {
    const total = totalForAdditions + totalForParts + values.totalForHours;
    setValues((prev) => ({
      ...prev,
      total,
    }));
  }, [totalForAdditions, totalForParts, values.totalForHours]);

  useEffect(() => {
    let total = 0;
    updatedInvoice.map((part) => {
      total += part.quantity * part.cost + (part.extra || 0);
    });
    setTotalForParts(total);
    localStorage.setItem("invoice_1.parts", JSON.stringify(updatedInvoice));
  }, [updatedInvoice]);

  useEffect(() => {
    let total = 0;
    updatedAdditions.map((addition) => {
      total += addition.cost;
    });
    setTotalForAdditions(total);
  }, [updatedAdditions]);

  function plusMinusMoneyFormat(num) {
    return `${num > 0 ? "+" : "-"}$${Math.abs(num)}`;
  }

  if (modalOpen !== "invoice") return;
  return (
    <Modal title={"Invoice"}>
      <p className="invoice-num">
        Invoice Number: <span className="invoice-num-num">{invoiceNum}</span>
      </p>
      <div className="sections">
        {/* parts */}
        <div className="sections__section">
          <div className="sections__section-top">
            <div className="sections__section-part">
              <p>Parts:</p>
            </div>
            <div className="sections__section-part">
              <span>${totalForParts}</span>

              <span
                className={`navbar__menu-button-arrow ${
                  partsTabOpen ? "open" : ""
                }`}
                onClick={() => {
                  setPartsTabOpen((prev) => !prev);
                }}
              >
                <span className="arrow-span" />
                <span className="arrow-span" />
              </span>
            </div>
          </div>
          <div
            className={`sections__section-bottom ${partsTabOpen ? "open" : ""}`}
          >
            {updatedInvoice.map((part, index) => {
              return (
                <div className="sections__section-row">
                  <div className="sections__section-part">
                    <p>Part: </p>
                  </div>
                  <div className="sections__section-part">
                    <p>{part.name}</p>
                  </div>
                  <div className="sections__section-part">
                    <p>
                      {part.quantity} × ${part.cost}
                    </p>
                  </div>
                  <div className="sections__section-part">
                    {part.extra !== 0 && part.extra != null && (
                      <div className="sections__section-extra">
                        {plusMinusMoneyFormat(part.extra)}
                      </div>
                    )}
                    <span>
                      = $
                      <input
                        className="sections__section-input"
                        type="number"
                        value={part.cost * part.quantity + (part.extra || 0)}
                        onChange={(e) => {
                          const tempValue = Number(e.target.value);

                          setUpdatedInvoice((prev) =>
                            prev.map((p, i) =>
                              i === index
                                ? {
                                    ...p,
                                    extra: tempValue - p.cost * p.quantity,
                                  }
                                : p,
                            ),
                          );
                        }}
                      />
                    </span>
                    <button
                      className="checkout__trash-icon"
                      onClick={() => {
                        const tempInvoice = updatedInvoice.filter(
                          (_, i) => i !== index,
                        );

                        localStorage.setItem(
                          "invoice_1.parts",
                          JSON.stringify(tempInvoice),
                        );

                        setUpdatedInvoice(tempInvoice);
                      }}
                    >
                      <div className="trash">
                        <div className="trash__lid" />
                        <div className="trash__body" />
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
            <button
              className="sections__section-btn"
              onClick={() => setModalOpen("part")}
            >
              Add Part
            </button>
          </div>
        </div>
        {/* service */}
        <div className="sections__section">
          <div className="sections__section-solid">
            <div className="sections__section-part">
              <p>Service:</p>
            </div>
            <div className="sections__section-part">
              <p>Hours:</p>
              <input
                className="sections__section-input"
                type="number"
                name="hours"
                value={values.hours}
                onChange={handleChange}
              />
            </div>
            <div className="sections__section-part">
              <p>$/hr </p>
              <input
                className="sections__section-input"
                type="number"
                name="hrRate"
                value={values.hrRate}
                onChange={handleChange}
              />
            </div>
            <div className="sections__section-part">
              <p>$</p>
              <input
                className="sections__section-input"
                type="number"
                name="totalForHours"
                value={values.totalForHours}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        {/* Additional Charges/Discounts */}
        <div className="sections__section">
          <div className="sections__section-top">
            <div className="sections__section-part">
              <p>Additional Charges/Discounts:</p>
            </div>
            <div className="sections__section-part">
              <span>{plusMinusMoneyFormat(totalForAdditions)}</span>

              <span
                className={`navbar__menu-button-arrow ${
                  chargesTabOpen ? "open" : ""
                }`}
                onClick={() => {
                  setChargesTabOpen((prev) => !prev);
                }}
              >
                <span className="arrow-span" />
                <span className="arrow-span" />
              </span>
            </div>
          </div>

          <div
            className={`sections__section-bottom ${chargesTabOpen ? "open" : ""}`}
          >
            {updatedAdditions.map((addition, index) => {
              return (
                <div className="sections__section-row">
                  <div className="sections__section-part">
                    <p>description: </p>
                  </div>
                  <div className="sections__section-part">
                    <p>{addition.reason}</p>
                  </div>
                  <div></div>
                  <div className="sections__section-part">
                    <span>{plusMinusMoneyFormat(addition.cost)}</span>
                    <button
                      className="checkout__trash-icon"
                      onClick={() => {
                        const tempAdditions = updatedAdditions.filter(
                          (_, i) => i !== index,
                        );

                        localStorage.setItem(
                          "invoice_1.additions",
                          JSON.stringify(tempAdditions),
                        );

                        setUpdatedAdditions(tempAdditions);
                      }}
                    >
                      <div className="trash">
                        <div className="trash__lid" />
                        <div className="trash__body" />
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}

            <button
              className="sections__section-btn"
              onClick={() => setModalOpen("additional")}
            >
              Add Additional Charge/Discount
            </button>
          </div>
        </div>
        <div className="sections__section">
          <div className="sections__section-solid">
            <div className="sections__section-part">
              <p>Total:</p>
            </div>
            <div className="sections__section-part">
              {totalDifference !== 0 ? (
                <p className="sections__section-difference">
                  {plusMinusMoneyFormat(totalDifference)}
                </p>
              ) : (
                ""
              )}

              <p>$</p>
              <input
                className="sections__section-input"
                type="number"
                name="total"
                value={values.total}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <button
          className="sections__section-btn"
          disabled={totalDifference !== 0}
        >
          Invoice
        </button>
        {totalDifference != 0 && (
          <button className="sections__section-btn">
            {totalDifference > 0
              ? "Add Additional Charge"
              : "Add Additional Discount"}
          </button>
        )}
      </div>
    </Modal>
  );
};
export default InvoiceModal;
