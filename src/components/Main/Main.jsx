import "./Main.css";
import Table from "../Table/Table";
import { useGlobal } from "../GlobalState/GlobalState";
import AddJobModal from "../Modal/AddJobModal";
import AddPartModal from "../Modal/AddPartModal";
import { useState } from "react";

const Main = () => {
  const { modalOpen, setModalOpen } = useGlobal();
  const [mainTable, setMainTable] = useState({
    head: ["Location", "Notes", "Pictures", "Payment Status", "Invoice"],
    body: [
      [
        "Some st. Kalispell, MT",
        "Did a thing",
        "",
        <div style={{ display: "flex" }}>
          <span className="red-dot" />
          Not charged
        </div>,
        "",
      ],
      [
        "Some st. Columbia Falls, MT",
        "Did another thing",
        "",
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
    console.log(e);
    const newRow = [
      e.location,
      e.notes,
      "",
      <div style={{ display: "flex" }}>
        <span className="red-dot" />
        Not charged
      </div>,
      "",
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
      <AddPartModal />
    </div>
  );
};
export default Main;
