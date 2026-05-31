export const BASE_URL =
  process.env.NODE_ENV === "production" ? "TODO" : "http://localhost:3001";

function checkResponse(res) {
  if (res.ok) return res.json();

  return res.json().then((err) => {
    return Promise.reject(err);
  });
}

export const sendEmailToEzra = ({ token, message }) => {
  return fetch(`${BASE_URL}/email/ezra`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      message,
    }),
  }).then(checkResponse);
};
