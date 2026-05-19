const API_URL = "http://localhost:5000/api/bank-accounts";

export async function getBankAccounts(token) {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.json();
}

export async function createBankAccount(token, data) {
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

export async function syncBankAccount(token, id) {
  const response = await fetch(`${API_URL}/${id}/sync`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.json();
}

export async function deleteBankAccount(token, id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.json();
}
