"use client";

import { useState } from "react";
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Settings, 
  Search, 
  Sparkles, 
  KeyRound, 
  Check, 
  X,
  Edit2,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function Sidebar({
  conversations,
  currentId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat,
  onClearAllChats,
  onOpenSettings,
  hasApiKey,
  isOpen,
  onToggleOpen,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // Group conversations by timestamp
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 86400000;
  const lastWeekStart = todayStart - 7 * 86400000;

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groups = {
    Today: [],
    Yesterday: [],
    "Previous 7 Days": [],
    Older: [],
  };

  filtered.forEach((conv) => {
    const time = new Date(conv.updatedAt || conv.createdAt).getTime();
    if (time >= todayStart) {
      groups.Today.push(conv);
    } else if (time >= yesterdayStart) {
      groups.Yesterday.push(conv);
    } else if (time >= lastWeekStart) {
      groups["Previous 7 Days"].push(conv);
    } else {
      groups.Older.push(conv);
    }
  });

  const startRename = (conv, e) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const handleSaveRename = (id, e) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameChat(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onToggleOpen}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col w-72 md:w-80 bg-slate-950/95 border-r border-slate-800/80 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Top Header & New Chat */}
        <div className="p-4 space-y-3 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Sparkles className="w-4 h-4 text-cyan-200" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-white tracking-tight leading-none">
                  Gemini Chat
                </h2>
                <span className="text-[11px] text-slate-400">AI Assistant</span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onToggleOpen}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white md:hidden hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) onToggleOpen();
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all group"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              New Chat
            </span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
              +
            </span>
          </button>

          {/* Search Box */}
          {conversations.length > 0 && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search chats..."
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-indigo-500/50"
              />
            </div>
          )}
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {conversations.length === 0 ? (
            <div className="text-center py-10 px-4 text-slate-500 text-xs">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
              No conversations yet. Start a new chat to begin!
            </div>
          ) : (
            Object.entries(groups).map(([groupTitle, items]) => {
              if (items.length === 0) return null;
              return (
                <div key={groupTitle} className="space-y-1">
                  <div className="px-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {groupTitle}
                  </div>
                  {items.map((conv) => {
                    const isSelected = conv.id === currentId;
                    const isEditing = editingId === conv.id;

                    return (
                      <div
                        key={conv.id}
                        onClick={() => {
                          onSelectChat(conv.id);
                          if (window.innerWidth < 768) onToggleOpen();
                        }}
                        className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs transition-all ${
                          isSelected
                            ? "bg-slate-800/90 text-white font-medium shadow-sm border border-slate-700/50"
                            : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-indigo-400" : "text-slate-500"}`} />
                          
                          {isEditing ? (
                            <input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveRename(conv.id, e);
                                if (e.key === "Escape") setEditingId(null);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              autoFocus
                              className="bg-slate-900 text-white px-2 py-0.5 rounded border border-indigo-500 outline-none w-full text-xs"
                            />
                          ) : (
                            <span className="truncate">{conv.title || "Untitled Chat"}</span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={(e) => handleSaveRename(conv.id, e)}
                                className="p-1 rounded text-emerald-400 hover:bg-emerald-950/50"
                                title="Save title"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingId(null);
                                }}
                                className="p-1 rounded text-slate-400 hover:bg-slate-800"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={(e) => startRename(conv, e)}
                                className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                title="Rename chat"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteChat(conv.id);
                                }}
                                className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/30"
                                title="Delete chat"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 space-y-2">
          {conversations.length > 0 && (
            <button
              onClick={onClearAllChats}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400/80 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/30 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All Chats
            </button>
          )}

          {/* Settings & API Key trigger */}
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings & Key</span>
            </div>
            {hasApiKey ? (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Connected
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded-full font-medium">
                Set Key
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
