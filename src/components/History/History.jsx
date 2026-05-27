import "./History.css";
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
import EditJobModal from "../Modal/EditJobModal";
import EditPicturesModal from "../Modal/EditPicturesModal";

const History = () => {
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
      "Date Started",
      "Date Ended",
      "Total Time",
      "Edit",
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
        "",
        "",
        "",
        <button className="table__btn" onClick={() => setModalOpen("editJob")}>
          Edit
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
        "",
        "",
        "",
        <button className="table__btn" onClick={() => setModalOpen("editJob")}>
          Edit
        </button>,
      ],
    ],
  });

  return (
    <div className="main">
      <Table head={mainTable.head} body={mainTable.body} />
      <CreateNewPartModal />
      <AdditionalChargesDiscountsModal />
      <AddPartModal />
      <InvoiceModal invoiceNum={invoiceNum} />
      <PictureModal photos={photos} />
      <AddPictureModal setPhotos={setPhotos} />
      <EditJobModal />
      <EditPicturesModal photos={photos} />
    </div>
  );
};
export default History;
