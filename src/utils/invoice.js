export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://plumbing-tech.onrender.com"
    : "http://localhost:3001";

function checkResponse(res) {
  if (res.ok) return res.json();

  return res.json().then((err) => {
    return Promise.reject(err);
  });
}

export const sendInvoice = ({ token, jobId }, body) => {
  return fetch(`${BASE_URL}/invoice/${jobId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  }).then(checkResponse);
};

export const getInvoice = ({ token, invoiceNumber }) => {
  return fetch(`${BASE_URL}/invoice/${invoiceNumber}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  }).then(checkResponse);
};

export const resendInvoice = ({ token, invoiceNumber }) => {
  return fetch(`${BASE_URL}/invoice/resend/${invoiceNumber}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  }).then(checkResponse);
};
