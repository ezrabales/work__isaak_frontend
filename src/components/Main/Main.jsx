import "./Main.css";
import Table from "../Table/Table";
import { useGlobal } from "../GlobalState/GlobalState";
import AddJobModal from "../Modal/AddJobModal";
import CreateNewPartModal from "../Modal/CreateNewPartModal";
import InvoiceModal from "../Modal/InvoiceModal";
import { useState } from "react";
import AddPartModal from "../Modal/AddPartModal";
import AdditionalChargesDiscountsModal from "../Modal/AdditionalChargesDiscountsModal";
import PictureModal from "../Modal/PictureModal";

const Main = () => {
  const { modalOpen, setModalOpen } = useGlobal();
  const [invoiceNum, setInvoiceNum] = useState();
  const [mainTable, setMainTable] = useState({
    head: ["Location", "Notes", "Pictures", "Payment Status", "Invoice"],
    body: [
      [
        "Some st. Kalispell, MT",
        "Did a thing",

        <button
          className="table__btn"
          onClick={() => {
            setModalOpen("pictures");
          }}
        >
          Pictures
        </button>,
        <div style={{ display: "flex" }}>
          <span className="red-dot" />
          Not charged
        </div>,
        <button
          className="table__btn"
          id="invoice_1"
          onClick={(e) => {
            setInvoiceNum(e.target.id);
            setModalOpen("invoice");
          }}
        >
          Invoice
        </button>,
      ],
      [
        "Some st. Columbia Falls, MT",
        "Did another thing",
        <button className="table__btn">Pictures</button>,
        <div style={{ display: "flex" }}>
          <span className="orange-dot" />
          Awaiting Payment
        </div>,
        ,
        "Invoiced $500",
      ],
    ],
  });

  function onJobSubmit(e) {
    setModalOpen(false);
    const newRow = [
      e.location,
      e.notes,
      <button className="table__btn">Pictures</button>,
      <div style={{ display: "flex" }}>
        <span className="red-dot" />
        Not charged
      </div>,
      <button
        className="table__btn"
        id={`invoice_${mainTable.body.length + 1}`}
        onClick={(e) => {
          setInvoiceNum(e);
          setModalOpen("invoice");
        }}
      >
        Invoice
      </button>,
    ];

    setMainTable((prev) => ({
      ...prev,
      body: [...prev.body, newRow],
    }));
  }

  return (
    <div className="main">
      <Table head={mainTable.head} body={mainTable.body} />
      <button className="main__job-btn" onClick={() => setModalOpen("job")}>
        Add Job
      </button>
      <AddJobModal onSuccessfulSubmit={onJobSubmit} />
      <CreateNewPartModal />
      <AdditionalChargesDiscountsModal />
      <AddPartModal />
      <InvoiceModal invoiceNum={invoiceNum} />
      <PictureModal />
    </div>
  );
};
export default Main;
