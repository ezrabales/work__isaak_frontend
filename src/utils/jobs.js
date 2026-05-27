export const BASE_URL =
  process.env.NODE_ENV === "production" ? "TODO" : "http://localhost:3001";

function checkResponse(res) {
  if (res.ok) return res.json();

  return res.json().then((err) => {
    return Promise.reject(err);
  });
}

export const createJob = ({ token, location, notes }) => {
  return fetch(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      location,
      notes,
    }),
  }).then(checkResponse);
};

export const getPictures = ({ token, invoiceNumber }) => {
  return fetch(`${BASE_URL}/picture/${invoiceNumber}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  }).then(checkResponse);
};
