import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        "inner": "0.43rem",
      },
      gridTemplateColumns: {
        "payee": "auto 2rem auto auto auto",
      },
    },
  },
  plugins: [],
} satisfies Config;
