import { useGlobal } from "../GlobalState/GlobalState";
import Modal from "./Modal";
import "./PictureModal.css";
import { tempPhoto } from "../../assets";
import { getPictures } from "../../utils/pictures";
import { useEffect, useState } from "react";

const PictureModal = () => {
  const token = localStorage.getItem("jwt");
  const { modalOpen, setModalOpen } = useGlobal();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    getPictures({
      invoiceNumber: "1234",
      token,
    })
      .then((res) => {
        setPhotos(res.data);
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  }, [modalOpen == "pictures"]);

  if (modalOpen !== "pictures") return;
  return (
    <Modal title={"Pictures"}>
      {loading ? (
        <div className="pic__loading">Loading...</div>
      ) : photos.length <= 0 ? (
        <>
          <div className="pic__none">No pictures</div>
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
      <button
        className="pic__add-pic-btn"
        onClick={() => setModalOpen("addPicture")}
      >
        Add Picture
      </button>
    </Modal>
  );
};
export default PictureModal;
