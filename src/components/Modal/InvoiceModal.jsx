import "./InvoiceModal.css";
import Modal from "./Modal";
import { useGlobal } from "../GlobalState/GlobalState";
import { useEffect, useRef, useState } from "react";
import { useForm } from "../../hooks/useForm";
import { getRate } from "../../utils/auth";

const InvoiceModal = ({ invoiceNum, token }) => {
  const savedInvoice = JSON.parse(localStorage.getItem(invoiceNum)) || {};

  const [invoice, setInvoice] = useState(savedInvoice.parts || []);
  const [additions, setAdditions] = useState(savedInvoice.additions || []);
  const [totalExtra, setTotalExtra] = useState(savedInvoice.totalExtra || 0);
  const service = savedInvoice.service || {};

  const [updatedInvoice, setUpdatedInvoice] = useState(invoice);
  const [updatedAdditions, setUpdatedAdditions] = useState(additions);

  const [partsTabOpen, setPartsTabOpen] = useState(true);
  const [chargesTabOpen, setChargesTabOpen] = useState(true);

  const [totalForParts, setTotalForParts] = useState();
  const [totalForAdditions, setTotalForAdditions] = useState();
  const [localHrRate, setLocalHrRate] = useState(0);
  const { modalOpen, setModalOpen } = useGlobal();

  useEffect(() => {
    getRate({ token }).then((res) => {
      setLocalHrRate(res.rate);
    });
  }, []);

  function saveInvoice(updates) {
    const current = JSON.parse(localStorage.getItem(invoiceNum)) || {};

    localStorage.setItem(
      invoiceNum,
      JSON.stringify({
        ...current,
        ...updates,
      }),
    );
  }

  useEffect(() => {
    if (modalOpen === "invoice") {
      const savedInvoice = JSON.parse(localStorage.getItem(invoiceNum)) || {};

      const freshInvoice = savedInvoice.parts || [];
      const freshAdditions = savedInvoice.additions || [];
      const freshService = savedInvoice.service || {};
      const freshTotalExtra = savedInvoice.totalExtra || 0;

      setInvoice(freshInvoice);
      setUpdatedInvoice(freshInvoice);

      setAdditions(freshAdditions);
      setUpdatedAdditions(freshAdditions);

      setTotalExtra(freshTotalExtra);

      setValues((prev) => ({
        ...prev,
        hours: freshService.hours || "",
        hrRate: freshService.hrRate || localHrRate,
        totalForHours: freshService.totalForHours || "",
        totalExtra: freshTotalExtra,
      }));
    }
  }, [modalOpen, invoiceNum]);

  const { values, handleChange, setValues } = useForm({
    hours: service.hours || "",
    totalForHours: service.totalForHours || "",
    hrRate: service.hrRate || localHrRate,
  });

  const calculatedTotal =
    (totalForParts || 0) +
    (totalForAdditions || 0) +
    (Number(values.totalForHours) || 0);

  const finalTotal = calculatedTotal + Number(totalExtra);

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      totalForHours: Number(values.hours) * Number(values.hrRate),
    }));
  }, [values.hours, values.hrRate]);

  useEffect(() => {
    if (!values.totalForHours || !values.hours) return;

    const hrRate = Number(values.totalForHours) / Number(values.hours);
    setValues((prev) => ({
      ...prev,
      hrRate,
    }));
  }, [values.totalForHours]);

  useEffect(() => {
    if (!invoiceNum) return;

    saveInvoice({
      totalExtra,
    });
  }, [invoiceNum, totalExtra]);

  useEffect(() => {
    let total = 0;

    updatedInvoice.forEach((part) => {
      total += part.quantity * part.cost + (part.extra || 0);
    });

    setTotalForParts(total);

    if (invoiceNum) {
      saveInvoice({
        parts: updatedInvoice,
      });
    }
  }, [updatedInvoice]);

  useEffect(() => {
    let total = 0;

    updatedAdditions.forEach((addition) => {
      total += addition.cost;
    });

    setTotalForAdditions(total);

    if (invoiceNum) {
      saveInvoice({
        additions: updatedAdditions,
      });
    }
  }, [updatedAdditions]);

  useEffect(() => {
    if (!invoiceNum) return;

    saveInvoice({
      service: {
        hours: values.hours,
        hrRate: values.hrRate,
        totalForHours: values.totalForHours,
      },
    });
  }, [invoiceNum, values.hours, values.hrRate, values.totalForHours]);

  function plusMinusMoneyFormat(num) {
    return `${num > 0 ? "+" : "-"}$${Math.abs(num)}`;
  }

  if (modalOpen !== "invoice") return;
  return (
    <Modal title={"Invoice"} scrollY={false}>
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

                        saveInvoice({
                          parts: tempInvoice,
                        });

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
              <p>$</p>
              <input
                className="sections__section-input"
                type="number"
                name="hrRate"
                value={values.hrRate}
                onChange={handleChange}
              />
              <p>/hr</p>
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
                    <p>Description: </p>
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

                        saveInvoice({
                          additions: tempAdditions,
                        });

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
              {totalExtra !== 0 ? (
                <p className="sections__section-difference">
                  {plusMinusMoneyFormat(totalExtra)}
                </p>
              ) : (
                ""
              )}

              <p>$</p>
              <input
                className="sections__section-input_large"
                type="number"
                value={finalTotal}
                onChange={(e) => {
                  setTotalExtra(Number(e.target.value) - calculatedTotal);
                }}
              />
            </div>
          </div>
        </div>
        <button
          className="sections__section-btn"
          disabled={totalExtra !== 0}
          onClick={() => {
            setModalOpen("customer");
          }}
        >
          Invoice
        </button>
        {totalExtra != 0 && (
          <button
            className="sections__section-btn"
            onClick={() => setModalOpen("additional")}
          >
            {totalExtra > 0
              ? "Add Additional Charge"
              : "Add Additional Discount"}
          </button>
        )}
      </div>
    </Modal>
  );
};
export default InvoiceModal;
