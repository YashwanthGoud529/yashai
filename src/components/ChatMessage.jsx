"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import YashLogo from "./YashLogo";
import { 
  User, 
  Copy, 
  Check, 
  RotateCcw, 
  Trash2,
  Pencil,
  ArrowUpRight,
  Play
} from "lucide-react";

function CodeBlock({ node, inline, className, children, ...props }) {
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const codeString = String(children).replace(/\n$/, "");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!inline && match) {
    return (
      <div className="my-3 rounded-[4px] border border-slate-800 bg-[#0d1117] overflow-hidden">
        {/* Sleek Minimal Header */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#161b22] border-b border-slate-800 text-xs font-mono">
          <span className="uppercase font-semibold text-indigo-400 tracking-wider text-[11px]">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs border border-slate-700/80 font-sans"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content — completely flat without weird overlays */}
        <div className="p-3.5 overflow-x-auto text-xs md:text-sm font-mono leading-relaxed text-slate-100 bg-[#0d1117]">
          <code className={className} {...props}>
            {children}
          </code>
        </div>
      </div>
    );
  }

  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
}

export default function ChatMessage({ 
  message, 
  onRegenerate, 
  onRecall,
  onDelete, 
  isLastAI,
  isLastUserWithoutAI,
  onRetryUserPrompt,
  index 
}) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.content);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && onRetryUserPrompt) {
      setIsEditing(false);
      onRetryUserPrompt(editText.trim(), index);
    }
  };

  return (
    <div
      className={`group relative flex gap-3.5 p-4 md:p-5 transition-colors ${
        isUser
          ? "bg-transparent"
          : "bg-slate-900/30 border-y border-slate-800/40"
      }`}
    >
      {/* Avatar */}
      <div className="shrink-0 pt-0.5">
        {isUser ? (
          <div className="w-7 h-7 rounded-[4px] bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <User className="w-4 h-4" />
          </div>
        ) : (
          <YashLogo size={28} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs text-slate-200">
              {isUser ? "You" : "Yash AI"}
            </span>
            {message.timestamp && (
              <span className="text-[11px] text-slate-500 font-normal">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            {!isUser && message.model && (
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded-[2px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
                {message.model}
              </span>
            )}
          </div>

          {/* Action Buttons with 4px radius */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Copy button */}
            <button
              onClick={handleCopyMessage}
              className="p-1.5 rounded-[4px] text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Copy text"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            {/* User Message Recall & Edit Button */}
            {isUser && onRecall && (
              <button
                onClick={() => onRecall(message.content)}
                className="flex items-center gap-1 px-2 py-1 rounded-[4px] text-[11px] text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors font-normal"
                title="Recall prompt into input composer"
              >
                <RotateCcw className="w-3 h-3 text-indigo-400" />
                <span>Recall</span>
              </button>
            )}

            {/* Inline Edit Prompt Button */}
            {isUser && (
              <button
                onClick={() => {
                  setIsEditing(!isEditing);
                  setEditText(message.content);
                }}
                className="p-1.5 rounded-[4px] text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title="Edit & Resubmit prompt"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}

            {/* AI Regenerate */}
            {!isUser && isLastAI && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1 px-2 py-1 rounded-[4px] text-[11px] text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors font-normal"
                title="Regenerate response"
              >
                <RotateCcw className="w-3 h-3 text-indigo-400" />
                <span>Regenerate</span>
              </button>
            )}

            {/* Delete */}
            {onDelete && (
              <button
                onClick={() => onDelete(index)}
                className="p-1.5 rounded-[4px] text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                title="Delete message"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Message Body or Inline Editor */}
        {isEditing ? (
          <div className="space-y-2 pt-1">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-indigo-500 rounded-[4px] p-2.5 text-xs text-slate-100 outline-none leading-relaxed resize-none font-normal"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-2.5 py-1 rounded-[4px] text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-normal"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex items-center gap-1 px-3 py-1 rounded-[4px] bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-all"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Save & Resubmit</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="chat-prose text-slate-200">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                code: CodeBlock,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Unanswered User Prompt Fallback / Retry Prompt Button */}
        {isUser && isLastUserWithoutAI && onRetryUserPrompt && !isEditing && (
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => onRetryUserPrompt(message.content, index)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/40 hover:border-indigo-500 text-indigo-300 hover:text-white text-xs font-semibold transition-all shadow-xs"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry Prompt with Yash AI</span>
            </button>
            {onRecall && (
              <button
                onClick={() => onRecall(message.content)}
                className="px-2.5 py-1.5 rounded-[4px] bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-normal transition-colors"
              >
                Recall to Input
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
