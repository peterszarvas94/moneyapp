import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        "inner": "0.43rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
