import "./Main.css";
import Table from "../Table/Table";
import { useGlobal } from "../GlobalState/GlobalState";
import AddJobModal from "../Modal/AddJobModal";
import AddPartModal from "../Modal/AddPartModal";

const Main = () => {
  const { modalOpen, setModalOpen } = useGlobal();
  return (
    <div className="main">
      <Table
        head={["Location", "Notes", "Pictures", "Payment Status", "Invoice"]}
        body={[
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
        ]}
      />
      <button className="main__job-btn" onClick={() => setModalOpen("job")}>
        Add Job
      </button>
      <AddJobModal />
      <AddPartModal />
    </div>
  );
};
export default Main;
