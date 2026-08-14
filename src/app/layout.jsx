import "highlight.js/styles/atom-one-dark.css";
import "./globals.css";

export const metadata = {
  title: "Yash AI — Intelligent, Fast & Modern AI Assistant",
  description: "Next-generation AI Assistant powered by Google Gemini SDK and MongoDB Atlas.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body className="h-full bg-[#090a0f] text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}
