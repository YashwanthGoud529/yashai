# 🚀 Gemini AI Chatbot — Full Stack Next.js Application

A modern, responsive ChatGPT-style AI Chatbot built using **Next.js (App Router, JavaScript/JSX)**, **Tailwind CSS**, **Google Gemini API (`@google/genai`)**, and **MongoDB Atlas**.

---

## ✨ Features

- 🤖 **Google Gemini API Integration**: Multi-turn conversation memory with support for latest Gemini Flash models.
- 💬 **ChatGPT-Style Dark UI**: Glassmorphic panels, responsive sidebar, auto-resizing input textarea.
- 📝 **Rich Markdown & Code Highlighting**: Syntax-highlighted code blocks with 1-click **Copy Code** button.
- 🗄️ **MongoDB Atlas Persistence**: Save, load, rename, and delete conversation history with automatic date grouping.
- ⚙️ **Custom Settings Modal**: Configure API keys, model selection, custom system instructions, and export chat to `.md` or `.json`.
- 🎙️ **Voice Input**: Web speech-to-text dictation support.
- 📱 **Mobile Responsive**: Collapsible sidebar drawer for phones and tablets.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, JavaScript/JSX)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI SDK**: [`@google/genai`](https://www.npmjs.com/package/@google/genai)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) with [Mongoose](https://mongoosejs.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Markdown**: `react-markdown`, `remark-gfm`, `rehype-highlight`

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/YashwanthGoud529/yashai.git
cd yashai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
MONGODB_URI=YOUR_MONGODB_ATLAS_URI
```
> Get your free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Deployment to Vercel

1. Push your code to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Add `GEMINI_API_KEY` and `MONGODB_URI` under **Environment Variables**.
4. Deploy!
