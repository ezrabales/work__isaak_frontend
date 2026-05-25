import Modal from "./Modal";
import Form from "../Form/Form";
import { useGlobal } from "../GlobalState/GlobalState";

const ContactEzraModal = ({ onSuccessfulSubmit }) => {
  //hook up to my email
  const { modalOpen, setModalOpen } = useGlobal();

  if (modalOpen !== "ezra") return;
  return (
    <Modal title={"Contact Ezra"}>
      <Form
        inputs={[
          {
            name: "message",
            type: "text",
            placeholder: "Message",
            labelText: "Message *",
            required: "true",
          },
        ]}
        onSuccessfulSubmit={onSuccessfulSubmit}
      />
    </Modal>
  );
};
export default ContactEzraModal;
