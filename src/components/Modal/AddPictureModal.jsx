import { useState } from "react";
import { useGlobal } from "../GlobalState/GlobalState";
import Modal from "./Modal";
import Form from "../Form/Form";

const AddPictureModal = ({ setPhotos }) => {
  const { modalOpen, setModalOpen } = useGlobal();

  if (modalOpen !== "addPicture") return null;

  function handleUpload(values) {
    const file = values.file;
    if (!file) return;

    const imageURL = URL.createObjectURL(file);

    setPhotos((prev) => [
      ...prev,
      {
        src: imageURL,
        description: values.description,
      },
    ]);

    setModalOpen("pictures");
  }

  return (
    <Modal title="Add Picture">
      <Form
        onSuccessfulSubmit={handleUpload}
        inputs={[
          {
            name: "file",
            type: "file",
            accept: "image/*",
            required: "true",
          },
          {
            name: "description",
            type: "text",
            placeholder: "Description",
            labelText: "Description",
          },
        ]}
      />
    </Modal>
  );
};

export default AddPictureModal;
