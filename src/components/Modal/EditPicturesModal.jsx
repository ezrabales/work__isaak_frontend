import { useGlobal } from "../GlobalState/GlobalState";
import Modal from "./Modal";
import { tempPhoto } from "../../assets";

const EditPicturesModal = ({ photos }) => {
  const { modalOpen, setModalOpen } = useGlobal();

  if (modalOpen !== "editPictures") return;
  return (
    <Modal title={"Edit Pictures"}>
      {photos.length <= 0 ? (
        <>
          <div className="pic__none">No pictures</div>
        </>
      ) : (
        <div className="edit-pic">
          {photos.map((photo, i) => {
            return (
              <div key={i}>
                <img src={photo.src} alt="" className="edit-pic__pic" />
                <p className="edit-pic__description">{photo.description}</p>
                <button className="edit-pic__delete">Delete</button>
              </div>
            );
          })}
        </div>
      )}
      <button
        className="pic__add-pic-btn"
        onClick={() => setModalOpen("addPicture")}
      >
        Add Picture
      </button>
    </Modal>
  );
};
export default EditPicturesModal;
