import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}","./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: {
    colors: {
      surface:"#0F172A", "surface-lowest":"#091120", "surface-low":"#1E293B", "surface-container":"#111827", "surface-high":"#172639", "surface-highest":"#243450", "surface-light":"#F8FAFC", "surface-dark":"#1E293B", "surface-dark-alt":"#0F172A",
      primary:"#2563EB", "primary-container":"#1D4ED8", "primary-soft":"#DBEAFE", "secondary":"#7C3AED", "secondary-container":"#8B5CF6", "action":"#2563EB", "action-soft":"#DBEAFE", "action-hover":"#1D4ED8", "border-light":"#E2E8F0", "border-dark":"#334155", muted:"#64748B", "muted-dark":"#CBD5E1", success:"#16A34A", warning:"#F59E0B", info:"#0EA5E9", error:"#DC2626",
      "feedback-error":"#DC2626", "feedback-warning":"#F59E0B", "feedback-success":"#16A34A", "feedback-info":"#0EA5E9"
    },
    fontFamily:{ sans:["Inter","Arial","sans-serif"], display:["Geist","Inter","sans-serif"], mono:["JetBrains Mono","monospace"] },
    maxWidth:{ content:"768px", container:"1152px" },
    boxShadow:{ glow:"0 18px 70px rgba(6,91,217,.18)" }
  }},
  plugins:[]
};
export default config;
