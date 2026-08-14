"use client";

import { useState, useEffect } from "react";
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
  Layers
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
      currentChat.messages.map((m) => `### **${m.role === 'user' ? 'User' : 'Gemini AI'}** (${new Date(m.timestamp || Date.now()).toLocaleTimeString()}):\n\n${m.content}\n\n---\n`).join("\n");
    
    const blob = new Blob([mdContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(currentChat.title || "chat").replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportAllJSON = () => {
    if (!allChats || allChats.length === 0) {
      alert("No chat history available to export.");
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allChats, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = `gemini_chats_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const modelsList = [
    {
      id: "gemini-flash-latest",
      name: "Gemini Flash Latest",
      tag: "Recommended",
      description: "Fastest response time with ultra-low latency & high throughput.",
      speed: "Fastest",
      intelligence: "High"
    },
    {
      id: "gemini-3.7-flash",
      name: "Gemini 3.7 Flash",
      tag: "Next-Gen AI",
      description: "Latest flagship reasoning capabilities and complex problem solving.",
      speed: "Very Fast",
      intelligence: "Very High"
    },
    {
      id: "gemini-3.5-flash",
      name: "Gemini 3.5 Flash",
      tag: "Stable Flash",
      description: "Balanced performance, ideal for general tasks & high frequency prompts.",
      speed: "Fast",
      intelligence: "High"
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl rounded-[4px] bg-[#0d1117] border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#161b22] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[4px] bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4 text-cyan-200" />
            </div>
            <div>
              <h3 className="font-semibold text-xs text-white uppercase tracking-wider">
                System Preferences
              </h3>
              <p className="text-[11px] text-slate-400 font-normal">Manage AI models, credentials & conversation data</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-[4px] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-800 bg-[#0d1117] px-5 pt-2 shrink-0 gap-1 overflow-x-auto">
          {[
            { id: "model", label: "AI Model & Engine", icon: Cpu },
            { id: "keys", label: "API Credentials", icon: KeyRound },
            { id: "system", label: "System Prompts", icon: Terminal },
            { id: "export", label: "Data & Export", icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs transition-all border-b-2 font-semibold whitespace-nowrap ${
                  isActive
                    ? "border-indigo-500 text-white bg-slate-800/40 rounded-t-[4px]"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 rounded-t-[4px] font-normal"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          
          {/* TAB 1: AI Model */}
          {activeTab === "model" && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">Select Active Model</h4>
                  <p className="text-[11px] text-slate-400 font-normal">Choose which Gemini model powers your conversations</p>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded-[4px] font-semibold">
                  Free Tier Eligible
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {modelsList.map((m) => {
                  const isSelected = model === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setModel(m.id)}
                      className={`relative p-3.5 rounded-[4px] text-left border transition-all flex items-start justify-between ${
                        isSelected
                          ? "bg-indigo-950/20 border-indigo-500 shadow-xs ring-1 ring-indigo-500/40"
                          : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                      }`}
                    >
                      <div className="space-y-1 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-white">{m.name}</span>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded-[2px] bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold">
                            {m.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-normal leading-relaxed">
                          {m.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 pt-0.5">
                        <div className="hidden sm:flex flex-col items-end text-[10px] font-mono text-slate-500">
                          <span>Speed: <strong className="text-slate-300 font-semibold">{m.speed}</strong></span>
                          <span>IQ: <strong className="text-slate-300 font-semibold">{m.intelligence}</strong></span>
                        </div>
                        <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center ${
                          isSelected ? "bg-indigo-600 border-indigo-500 text-white" : "border-slate-700 bg-slate-950"
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: API Credentials */}
          {activeTab === "keys" && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-white">Gemini API Credentials</h4>
                <p className="text-[11px] text-slate-400 font-normal">Connect your free API key from Google AI Studio</p>
              </div>

              <div className="p-3.5 rounded-[4px] bg-slate-900/60 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Client-Side Key Storage
                  </span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 hover:underline font-semibold"
                  >
                    Open Google AI Studio <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="AQ.Ab8RN6I7aHITKxz..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-[4px] px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 outline-none font-mono pr-9 transition-colors font-normal"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                    title={showKey ? "Hide key" : "Show key"}
                  >
                    {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Status: {keyInput ? <strong className="text-emerald-400 font-semibold">Key Configured</strong> : <strong className="text-amber-400 font-semibold">No Key Provided</strong>}</span>
                  <span>Environment fallback: <code className="text-slate-400 font-mono">.env.local</code></span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: System Prompts */}
          {activeTab === "system" && (
            <div className="space-y-3.5">
              <div>
                <h4 className="text-xs font-semibold text-white">Custom System Persona & Instructions</h4>
                <p className="text-[11px] text-slate-400 font-normal">Shape the tone, style, and behavior of Gemini across all responses</p>
              </div>

              {/* Quick Presets */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Quick Presets
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SYSTEM_PROMPT_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSysPrompt(p.prompt)}
                      className="px-2.5 py-1 rounded-[4px] bg-slate-900 border border-slate-800 hover:border-indigo-500/60 text-[11px] text-slate-300 hover:text-white transition-colors font-normal"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={sysPrompt}
                onChange={(e) => setSysPrompt(e.target.value)}
                placeholder="e.g. You are an expert senior software engineer. Answer questions concisely with high quality code samples."
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-[4px] p-3 text-xs text-slate-200 placeholder:text-slate-600 outline-none leading-relaxed resize-none transition-colors font-normal font-mono"
              />
            </div>
          )}

          {/* TAB 4: Data & Export */}
          {activeTab === "export" && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-white">Data Portability & Export</h4>
                <p className="text-[11px] text-slate-400 font-normal">Download and archive your chat logs anytime</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-[4px] bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span>Current Conversation</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-normal">
                    Export the active chat with Markdown syntax and code blocks.
                  </p>
                  <button
                    type="button"
                    onClick={handleExportChatMarkdown}
                    className="w-full py-1.5 px-3 rounded-[4px] bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download .md
                  </button>
                </div>

                <div className="p-3.5 rounded-[4px] bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Full History Archive</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-normal">
                    Export all ({allChats.length}) conversations as structured JSON.
                  </p>
                  <button
                    type="button"
                    onClick={handleExportAllJSON}
                    className="w-full py-1.5 px-3 rounded-[4px] bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download .json
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-slate-800 bg-[#161b22] flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 font-normal">
            Changes are saved to local session
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-[4px] text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-normal"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-[4px] bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-all"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Preferences</span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
