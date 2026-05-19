const API_URL = "http://localhost:5000/api/recommendations";

export async function getRecommendations(token, options = {}) {
  const params = new URLSearchParams();

  if (options.period) {
    params.set("period", options.period);
  }

  if (options.from) {
    params.set("from", options.from);
  }

  if (options.to) {
    params.set("to", options.to);
  }

  const query = params.toString();
  const response = await fetch(`${API_URL}${query ? `?${query}` : ""}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.json();
}
