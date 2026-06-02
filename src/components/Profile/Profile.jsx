import { useEffect, useState } from "react";
import "./Profile.css";
import { useGlobal } from "../GlobalState/GlobalState";
import Form from "../Form/Form";
import Table from "../Table/Table";
import { checkToken, editUser } from "../../utils/auth";
import PasswordModal from "../Modal/PasswordModal";

const Profile = () => {
  const token = localStorage.getItem("jwt");
  const { modalOpen, setModalOpen } = useGlobal();
  const [user, setUser] = useState();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkToken(token)
      .then((res) => {
        setUser(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  function handleEditUser(values) {
    setLoading(true);
    return editUser({
      token,
      body: {
        name: values.name,
        email: values.email,
        rate: values.rate,
        phone: values.phone,
        footer: {
          companyName: values.companyName,
          address: values.address,
          payableNote: values.payableNote,
          thankYou: values.thankYou,
        },
      },
    })
      .then((res) => {
        setUser(res);
        setEditing(false);
        return { success: true };
      })
      .catch((err) => {
        console.error(err);
        return {
          success: false,
          message:
            err?.message ||
            err?.response?.data?.message ||
            "Failed to edit user",
        };
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className="profile">
      {editing ? (
        <div className="profile__form-container">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Form
              onSuccessfulSubmit={handleEditUser}
              initialValues={{
                name: user?.name,
                email: user?.email,
                rate: user?.rate,
                phone: user?.phone,
                address: user?.footer?.address,
                companyName: user?.footer?.companyName,
                payableNote: user?.footer?.payableNote,
                thankYou: user?.footer?.thankYou,
              }}
              inputs={[
                {
                  name: "name",
                  type: "text",
                  placeholder: "Name",
                  labelText: "Name",
                },
                {
                  name: "email",
                  type: "email",
                  placeholder: "Email",
                  labelText: "Email",
                },
                <button
                  className="profile__edit-password-btn"
                  type="button"
                  onClick={() => setModalOpen("password")}
                >
                  Change Password
                </button>,
                {
                  name: "rate",
                  type: "number",
                  placeholder: "Hourly Rate",
                  labelText: "Hourly Rate",
                },

                <div className="login__form-break">
                  The following inputs will be displayed under each invoice:
                </div>,
                {
                  name: "phone",
                  type: "number",
                  placeholder: "Phone Number",
                  labelText: "Phone Number",
                },
                {
                  name: "companyName",
                  type: "text",
                  placeholder: "Company Name",
                  labelText: "Company name",
                },
                {
                  name: "address",
                  type: "text",
                  placeholder: "For checks",
                  labelText: "Address",
                },
                {
                  name: "payableNote",
                  type: "text",
                  placeholder: "Pay me in this way:",
                  labelText: "Payable Note",
                },
                {
                  name: "thankYou",
                  type: "text",
                  placeholder: "A thank you note",
                  labelText: "Thank You Note",
                },
              ]}
            />
          )}
        </div>
      ) : (
        <>
          <Table
            body={[
              ["Name:", user?.name],
              ["Email:", user?.email],
              ["Phone:", user?.phone],
              ["Hourly Rate:", user?.rate],
              ["Address:", user?.footer?.address],
              ["Company Name:", user?.footer?.companyName],
              ["Payable Note:", user?.footer?.payableNote],
              ["Thank You Note:", user?.footer?.thankYou],
            ]}
          />
          <button
            onClick={() => setEditing(true)}
            className="profile__edit-btn"
          >
            Edit
          </button>
        </>
      )}
      <PasswordModal token={token} />
    </div>
  );
};
export default Profile;
