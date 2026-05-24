import { useGlobal } from "../GlobalState/GlobalState";
import Modal from "./Modal";
import "./PictureModal.css";
import { tempPhoto } from "../../assets";

const PictureModal = () => {
  const { modalOpen, setModalOpen } = useGlobal();
  const photos = [
    tempPhoto,
    tempPhoto,
    tempPhoto,
    tempPhoto,
    tempPhoto,
    tempPhoto,
    tempPhoto,
  ];

  if (modalOpen !== "pictures") return;
  return (
    <Modal title={"Pictures"}>
      <div
        className="pic"
        onWheel={(e) => {
          e.currentTarget.scrollLeft += e.deltaY * 1.2;
        }}
      >
        <div className="pic__track">
          {photos.map((photo, i) => (
            <img key={i} src={photo} alt="" className="pic__pic" />
          ))}
        </div>
      </div>
    </Modal>
  );
};
export default PictureModal;
