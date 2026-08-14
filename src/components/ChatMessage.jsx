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
  Trash2
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
  onDelete, 
  isLastAI,
  index 
}) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <button
              onClick={handleCopyMessage}
              className="p-1.5 rounded-[4px] text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Copy message"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            {!isUser && isLastAI && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-1.5 rounded-[4px] text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title="Regenerate response"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

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

        {/* Message Body */}
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
      </div>
    </div>
  );
}
