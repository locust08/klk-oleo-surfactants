import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import './globals.css';
const poppins=localFont({variable:'--font-poppins',display:'swap',src:[{path:'../../public/fonts/poppins-400.ttf',weight:'400'},{path:'../../public/fonts/poppins-500.ttf',weight:'500'},{path:'../../public/fonts/poppins-600.ttf',weight:'600'},{path:'../../public/fonts/poppins-700.ttf',weight:'700'}]});
export const metadata:Metadata={title:'KLK OLEO Surfactants',description:'Global surfactant solutions from KLK OLEO.',metadataBase:new URL('https://www.klkoleo.com'),icons:{icon:'/images/brand/favicon.png'},robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" className={poppins.variable} data-scroll-behavior="smooth"><body>{children}<Script id="bugherd" src="https://www.bugherd.com/sidebarv2.js?apikey=1zcriyjxi2lgyzfihwarha" strategy="afterInteractive" async /></body></html>;}
