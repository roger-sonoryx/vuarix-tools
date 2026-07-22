import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase:new URL("https://tools.vuarix.com"),
  title:{default:"Vuarix Tools — Ferramentas digitais sem complicação",template:"%s | Vuarix Tools"},
  description:"Ferramentas digitais rápidas, gratuitas e processadas no navegador.",
  openGraph:{title:"Vuarix Tools",description:"Ferramentas digitais sem complicação.",url:"https://tools.vuarix.com",siteName:"Vuarix Tools",locale:"pt_BR",type:"website",images:[{url:"/brand/vuarix-logo-blue.png",width:1040,height:557,alt:"Vuarix Tools"}]},
  icons:{icon:"/brand/favicon.png",apple:"/brand/icon-180.png"},
};
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="pt-BR" className="dark"><body>{children}</body></html>; }
