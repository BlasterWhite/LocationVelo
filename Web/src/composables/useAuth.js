import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";

export function useAuth() {
  const authStore = useAuthStore();
  const email = ref("test@test.co");
  const password = ref("test");

  function validateEmail(email) {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
  }

  function validateLoginInput() {
    if (!email.value || !password.value) {
      authStore.error = "Please enter your email and password.";
      return false;
    }
    if (!validateEmail(email.value)) {
      authStore.error = "Please enter a valid email address.";
      return false;
    }
    authStore.error = "";
    return true;
  }

  async function login(emit) {
    if (!validateLoginInput()) return;
    try {
      console.log("login", email.value, password.value);

      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      });
      const data = await response.json();
      if (data.error || !data.token) {
        authStore.error = data.error;
      } else {
        authStore.setToken(data.token);
        authStore.setUser(data.user);
        emit("login");
      }
    } catch (err) {
      authStore.error = "An error occurred. Please try again.";
    }
  }

  return {
    email,
    password,
    login,
  };
}
