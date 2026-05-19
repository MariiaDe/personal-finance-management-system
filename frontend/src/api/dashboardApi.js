export async function getDashboardData(token, options = {}) {
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
  const response = await fetch(`http://localhost:5000/api/dashboard${query ? `?${query}` : ""}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.json();
}
