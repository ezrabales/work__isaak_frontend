import Modal from "./Modal";
import { useGlobal } from "../GlobalState/GlobalState";

const AddPartModal = () => {
  const { modalOpen, setModalOpen } = useGlobal();
  if (modalOpen !== "part") return;
  return (
    <Modal title={"Parts"}>
      <div className="sections">
        <div className="sections__section">
          <div className="sections__section-solid">
            <div className="sections__section-part">
              <p>some pvc elbow</p>
            </div>
            <div className="sections__section-part">
              <p>$10</p>
            </div>
            <button className="sections__section-row-btn">Add Part</button>
          </div>
        </div>
        <div className="sections__section">
          <div className="sections__section-solid">
            <div className="sections__section-part">
              <p>some pvc part</p>
            </div>
            <div className="sections__section-part">
              <p>$8</p>
            </div>
            <button className="sections__section-row-btn">Add Part</button>
          </div>
        </div>
        <button
          className="sections__section-btn"
          onClick={() => setModalOpen("createPart")}
        >
          Create New Part
        </button>
      </div>
    </Modal>
  );
};
export default AddPartModal;
