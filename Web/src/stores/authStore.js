import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { useFetch } from "@/composables/useFetch";

const { fetchData } = useFetch();

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token") || null);
  const user = ref(null);
  const error = ref("");

  function setToken(newToken) {
    token.value = newToken;
    localStorage.setItem("token", newToken);
    checkTokenExpiration(newToken);
  }

  function logout() {
    token.value = null;
    user.value = null;
    error.value = "";
    localStorage.removeItem("token");
  }

  const isAuthenticated = computed(() => !!token.value);

  watch(
    token,
    () => {
      const decodedToken = decodeToken();
      if (decodedToken && decodedToken?.user) {
        user.value = decodedToken.user;
      }
    },
    { immediate: true },
  );

  function checkTokenExpiration(jwtToken) {
    if (!jwtToken) return;
    try {
      const payload = JSON.parse(atob(jwtToken.split(".")[1]));
      const exp = payload.exp * 1000;
      const now = Date.now();

      if (exp < now) {
        logout();
      } else {
        setTimeout(logout, exp - now);
      }
    } catch (e) {
      console.error("Invalid token", e);
      logout();
    }
  }

  function decodeToken() {
    if (!token.value) return null;
    try {
      const payload = token.value.split(".")[1]; // Get the payload part of the JWT
      const decoded = JSON.parse(atob(payload)); // Decode the base64 payload
      return decoded;
    } catch (e) {
      console.error("Failed to decode token", e);
      return null;
    }
  }

  checkTokenExpiration(token.value);

  async function updateUser(newUser) {
    if (!token.value || !user.value || !user.value.account_id) {
      error.value = "User not authenticated";
      return;
    }
    try {
      const response = await fetchData("/accounts/" + user.value.account_id, {
        method: "PUT",
        body: JSON.stringify(newUser),
      });
      if (response.error) {
        error.value = response.error;
      } else {
        user.value = response.user;
        setToken(response.token);
      }
    } catch (err) {
      error.value = "Failed to update user";
    }
  }

  async function deleteAccount() {
    if (!token.value || !user.value || !user.value.account_id) {
      error.value = "User not authenticated";
      return;
    }
    try {
      const response = await fetchData("/accounts/" + user.value.account_id, {
        method: "DELETE",
      });
      if (response.error) {
        error.value = response.error;
      } else {
        logout();
      }
    } catch (err) {
      error.value = "Failed to delete account";
    }
  }

  return {
    setToken,
    token,
    user,
    error,
    logout,
    isAuthenticated,
    decodeToken,
    updateUser,
    deleteAccount,
  };
});
