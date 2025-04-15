import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

export function useAuth() {
  const authStore = useAuthStore();
  const email = ref("test@test.co");
  const password = ref("testui");
  const passwordConfirm = ref("testui");
  const firstName = ref("Jhon");
  const lastName = ref("Deo");
  const phone = ref("");
  const address = ref("");
  const newsLetter = ref(false);
  const error = ref("");

  const router = useRouter();

  function validateEmail(email) {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
  }

  function validateLoginInput() {
    if (!email.value || !password.value) {
      error.value = "Veuillez remplir tous les champs obligatoires.";
      return false;
    }
    if (!validateEmail(email.value)) {
      error.value = "Veuillez entrer une adresse e-mail valide.";
      return false;
    }
    error.value = "";
    return true;
  }

  function validateRegisterInput() {
    if (!email.value || !password.value || !passwordConfirm.value) {
      error.value = "Veuillez remplir tous les champs obligatoires.";
      return false;
    }
    if (!validateEmail(email.value)) {
      error.value = "Veuillez entrer une adresse e-mail valide.";
      return false;
    }
    if (password.value !== passwordConfirm.value) {
      error.value = "Les mots de passe ne correspondent pas.";
      return false;
    }
    if (password.value.length < 6) {
      error.value = "Le mot de passe doit contenir au moins 8 caractères.";
      return false;
    }
    if (!firstName.value || !lastName.value) {
      error.value = "Veuillez entrer votre nom et prénom.";
      return false;
    }
    error.value = "";
    return true;
  }

  async function login() {
    if (!validateLoginInput()) return;
    try {
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
        error.value = data.error;
      } else {
        authStore.setToken(data.token);
        router.push({ name: "home" });
      }
    } catch (err) {
      error.value = "Une erreur est survenue. Veuillez réessayer.";
    }
  }

  async function register() {
    if (!validateRegisterInput()) return;
    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
          first_name: firstName.value,
          last_name: lastName.value,
          phone: phone.value,
          address: address.value,
          subscribe: !!newsLetter.value,
        }),
      });
      const data = await response.json();
      if (data.error || !data.token) {
        error.value = data.error;
      } else {
        authStore.setToken(data.token);
        router.push({ name: "home" });
      }
    } catch (err) {
      error.value = "Une erreur est survenue. Veuillez réessayer.";
    }
  }

  return {
    email,
    password,
    error,
    passwordConfirm,
    firstName,
    lastName,
    phone,
    address,
    newsLetter,
    login,
    register,
  };
}
