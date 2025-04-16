export function useRules() {
  const rules = {
    required: (value) => !!value || "Ce champ est requis",
    email: (value) =>
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value) ||
      "L'adresse e-mail doit être valide",
    password: (value) =>
      value.length >= 6 ||
      "Le mot de passe doit contenir au moins 6 caractères",
    confirmPassword: (value, password) =>
      value === password || "Les mots de passe ne correspondent pas",
    minLength: (length) => (value) =>
      value.length >= length || `Minimum length is ${length} characters`,
    maxLength: (length) => (value) =>
      value.length <= length || `Maximum length is ${length} characters`,
    passwordStrength: (value) =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(value) ||
      "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre",
  };

  return { rules };
}
