import "./InvoiceModal.css";
import Modal from "./Modal";
import Form from "../Form/Form";
import { useGlobal } from "../GlobalState/GlobalState";
import { useEffect, useRef, useState } from "react";
import { useForm } from "../../hooks/useForm";

const InvoiceModal = ({ invoiceNum }) => {
  const [partsTabOpen, setPartsTabOpen] = useState(true);
  const [chargesTabOpen, setChargesTabOpen] = useState(true);
  const [totalDifference, setTotalDifference] = useState();
  const [localHrRate, setLocalHrRate] = useState(75);
  const { modalOpen, setModalOpen } = useGlobal();

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
    const total = 18 + 25 + values.totalForHours;
    setValues((prev) => ({
      ...prev,
      total,
    }));
  }, [values.totalForHours]);

  useEffect(() => {
    const total = 18 + 25 + values.totalForHours;
    const totalDifference = values.total - total;
    setTotalDifference(totalDifference);
  }, [values.total]);

  if (modalOpen !== "invoice") return;
  return (
    <Modal title={"Invoice"}>
      <p className="invoice-num">
        Invoice Number: <span className="invoice-num-num">{invoiceNum}</span>
      </p>
      <div className="sections">
        <div className="sections__section">
          <div className="sections__section-top">
            <div className="sections__section-part">
              <p>Parts:</p>
            </div>
            <div className="sections__section-part">
              <span>$18</span>

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
            {/* first part */}
            <div className="sections__section-row">
              <div className="sections__section-part">
                <p>Part: </p>
              </div>
              <div className="sections__section-part">
                <p>Some part</p>
              </div>
              <div className="sections__section-part">
                <span>$12</span>
              </div>
            </div>
            {/* second part */}
            <div className="sections__section-row">
              <div className="sections__section-part">
                <p>Part: </p>
              </div>
              <div className="sections__section-part">
                <p>Some part</p>
              </div>
              <div className="sections__section-part">
                <span>$6</span>
              </div>
            </div>
            <button
              className="sections__section-btn"
              onClick={() => setModalOpen("part")}
            >
              Add Part
            </button>
          </div>
        </div>
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
        <div className="sections__section">
          <div className="sections__section-top">
            <div className="sections__section-part">
              <p>Additional Charges/Discounts:</p>
            </div>
            <div className="sections__section-part">
              <span>$25</span>

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
            {/* first charge */}
            <div className="sections__section-row">
              <div className="sections__section-part">
                <p>description: </p>
              </div>
              <div className="sections__section-part">
                <p>Some reason</p>
              </div>
              <div className="sections__section-part">
                <span>$10</span>
              </div>
            </div>
            {/* second charge */}
            <div className="sections__section-row">
              <div className="sections__section-part">
                <p>description: </p>
              </div>
              <div className="sections__section-part">
                <p>Some other reason</p>
              </div>
              <div className="sections__section-part">
                <span>$15</span>
              </div>
            </div>
            <button className="sections__section-btn">
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
                  {totalDifference > 0 ? "+" : "-"}${Math.abs(totalDifference)}
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
          Submit
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
