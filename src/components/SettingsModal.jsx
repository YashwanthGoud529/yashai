"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  KeyRound, 
  Cpu, 
  Sliders, 
  FileText, 
  ExternalLink, 
  Check, 
  Eye, 
  EyeOff, 
  Sparkles,
  Download,
  ShieldCheck,
  Zap,
  Terminal,
  Layers,
  Database
} from "lucide-react";

const SYSTEM_PROMPT_PRESETS = [
  {
    label: "Senior Software Engineer",
    prompt: "You are an expert senior software engineer. Provide clean, concise, modern, and production-ready code with minimal unnecessary commentary.",
  },
  {
    label: "Concise & Direct",
    prompt: "You are a direct, concise AI assistant. Answer queries in bullet points with high precision and zero fluff.",
  },
  {
    label: "Code Reviewer",
    prompt: "You are a strict code reviewer. Analyze code for security vulnerabilities, edge cases, performance bottlenecks, and best practices.",
  },
  {
    label: "Startup Strategist",
    prompt: "You are a seasoned Silicon Valley tech strategist. Provide actionable, high-growth startup insights and product advice.",
  }
];

export default function SettingsModal({
  isOpen,
  onClose,
  apiKey = "",
  onSaveApiKey,
  selectedModel = "gemini-flash-latest",
  onSelectModel,
  systemPrompt = "",
  onSaveSystemPrompt,
  currentChat,
  allChats = [],
}) {
  const [activeTab, setActiveTab] = useState("model");
  const [keyInput, setKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [model, setModel] = useState("gemini-flash-latest");
  const [sysPrompt, setSysPrompt] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setKeyInput(apiKey || "");
      setModel(selectedModel || "gemini-flash-latest");
      setSysPrompt(systemPrompt || "");
      setSavedSuccess(false);
    }
  }, [isOpen, apiKey, selectedModel, systemPrompt]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (onSaveApiKey) onSaveApiKey(keyInput.trim());
    if (onSelectModel) onSelectModel(model);
    if (onSaveSystemPrompt) onSaveSystemPrompt(sysPrompt.trim());
    
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 350);
  };

  const handleExportChatMarkdown = () => {
    if (!currentChat || !currentChat.messages || currentChat.messages.length === 0) {
      alert("No messages in the current conversation to export.");
      return;
    }
    const mdContent = `# ${currentChat.title || "Chat Export"}\n\n` +
      currentChat.messages.map((m) => `### **${m.role === 'user' ? 'User' : 'Yash AI'}** (${new Date(m.timestamp || Date.now()).toLocaleTimeString()}):\n\n${m.content}\n\n---\n`).join("\n");
    
    const blob = new Blob([mdContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(currentChat.title || "chat").replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportAllJSON = () => {
    if (allChats.length === 0) {
      alert("No conversations found to export.");
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allChats, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = `yash_ai_all_chats_${Date.now()}.json`;
    a.click();
  };

  const tabs = [
    { id: "model", label: "Model & AI", icon: Cpu },
    { id: "key", label: "API Key", icon: KeyRound },
    { id: "prompt", label: "System Persona", icon: Sliders },
    { id: "data", label: "Cloud & Export", icon: Database },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg rounded-[4px] bg-[#0d1117] border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#161b22]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-[4px] bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-xs text-white uppercase tracking-wider">
                Yash AI Configuration
              </h3>
              <p className="text-[11px] text-slate-400 font-normal">
                Models, API keys, persona instructions, and MongoDB Cloud
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-[4px] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation (Kokonut / Shadcn style) */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950 px-3 pt-2 gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-[4px] transition-all relative border-t border-x ${
                  isActive
                    ? "bg-[#0d1117] text-white border-slate-800 border-b-transparent"
                    : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* TAB 1: Model Selection */}
          {activeTab === "model" && (
            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-200 block mb-1">
                  Active Intelligence Engine
                </label>
                <p className="text-slate-400 text-[11px] leading-relaxed font-normal">
                  Select the Google Gemini model powering real-time streaming answers:
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    id: "gemini-flash-latest",
                    title: "Gemini Flash Latest (Recommended)",
                    desc: "Ultra-fast response streaming with latest reasoning optimizations.",
                    badge: "Fastest",
                  },
                  {
                    id: "gemini-3.7-flash",
                    title: "Gemini 3.7 Flash",
                    desc: "Next-gen hybrid reasoning with deep multi-turn context.",
                    badge: "Advanced",
                  },
                  {
                    id: "gemini-3.5-flash",
                    title: "Gemini 3.5 Flash",
                    desc: "High throughput balance for large documents and code generation.",
                    badge: "Balanced",
                  },
                ].map((m) => {
                  const isSelected = model === m.id;
                  return (
                    <motion.div
                      key={m.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setModel(m.id)}
                      className={`p-3 rounded-[4px] border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-indigo-950/30 border-indigo-500 text-white shadow-xs"
                          : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-semibold">
                          <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-indigo-400" : "bg-slate-600"}`} />
                          <span>{m.title}</span>
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
                          {m.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 pl-4 font-normal">
                        {m.desc}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: API Key */}
          {activeTab === "key" && (
            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-200 block mb-1">
                  Google AI Studio API Key
                </label>
                <p className="text-slate-400 text-[11px] leading-relaxed font-normal">
                  Your custom key is encrypted with client-side AES. If left blank, the app uses your server `.env.local` key.
                </p>
              </div>

              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-[4px] pl-3 pr-9 py-2 text-xs font-mono text-slate-200 placeholder:text-slate-600 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                >
                  {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold hover:underline"
              >
                <span>Get a free Google Gemini API Key from Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* TAB 3: System Prompt / Persona */}
          {activeTab === "prompt" && (
            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-200 block mb-1">
                  System Persona & Instructions
                </label>
                <p className="text-slate-400 text-[11px] leading-relaxed font-normal">
                  Instruct Yash AI on behavior, tone, response formatting, or coding standards:
                </p>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-1.5">
                {SYSTEM_PROMPT_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setSysPrompt(preset.prompt)}
                    className="px-2.5 py-1 rounded-[4px] bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] text-slate-300 hover:text-indigo-300 transition-colors font-normal"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>

              <textarea
                value={sysPrompt}
                onChange={(e) => setSysPrompt(e.target.value)}
                rows={4}
                placeholder="e.g. You are a senior frontend engineer. Always provide modular React code..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-[4px] p-2.5 text-xs text-slate-200 placeholder:text-slate-600 outline-none leading-relaxed resize-none font-normal"
              />
            </div>
          )}

          {/* TAB 4: Cloud & Data Export */}
          {activeTab === "data" && (
            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-200 block mb-1">
                  Cloud Database & Export
                </label>
                <p className="text-slate-400 text-[11px] leading-relaxed font-normal">
                  Your chat history is synced to MongoDB Atlas. You can also export offline backups anytime:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleExportChatMarkdown}
                  className="flex items-center justify-between p-3 rounded-[4px] bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 text-xs font-semibold transition-colors text-left"
                >
                  <div>
                    <div>Export Current Chat</div>
                    <span className="text-[10px] text-slate-400 font-normal">Markdown (.md) format</span>
                  </div>
                  <Download className="w-4 h-4 text-indigo-400" />
                </button>

                <button
                  type="button"
                  onClick={handleExportAllJSON}
                  className="flex items-center justify-between p-3 rounded-[4px] bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 text-xs font-semibold transition-colors text-left"
                >
                  <div>
                    <div>Export All History</div>
                    <span className="text-[10px] text-slate-400 font-normal">JSON backup format</span>
                  </div>
                  <Download className="w-4 h-4 text-purple-400" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-[#161b22] flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Settings saved encrypted</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-[4px] text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-normal"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-[4px] bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
