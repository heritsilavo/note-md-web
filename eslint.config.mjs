import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      
      // Désactiver les erreurs pour les types 'any'
      "@typescript-eslint/no-explicit-any": "off",
      
      // Désactiver les warnings pour les dépendances manquantes des hooks
      "react-hooks/exhaustive-deps": "off",
      
      // Désactiver les erreurs pour les entités non échappées
      "react/no-unescaped-entities": "off",
      
      // Désactiver les erreurs pour prefer-const
      "prefer-const": "off",
      
      // Désactiver les erreurs pour les interfaces vides
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
];

export default eslintConfig;