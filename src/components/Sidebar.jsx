"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import YashLogo from "./YashLogo";
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Settings, 
  Search, 
  Check, 
  X, 
  Edit2,
  LogIn,
  LogOut,
  Sparkles
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
  onOpenAuth,
  user,
  onLogout,
  hasApiKey,
  isOpen,
  onToggleOpen,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 86400000;
  const lastWeekStart = todayStart - 7 * 86400000;

  const filtered = conversations.filter((c) =>
    (c.title || "").toLowerCase().includes(searchTerm.toLowerCase())
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

  const getUserInitials = () => {
    if (!user) return "U";
    if (user.name) {
      const parts = user.name.trim().split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return user.name.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggleOpen}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col w-64 md:w-72 bg-[#0d1117] border-r border-slate-800 transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Top Header & New Chat */}
        <div className="p-3.5 space-y-2.5 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <YashLogo size={24} />
              <div>
                <h2 className="font-semibold text-xs text-white tracking-tight leading-none">
                  Yash AI
                </h2>
                <span className="text-[10px] text-slate-400 font-normal">Next-Gen Intelligence</span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onToggleOpen}
              className="p-1 rounded-[4px] text-slate-400 hover:text-white md:hidden hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* New Chat Button (Shadcn + Motion style) */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) onToggleOpen();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-[4px] bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all group"
          >
            <span className="flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              New Chat
            </span>
            <span className="text-[10px] bg-white/20 px-1 py-0.2 rounded-[2px] font-mono">
              +
            </span>
          </motion.button>

          {/* Search Box */}
          {conversations.length > 0 && (
            <div className="relative">
              <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search chats..."
                className="w-full bg-slate-900 border border-slate-800 rounded-[4px] pl-7 pr-2.5 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-indigo-500/60 font-normal"
              />
            </div>
          )}
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
          {conversations.length === 0 ? (
            <div className="text-center py-8 px-3 text-slate-500 text-xs font-normal">
              <MessageSquare className="w-6 h-6 mx-auto mb-1.5 opacity-30" />
              No conversations yet.
            </div>
          ) : (
            Object.entries(groups).map(([groupTitle, items]) => {
              if (items.length === 0) return null;
              return (
                <div key={groupTitle} className="space-y-0.5">
                  <div className="px-2 py-1 flex items-center justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    <span>{groupTitle}</span>
                    <span className="text-slate-600 font-mono text-[9px]">{items.length}</span>
                  </div>
                  {items.map((conv) => {
                    const isSelected = conv.id === currentId;
                    const isEditing = editingId === conv.id;

                    return (
                      <motion.div
                        key={conv.id}
                        layout
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => {
                          onSelectChat(conv.id);
                          if (window.innerWidth < 768) onToggleOpen();
                        }}
                        className={`group relative flex items-center justify-between px-2.5 py-2 rounded-[4px] cursor-pointer text-xs transition-all ${
                          isSelected
                            ? "bg-slate-800 text-white font-semibold shadow-xs border-l-2 border-l-indigo-500 border-y border-r border-slate-700/60"
                            : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 font-normal border-l-2 border-l-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
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
                              className="bg-slate-950 text-white px-1.5 py-0.5 rounded-[4px] border border-indigo-500 outline-none w-full text-xs"
                            />
                          ) : (
                            <span className="truncate">{conv.title || "Untitled Chat"}</span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1.5">
                          {isEditing ? (
                            <>
                              <button
                                onClick={(e) => handleSaveRename(conv.id, e)}
                                className="p-1 rounded-[4px] text-emerald-400 hover:bg-emerald-950/50"
                                title="Save title"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingId(null);
                                }}
                                className="p-1 rounded-[4px] text-slate-400 hover:bg-slate-800"
                                title="Cancel"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={(e) => startRename(conv, e)}
                                className="p-1 rounded-[4px] text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                title="Rename chat"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteChat(conv.id);
                                }}
                                className="p-1 rounded-[4px] text-slate-400 hover:text-rose-400 hover:bg-rose-950/30"
                                title="Delete chat"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer: User Profile / Auth & Settings */}
        <div className="p-2.5 border-t border-slate-800 bg-[#0d1117] space-y-1.5">
          {conversations.length > 0 && (
            <button
              onClick={onClearAllChats}
              className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-[4px] text-[11px] text-rose-400/80 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/30 transition-colors font-normal"
            >
              <Trash2 className="w-3 h-3" />
              Clear All Chats
            </button>
          )}

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center justify-between px-2.5 py-2 rounded-[4px] bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors font-normal"
          >
            <div className="flex items-center gap-2">
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Settings & Key</span>
            </div>
            {hasApiKey ? (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-1.5 py-0.5 rounded-[4px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-[2px] bg-emerald-400"></span>
                Active
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/40 border border-amber-800/40 px-1.5 py-0.5 rounded-[4px] font-semibold">
                Set Key
              </span>
            )}
          </button>

          {/* User Account / Login Block */}
          {user ? (
            <div className="flex items-center justify-between p-2 rounded-[4px] bg-slate-950 border border-slate-800 overflow-hidden">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-7 h-7 rounded-[4px] bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white text-[11px] font-semibold shadow-xs shrink-0 overflow-hidden border border-indigo-500/20">
                  {user.avatar && user.avatar.startsWith("http") ? (
                    <img 
                      src={user.avatar} 
                      alt="" 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <span>{getUserInitials()}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-white truncate leading-tight flex items-center gap-1">
                    <span>{user.name || "User"}</span>
                    {user.provider === "google" && (
                      <span className="text-[9px] px-1 rounded-[2px] bg-blue-500/20 text-blue-300 font-mono">Google</span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate leading-tight font-normal">
                    {user.email}
                  </div>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 rounded-[4px] text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-colors shrink-0 ml-1"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenAuth}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-[4px] bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 text-indigo-300 hover:text-white text-xs font-semibold transition-all shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </motion.button>
          )}
        </div>
      </aside>
    </>
  );
}
