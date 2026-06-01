import { useState } from "react";
import { useGlobal } from "../GlobalState/GlobalState";
import Modal from "./Modal";
import Form from "../Form/Form";
import { uploadPicture } from "../../utils/pictures";

const AddPictureModal = ({ setPhotos, invoiceNum, token }) => {
  const { modalOpen, setModalOpen } = useGlobal();
  const { submitTo } = useGlobal();
  const [loading, setLoading] = useState(false);

  if (modalOpen !== "addPicture") return null;

  async function handleUpload(values) {
    setLoading(true);
    const file = values.file;

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      setPhotos((prev) => [
        ...prev,
        {
          src: data.secure_url,
          publicId: data.public_id,
          description: values.description,
        },
      ]);

      return uploadPicture({
        src: data.secure_url,
        description: values.description,
        assetId: data.asset_id,
        invoiceNumber: invoiceNum,
        token: token,
      })
        .then(() => {
          setModalOpen(submitTo || "pictures");
          setLoading(false);
          return { success: true };
        })
        .catch((err) => {
          console.error(err);
          return {
            success: false,
            message:
              err?.message ||
              err?.response?.data?.message ||
              "Failed to upload picture",
          };
        });

      setLoading(false);
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message:
          err?.message ||
          err?.response?.data?.message ||
          "Failed to upload picture",
      };
    }
  }

  return (
    <Modal title="Add Picture">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Form
          onSuccessfulSubmit={handleUpload}
          inputs={[
            {
              name: "file",
              type: "file",
              accept: "image/*,.pdf",
              required: true,
            },
            {
              name: "description",
              type: "text",
              placeholder: "Description",
              labelText: "Description",
            },
          ]}
        />
      )}
    </Modal>
  );
};

export default AddPictureModal;
