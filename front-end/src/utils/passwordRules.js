export const REQUISITOS_SENHA = [
  {
    id: "tamanho",
    texto: "passwordRules.length",
    validar: (s) => s.length >= 8,
  },
  {
    id: "maiuscula",
    texto: "passwordRules.uppercase",
    validar: (s) => /[A-Z]/.test(s),
  },
  {
    id: "minuscula",
    texto: "passwordRules.lowercase",
    validar: (s) => /[a-z]/.test(s),
  },
  {
    id: "numero",
    texto: "passwordRules.number",
    validar: (s) => /[0-9]/.test(s),
  },
  {
    id: "especial",
    texto: "passwordRules.special",
    validar: (s) => /[^A-Za-z0-9]/.test(s),
  },
];
