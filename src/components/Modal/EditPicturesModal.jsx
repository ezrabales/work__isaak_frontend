import { useGlobal } from "../GlobalState/GlobalState";
import Modal from "./Modal";
import { tempPhoto } from "../../assets";
import { deletePicture, getPictures } from "../../utils/pictures";
import { useEffect, useState } from "react";
import { deleteJob } from "../../utils/jobs";

const EditPicturesModal = ({ invoiceNum, token }) => {
  const { modalOpen, setModalOpen } = useGlobal();
  const [photos, setPhotos] = useState([]);
  const [deletingPhoto, setDeletingPhoto] = useState([]);

  function handleDeletePicture(e) {
    setDeletingPhoto((prev) => [...(prev || []), e.target.id]);
    deletePicture({ token, picId: e.target.id })
      .then((res) => {
        setPhotos((prev) => prev.filter((photo) => photo._id !== res.id));
      })
      .catch(console.error)
      .finally(() => setDeletingPhoto([]));
  }

  useEffect(() => {
    if (invoiceNum) {
      getPictures({
        invoiceNumber: invoiceNum,
        token,
      })
        .then((res) => {
          setPhotos(res.data);
        })
        .catch(console.error);
    }
  }, [modalOpen == "editPictures", invoiceNum]);

  if (modalOpen !== "editPictures") return;
  return (
    <Modal title={"Edit Pictures"}>
      {photos.length <= 0 ? (
        <>
          <div className="no-data">No pictures</div>
        </>
      ) : (
        <div className="edit-pic">
          {photos.map((photo, i) => {
            if (deletingPhoto?.includes(photo._id)) {
              return (
                <div key={i}>
                  <img src={photo.src} alt="" className="edit-pic__pic" />
                  <p className="edit-pic__description">{photo.description}</p>
                  <button className="edit-pic__deleting">Deleting...</button>
                </div>
              );
            }
            return (
              <div key={i}>
                <img src={photo.src} alt="" className="edit-pic__pic" />
                <p className="edit-pic__description">{photo.description}</p>
                <button
                  className="edit-pic__delete"
                  id={photo._id}
                  onClick={handleDeletePicture}
                >
                  Delete
                </button>
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
