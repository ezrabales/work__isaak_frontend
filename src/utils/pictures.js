export const BASE_URL =
  process.env.NODE_ENV === "production" ? "TODO" : "http://localhost:3001";

function checkResponse(res) {
  if (res.ok) return res.json();

  return res.json().then((err) => {
    return Promise.reject(err);
  });
}

export const uploadPicture = ({
  src,
  description,
  assetId,
  invoiceNumber,
  token,
}) => {
  return fetch(`${BASE_URL}/pictures`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ src, description, assetId, invoiceNumber }),
  }).then(checkResponse);
};

export const getPictures = ({ token, invoiceNumber }) => {
  return fetch(`${BASE_URL}/pictures/${invoiceNumber}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  }).then(checkResponse);
};

export const deletePicture = ({ token, picId }) => {
  return fetch(`${BASE_URL}/pictures/${picId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  }).then(checkResponse);
};
