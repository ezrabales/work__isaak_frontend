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

export const createPart = ({ token, name, cost, partNumber }) => {
  return fetch(`${BASE_URL}/parts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      cost,
      partNumber,
    }),
  }).then(checkResponse);
};

export const getParts = ({ token }) => {
  return fetch(`${BASE_URL}/parts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  }).then(checkResponse);
};

export const deletePart = ({ token, id }) => {
  return fetch(`${BASE_URL}/parts/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  }).then(checkResponse);
};

export const updatePart = ({ token, id, name, partNumber, cost }) => {
  return fetch(`${BASE_URL}/parts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      partNumber,
      name,
      cost,
    }),
  }).then(checkResponse);
};
