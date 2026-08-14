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
  Download
} from "lucide-react";

export default function SettingsModal({
  isOpen,
  onClose,
  apiKey = "",
  onSaveApiKey,
  selectedModel = "gemini-1.5-flash",
  onSelectModel,
  systemPrompt = "",
  onSaveSystemPrompt,
  currentChat,
  allChats = [],
}) {
  const [keyInput, setKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [model, setModel] = useState("gemini-1.5-flash");
  const [sysPrompt, setSysPrompt] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync inputs whenever the modal opens or props change
  useEffect(() => {
    if (isOpen) {
      setKeyInput(apiKey || "");
      setModel(selectedModel || "gemini-1.5-flash");
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
    }, 400);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Settings & Preferences</h3>
              <p className="text-xs text-slate-400">Configure Gemini API key and model settings</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-5 space-y-5 overflow-y-auto pr-1 flex-1">
          
          {/* Gemini API Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 hover:underline font-medium"
              >
                Get Free Key in AI Studio <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Paste your key here (AIzaSy...)"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 outline-none font-mono pr-10 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                title={showKey ? "Hide key" : "Show key"}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Key is saved locally in your browser and used securely for your AI requests.
            </p>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              AI Model
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: "gemini-flash-latest", name: "Gemini Flash Latest", tag: "Fast & Recommended" },
                { id: "gemini-3.7-flash", name: "Gemini 3.7 Flash", tag: "High Intelligence" },
                { id: "gemini-3.5-flash", name: "Gemini 3.5 Flash", tag: "Fast & Stable" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModel(m.id)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    model === m.id
                      ? "bg-indigo-600/20 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/50"
                      : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-950"
                  }`}
                >
                  <div className="font-semibold text-xs text-slate-200">{m.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{m.tag}</div>
                </button>
              ))}
            </div>
          </div>

          {/* System Prompt Instruction */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              Custom System Instructions (Optional)
            </label>
            <textarea
              value={sysPrompt}
              onChange={(e) => setSysPrompt(e.target.value)}
              placeholder="e.g. You are an expert senior software engineer. Answer questions concisely with high quality code samples."
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 outline-none leading-relaxed resize-none transition-colors"
            />
          </div>

          {/* Export Options */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              Export Chats
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleExportChatMarkdown}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                Current Chat (.md)
              </button>
              <button
                type="button"
                onClick={handleExportAllJSON}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                All History (.json)
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 transition-all"
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
