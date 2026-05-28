export const BASE_URL =
  process.env.NODE_ENV === "production" ? "TODO" : "http://localhost:3001";

function checkResponse(res) {
  if (res.ok) return res.json();

  return res.json().then((err) => {
    return Promise.reject(err);
  });
}

export const createJob = ({ token, location, email, notes }) => {
  return fetch(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      location,
      notes,
      email,
    }),
  }).then(checkResponse);
};

export const getJobs = ({ token }) => {
  return fetch(`${BASE_URL}/jobs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  }).then(checkResponse);
};

export const updateJob = ({
  token,
  jobId,
  location,
  notes,
  email,
  paymentStatus,
  amountOwed,
  amountPaid,
  dateStarted,
  dateEnded,
}) => {
  return fetch(`${BASE_URL}/jobs/${jobId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      location,
      notes,
      email,
      paymentStatus,
      amountOwed,
      amountPaid,
      dateStarted,
      dateEnded,
    }),
  }).then(checkResponse);
};

export const updateJobStatus = ({
  token,
  jobId,
  paymentStatus,
  amountPaid,
  amountOwed,
}) => {
  return fetch(`${BASE_URL}/jobs/status/${jobId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      paymentStatus,
      amountPaid,
      amountOwed,
    }),
  }).then(checkResponse);
};

export const deleteJob = ({ token, jobId, invoiceNumber }) => {
  return fetch(`${BASE_URL}/jobs/${jobId}/${invoiceNumber}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  }).then(checkResponse);
};
