import Modal from "./Modal";
import Form from "../Form/Form";
import { useGlobal } from "../GlobalState/GlobalState";
import { changePassword } from "../../utils/auth";

const PasswordModal = ({ token }) => {
  const { modalOpen, setModalOpen } = useGlobal();
  if (modalOpen !== "password") return;

  function handleChangePassword(values) {
    return changePassword({ token, password: values.password })
      .then((res) => {
        setModalOpen(false);
        return { success: true };
      })
      .catch((err) => {
        console.error(err);
        return {
          success: false,
          message:
            err?.message ||
            err?.response?.data?.message ||
            "Failed to change password",
        };
      });
  }

  return (
    <Modal title={"Change Password"}>
      <Form
        onSuccessfulSubmit={handleChangePassword}
        inputs={[
          {
            name: "password",
            type: "password",
            placeholder: "New Password",
            labelText: "New Password *",
            required: true,
          },
        ]}
      />
    </Modal>
  );
};
export default PasswordModal;
