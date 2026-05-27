import Modal from "./Modal";
import Form from "../Form/Form";
import { useGlobal } from "../GlobalState/GlobalState";
import { createPart } from "../../utils/parts";

const CreateNewPartModal = ({ token, setParts, back = false }) => {
  const { modalOpen, setModalOpen } = useGlobal();
  if (modalOpen !== "createPart") return;

  function createNewPart(e) {
    createPart({ token, name: e.name, cost: e.cost })
      .then((res) => {
        setParts((prev) => [
          ...prev,
          {
            _id: res._id,
            name: res.name,
            cost: res.cost,
          },
        ]);
        setModalOpen(back);
      })
      .catch((err) => console.error(err));
  }

  return (
    <Modal
      title={"Create New Part"}
      backTo={() => {
        setModalOpen("part");
      }}
    >
      <Form
        onSuccessfulSubmit={createNewPart}
        inputs={[
          {
            name: "name",
            type: "text",
            placeholder: "Name",
            labelText: "Name *",
            required: true,
          },
          {
            name: "cost",
            type: "number",
            placeholder: "Cost",
            labelText: "Cost *",
            required: true,
          },
        ]}
      />
    </Modal>
  );
};
export default CreateNewPartModal;
