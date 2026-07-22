import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}","./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: {
    colors: {
      surface:"#0d141f", "surface-lowest":"#070e19", "surface-low":"#151c27", "surface-container":"#19202b", "surface-high":"#232a36", "surface-highest":"#2e3541",
      primary:"#b0c8f1", "primary-container":"#0a2647", secondary:"#b1c5ff", "secondary-container":"#065bd9", "border-dark":"#1e3454", muted:"#9fb0c6", success:"#1e9e6b", error:"#dc3545"
    },
    fontFamily:{ sans:["Inter","Arial","sans-serif"], display:["Geist","Inter","sans-serif"], mono:["JetBrains Mono","monospace"] },
    maxWidth:{ content:"768px", container:"1152px" },
    boxShadow:{ glow:"0 18px 70px rgba(6,91,217,.18)" }
  }},
  plugins:[]
};
export default config;
