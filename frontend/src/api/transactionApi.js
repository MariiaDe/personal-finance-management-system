const API_URL = "http://localhost:5000/api/transactions";

export async function getTransactions(token) {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.json();
}

export async function createTransaction(token, data) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  return response.json();
}

export async function deleteTransaction(token, id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.json();
}
