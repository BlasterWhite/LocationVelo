import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token") || null);
  const user = ref(null);
  const error = ref("");

  function setToken(newToken) {
    token.value = newToken;
    localStorage.setItem("token", newToken);
    checkTokenExpiration(newToken);
  }

  function setUser(userData) {
    user.value = userData;
  }

  function logout() {
    token.value = null;
    user.value = null;
    error.value = "";
    localStorage.removeItem("token");
  }

  const isAuthenticated = computed(() => !!token.value);
  
  watch(token, (newToken) => {
    console.log("Token changed:", newToken);
    console.log("isAuthenticated:", isAuthenticated.value);
  });

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

  return {
    setToken,
    token,
    user,
    error,
    setToken,
    setUser,
    logout,
    isAuthenticated,
    decodeToken,
  };
});
