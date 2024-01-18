export const fetchUser = async (body: { email: string; password: string }) => {
  const response = await fetch("http://localhost:8000/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return await response.json();
};
