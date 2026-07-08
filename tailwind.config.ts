import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  // The 'content' property is removed for Tailwind CSS v4.
  // The framework automatically handles content scanning.
  theme: {
    extend: {},
  },
  plugins: [
    typography,
  ],
};
export default config;