import Modal from "./Modal";
import Form from "../Form/Form";
import { useGlobal } from "../GlobalState/GlobalState";
import { sendEmailToEzra } from "../../utils/email";

const ContactEzraModal = ({ token }) => {
  //hook up to my email

  const { modalOpen, setModalOpen } = useGlobal();

  function sendContactEmail(values) {
    return sendEmailToEzra({ token, message: values.message })
      .then(() => {
        setModalOpen(false);
        return { success: true };
      })
      .catch((err) => {
        console.error(err);

        return {
          success: false,
          message:
            err?.response?.data?.message ||
            err?.message ||
            "Failed to send email",
        };
      });
  }

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
            required: true,
          },
        ]}
        onSuccessfulSubmit={sendContactEmail}
      />
    </Modal>
  );
};
export default ContactEzraModal;
