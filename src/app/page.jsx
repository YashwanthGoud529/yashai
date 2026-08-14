"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import EmptyState from "../components/EmptyState";
import SettingsModal from "../components/SettingsModal";
import { 
  Menu, 
  Sparkles, 
  RotateCcw, 
  Trash2, 
  Download, 
  SlidersHorizontal,
  Plus,
  AlertCircle,
  Database
} from "lucide-react";

export default function Home() {
  const [conversations, setConversations] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dbConnected, setDbConnected] = useState(false);
  
  // User settings
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-flash-latest");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Load conversations from MongoDB on mount (fallback to localStorage)
  useEffect(() => {
    const initData = async () => {
      try {
        const savedKey = localStorage.getItem("gemini_custom_api_key");
        if (savedKey) setApiKey(savedKey);

        const savedModel = localStorage.getItem("gemini_selected_model");
        if (savedModel) setSelectedModel(savedModel);

        const savedSysPrompt = localStorage.getItem("gemini_system_prompt");
        if (savedSysPrompt) setSystemPrompt(savedSysPrompt);

        // Fetch from MongoDB
        const res = await fetch("/api/conversations");
        if (res.ok) {
          const data = await res.json();
          if (data.conversations && data.conversations.length > 0) {
            setConversations(data.conversations);
            setCurrentId(data.conversations[0].id);
            setDbConnected(!data.isOffline);
            return;
          }
        }
      } catch (err) {
        console.warn("Initial fetch notice:", err);
      }

      // Local storage fallback
      try {
        const savedChats = localStorage.getItem("gemini_ai_chats_v1");
        if (savedChats) {
          const parsed = JSON.parse(savedChats);
          setConversations(parsed);
          if (parsed.length > 0) {
            setCurrentId(parsed[0].id);
          }
        }
      } catch (e) {
        console.error("Local storage notice:", e);
      }
    };

    initData();
  }, []);

  // Save to MongoDB and localStorage helper
  const syncConversationToDb = async (conversation) => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(conversation),
      });
      if (res.ok) {
        const data = await res.json();
        setDbConnected(!data.isOffline);
      }
    } catch (e) {
      console.warn("DB sync notice:", e);
    }
  };

  // Scroll to bottom when messages update
  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations, loading]);

  // Current active conversation
  const currentConversation = conversations.find((c) => c.id === currentId);
  const messages = currentConversation ? currentConversation.messages : [];

  // Create New Chat
  const handleNewChat = () => {
    const newId = Date.now().toString();
    const newChat = {
      id: newId,
      title: "New Conversation",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    setConversations((prev) => [newChat, ...prev]);
    setCurrentId(newId);
    setErrorMessage(null);
  };

  // Select Chat
  const handleSelectChat = (id) => {
    setCurrentId(id);
    setErrorMessage(null);
  };

  // Delete single chat
  const handleDeleteChat = async (id) => {
    const filtered = conversations.filter((c) => c.id !== id);
    setConversations(filtered);
    localStorage.setItem("gemini_ai_chats_v1", JSON.stringify(filtered));
    if (currentId === id) {
      setCurrentId(filtered.length > 0 ? filtered[0].id : null);
    }

    try {
      await fetch(`/api/conversations/${id}`, { method: "DELETE" });
    } catch (e) {
      console.warn("Delete DB notice:", e);
    }
  };

  // Rename chat
  const handleRenameChat = async (id, newTitle) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
    );

    try {
      await fetch(`/api/conversations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
    } catch (e) {
      console.warn("Rename DB notice:", e);
    }
  };

  // Clear all chats
  const handleClearAllChats = async () => {
    if (confirm("Are you sure you want to delete all chat history?")) {
      setConversations([]);
      setCurrentId(null);
      localStorage.removeItem("gemini_ai_chats_v1");

      try {
        await fetch("/api/conversations", { method: "DELETE" });
      } catch (e) {
        console.warn("Clear DB notice:", e);
      }
    }
  };

  // Save API Key
  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem("gemini_custom_api_key", key);
  };

  // Save Model
  const handleSelectModel = (model) => {
    setSelectedModel(model);
    localStorage.setItem("gemini_selected_model", model);
  };

  // Save System Prompt
  const handleSaveSystemPrompt = (prompt) => {
    setSystemPrompt(prompt);
    localStorage.setItem("gemini_system_prompt", prompt);
  };

  // Send Message
  const handleSendMessage = async (userText) => {
    if (!userText.trim()) return;
    setErrorMessage(null);

    let activeChatId = currentId;
    let currentMsgs = messages;

    // If no chat exists yet, create one
    if (!activeChatId || !currentConversation) {
      activeChatId = Date.now().toString();
      const newChat = {
        id: activeChatId,
        title: userText.slice(0, 32) + (userText.length > 32 ? "..." : ""),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
      };
      setConversations((prev) => [newChat, ...prev]);
      setCurrentId(activeChatId);
      currentMsgs = [];
    }

    const userMessage = {
      role: "user",
      content: userText,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...currentMsgs, userMessage];

    const autoTitle =
      currentMsgs.length === 0
        ? userText.slice(0, 32) + (userText.length > 32 ? "..." : "")
        : currentConversation?.title || "Conversation";

    const updatedConv = {
      id: activeChatId,
      title: autoTitle,
      updatedAt: new Date().toISOString(),
      messages: updatedMessages,
    };

    setConversations((prev) =>
      prev.map((c) => (c.id === activeChatId ? updatedConv : c))
    );

    syncConversationToDb(updatedConv);

    setLoading(true);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          messages: updatedMessages,
          model: selectedModel,
          systemInstruction: systemPrompt,
          customApiKey: apiKey,
        }),
      });

      const responseText = await response.text();
      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error("Failed to parse JSON response:", responseText);
      }

      if (!response.ok || data.error) {
        if (data.isKeyMissing || response.status === 401) {
          setSettingsOpen(true);
        }
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }

      const aiMessage = {
        role: "assistant",
        content: data.reply,
        model: selectedModel,
        timestamp: new Date().toISOString(),
      };

      const finalConv = {
        id: activeChatId,
        title: autoTitle,
        updatedAt: new Date().toISOString(),
        messages: [...updatedMessages, aiMessage],
      };

      setConversations((prev) =>
        prev.map((c) => (c.id === activeChatId ? finalConv : c))
      );

      syncConversationToDb(finalConv);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Chat Error:", err);
        setErrorMessage(err.message || "Something went wrong. Please check your network connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Stop generation
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
    }
  };

  // Regenerate last AI response
  const handleRegenerate = async () => {
    if (messages.length === 0 || loading) return;
    
    let lastUserIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        lastUserIndex = i;
        break;
      }
    }

    if (lastUserIndex === -1) return;

    const trimmedMessages = messages.slice(0, lastUserIndex + 1);
    
    setConversations((prev) =>
      prev.map((c) =>
        c.id === currentId
          ? {
              ...c,
              messages: trimmedMessages,
            }
          : c
      )
    );

    setLoading(true);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          messages: trimmedMessages,
          model: selectedModel,
          systemInstruction: systemPrompt,
          customApiKey: apiKey,
        }),
      });

      const responseText = await response.text();
      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error("Failed to parse JSON response:", responseText);
      }

      if (!response.ok || data.error) {
        throw new Error(data.error || `Failed to regenerate response (${response.status})`);
      }

      const aiMessage = {
        role: "assistant",
        content: data.reply,
        model: selectedModel,
        timestamp: new Date().toISOString(),
      };

      const finalConv = {
        id: currentId,
        title: currentConversation?.title || "Conversation",
        updatedAt: new Date().toISOString(),
        messages: [...trimmedMessages, aiMessage],
      };

      setConversations((prev) =>
        prev.map((c) => (c.id === currentId ? finalConv : c))
      );

      syncConversationToDb(finalConv);
    } catch (err) {
      if (err.name !== "AbortError") {
        setErrorMessage(err.message || "Failed to regenerate response.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete message turn
  const handleDeleteMessage = (index) => {
    const updatedMessages = messages.filter((_, i) => i !== index);
    const updatedConv = {
      ...currentConversation,
      messages: updatedMessages,
    };
    setConversations((prev) =>
      prev.map((c) => (c.id === currentId ? updatedConv : c))
    );
    syncConversationToDb(updatedConv);
  };

  return (
    <div className="flex h-screen bg-[#090a0f] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar with 4px borders */}
      <Sidebar
        conversations={conversations}
        currentId={currentId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        onClearAllChats={handleClearAllChats}
        onOpenSettings={() => setSettingsOpen(true)}
        hasApiKey={Boolean(apiKey)}
        isOpen={sidebarOpen}
        onToggleOpen={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-[#090a0f] relative overflow-hidden">
        
        {/* Top Navigation Header */}
        <header className="h-12 border-b border-slate-800 px-3.5 flex items-center justify-between bg-[#0d1117] backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-[4px] text-slate-400 hover:text-white hover:bg-slate-800 md:hidden"
              title="Toggle Sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-[4px] bg-indigo-600 flex items-center justify-center text-white shadow-xs md:hidden">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="font-semibold text-xs text-slate-200 truncate max-w-[180px] sm:max-w-xs md:max-w-md">
                {currentConversation?.title || "Gemini AI Chat"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* MongoDB status badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-emerald-950/30 border border-emerald-800/40 text-emerald-400 text-[11px] font-mono font-semibold">
              <Database className="w-3 h-3 text-emerald-400" />
              <span>MongoDB Connected</span>
            </div>

            {/* Model Badge with 4px radius */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-[4px] bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-mono transition-colors font-semibold"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>{selectedModel}</span>
            </button>

            {/* Quick New Chat */}
            <button
              onClick={handleNewChat}
              className="p-1.5 rounded-[4px] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="New Chat"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Settings */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-1.5 rounded-[4px] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Settings"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Chat Messages Container */}
        <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
          {messages.length === 0 ? (
            <EmptyState onSelectPrompt={handleSendMessage} />
          ) : (
            <div className="max-w-4xl w-full mx-auto flex-1 divide-y divide-slate-800/40">
              {messages.map((msg, idx) => (
                <ChatMessage
                  key={idx}
                  index={idx}
                  message={msg}
                  onRegenerate={handleRegenerate}
                  onDelete={handleDeleteMessage}
                  isLastAI={idx === messages.length - 1 && msg.role === "assistant"}
                />
              ))}

              {/* Thinking indicator with 4px radius */}
              {loading && (
                <div className="flex gap-3.5 p-4 md:p-5 bg-slate-900/40 border-y border-slate-800/40">
                  <div className="w-7 h-7 rounded-[4px] bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xs shrink-0">
                    <Sparkles className="w-4 h-4 animate-spin text-cyan-200" />
                  </div>
                  <div className="flex-1 flex items-center gap-2 text-slate-400 text-xs">
                    <span className="font-semibold text-slate-300">Gemini is thinking</span>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-[2px] bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-[2px] bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-[2px] bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Error banner with 4px radius */}
              {errorMessage && (
                <div className="m-3.5 p-3.5 rounded-[4px] bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold text-rose-200 mb-0.5">Error processing request</div>
                    <div className="font-normal">{errorMessage}</div>
                  </div>
                  <button
                    onClick={() => setSettingsOpen(true)}
                    className="px-2.5 py-1 bg-rose-800/50 hover:bg-rose-700/60 text-rose-100 rounded-[4px] text-xs font-semibold shrink-0"
                  >
                    Open Settings
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Input Dock */}
        <div className="shrink-0 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/95 to-transparent pt-2">
          <ChatInput
            onSendMessage={handleSendMessage}
            loading={loading}
            onStop={handleStopGeneration}
            modelName={selectedModel}
            disabled={false}
          />
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        selectedModel={selectedModel}
        onSelectModel={handleSelectModel}
        systemPrompt={systemPrompt}
        onSaveSystemPrompt={handleSaveSystemPrompt}
        currentChat={currentConversation}
        allChats={conversations}
      />
    </div>
  );
}
