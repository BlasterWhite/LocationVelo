import { ref } from "vue";

export function useFetch() {
  const API_URL = import.meta.env.VITE_URL_API;

  const fetchData = async (url, options = {}) => {
    const token = ref(localStorage.getItem("token"));
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.value}`,
      ...options.headers,
    };
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
    });
    if (!response.ok) {
      const errorData = await response.json();
      return errorData.error || "An error occurred";
    }
    const data = await response.json();
    return data;
  };

  return {
    API_URL,
    fetchData,
  };
}
