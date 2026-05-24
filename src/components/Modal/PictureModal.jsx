import { useGlobal } from "../GlobalState/GlobalState";
import Modal from "./Modal";
import "./PictureModal.css";
import { tempPhoto } from "../../assets";

const PictureModal = () => {
  const { modalOpen, setModalOpen } = useGlobal();
  const photos = [
    { src: tempPhoto, description: "description" },
    { src: tempPhoto, description: "description" },
    { src: tempPhoto, description: "description" },
    { src: tempPhoto, description: "description" },
    { src: tempPhoto, description: "description" },
    { src: tempPhoto, description: "description" },
    { src: tempPhoto, description: "description" },
    { src: tempPhoto, description: "description" },
  ];

  if (modalOpen !== "pictures") return;
  return (
    <Modal title={"Pictures"}>
      {photos.length <= 0 ? (
        <>
          <div className="pic__none">No pictures</div>
          <button className="pic__add-pic-btn">Add Pictures</button>
        </>
      ) : (
        <div
          className="pic"
          onWheel={(e) => {
            e.currentTarget.scrollLeft += e.deltaY * 1.2;
          }}
        >
          <div className="pic__track">
            {photos.map((photo, i) => {
              return (
                <div key={i}>
                  <img src={photo.src} alt="" className="pic__pic" />
                  <p className="pic__description">{photo.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <button className="pic__add-pic-btn">Add Pictures</button>
    </Modal>
  );
};
export default PictureModal;
