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
import AddPictureModal from "../Modal/AddPictureModal";

const Main = () => {
  const { modalOpen, setModalOpen } = useGlobal();
  const [invoiceNum, setInvoiceNum] = useState();
  const [photos, setPhotos] = useState([]);
  const [mainTable, setMainTable] = useState({
    head: [
      "Invoice Number",
      "Location",
      "Notes",
      "Pictures",
      "Payment Status",
      "Invoice",
    ],
    body: [
      [
        "invoice_1",
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
        "invoice_2",
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

  return (
    <div className="main">
      <Table head={mainTable.head} body={mainTable.body} />
      <button className="main__job-btn" onClick={() => setModalOpen("job")}>
        Add Job
      </button>
      <AddJobModal />
      <CreateNewPartModal />
      <AdditionalChargesDiscountsModal />
      <AddPartModal />
      <InvoiceModal invoiceNum={invoiceNum} />
      <PictureModal photos={photos} />
      <AddPictureModal setPhotos={setPhotos} />
    </div>
  );
};
export default Main;
