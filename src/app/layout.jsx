import "highlight.js/styles/atom-one-dark.css";
import "./globals.css";

export const metadata = {
  title: "Gemini AI Assistant — Fast, Intelligent & Modern",
  description: "Next-generation AI Chatbot powered by Google Gemini API and Next.js.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full">
      <body className="h-full bg-[#090a0f] text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}
