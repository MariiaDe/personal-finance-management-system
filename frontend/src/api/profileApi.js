const API_URL = "http://localhost:5000/api/profile";

export async function getProfile(token) {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.json();
}

export async function updateProfile(token, data) {
  const response = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  return response.json();
}
