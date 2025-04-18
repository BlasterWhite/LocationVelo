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
      try {
        const errorData = await response.json();
        return errorData.error || "An error occurred";
      } catch (error) {
        return;
      }
    }
    let data;
    try {
      data = await response.json();
    } catch (error) {
      data = {};
    }
    return data;
  };

  return {
    API_URL,
    fetchData,
  };
}
