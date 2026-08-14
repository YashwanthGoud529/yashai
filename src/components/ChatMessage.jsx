"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import confetti from "canvas-confetti";
import YashLogo from "./YashLogo";
import { 
  User, 
  Copy, 
  Check, 
  RotateCcw, 
  Trash2, 
  Pencil, 
  Play,
  RotateCw,
  Sparkles
} from "lucide-react";

// Flat, high-contrast code block with 0 overlay and 1-click copy confetti
function CodeBlock({ node, inline, className, children, ...props }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const codeString = String(children).replace(/\n$/, "");

  const handleCopy = (e) => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);

    try {
      const rect = e.target.getBoundingClientRect();
      confetti({
        particleCount: 20,
        spread: 45,
        origin: {
          x: rect.left / window.innerWidth,
          y: rect.top / window.innerHeight,
        },
        colors: ["#3e55af", "#024dbe", "#60a5fa"],
      });
    } catch (err) {}

    setTimeout(() => setCopied(false), 2000);
  };

  if (inline) {
    return (
      <code className="bg-slate-900 text-blue-300 font-mono text-[11px] px-1.5 py-0.5 rounded-[4px] border border-[#3e55af]/40" {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="my-3 rounded-[4px] border border-slate-800 bg-[#0d1117] overflow-hidden shadow-md">
      {/* Code Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#161b22] border-b border-slate-800 text-xs">
        <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider font-semibold">
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded-[4px] hover:bg-slate-800 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <pre className="p-3.5 overflow-x-auto text-xs font-mono bg-[#0d1117] text-slate-200 leading-relaxed">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export default function ChatMessage({
  message,
  index,
  onRegenerate,
  onRecall,
  onDelete,
  onRetryUserPrompt,
  isLastAI = false,
  isLastUserWithoutAI = false,
}) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.content);

  const isUser = message.role === "user";

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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex gap-3.5 p-4 md:p-5 transition-colors ${
        isUser
          ? "bg-transparent"
          : "bg-slate-900/30 border-y border-slate-800/40"
      }`}
    >
      {/* Avatar */}
      <div className="shrink-0 pt-0.5">
        {isUser ? (
          <div className="w-7 h-7 rounded-[4px] bg-brand flex items-center justify-center text-white shadow-xs border border-[#3e55af]/50">
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
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded-[2px] bg-[#3e55af]/15 text-blue-300 border border-[#3e55af]/30 font-semibold">
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
                className="flex items-center gap-1 px-2 py-1 rounded-[4px] text-[11px] text-slate-400 hover:text-blue-300 hover:bg-slate-800 transition-colors font-normal"
                title="Recall this prompt to input composer"
              >
                <RotateCw className="w-3 h-3 text-blue-400" />
                <span>Recall</span>
              </button>
            )}

            {/* Edit User Message */}
            {isUser && (
              <button
                onClick={() => {
                  setEditText(message.content);
                  setIsEditing(!isEditing);
                }}
                className="p-1.5 rounded-[4px] text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title="Edit and resubmit prompt"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Regenerate AI answer */}
            {!isUser && isLastAI && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-1.5 rounded-[4px] text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                title="Regenerate response"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Delete message */}
            {onDelete && (
              <button
                onClick={() => onDelete(index)}
                className="p-1.5 rounded-[4px] text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
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
              className="w-full bg-slate-950 border border-[#3e55af] rounded-[4px] p-2.5 text-xs text-slate-100 outline-none leading-relaxed resize-none font-normal"
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
                className="flex items-center gap-1 px-3 py-1 rounded-[4px] bg-brand hover-bg-brand text-white text-xs font-semibold shadow-xs transition-all"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Save & Resubmit</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="chat-prose text-slate-200">
            {message.content ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  code: CodeBlock,
                }}
              >
                {message.content}
              </ReactMarkdown>
            ) : message.isStreaming ? (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                <span className="font-semibold text-slate-300">Yash AI is generating</span>
                <span className="w-1.5 h-1.5 rounded-[2px] bg-blue-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-[2px] bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-[2px] bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : null}

            {/* Live Streaming Animated Pulse Cursor with brand gradient */}
            {message.isStreaming && message.content && (
              <span className="inline-block w-2 h-3.5 ml-1 bg-brand animate-pulse rounded-[1px] align-middle shadow-xs shadow-[#024dbe]" />
            )}
          </div>
        )}

        {/* Unanswered User Prompt Fallback / Retry Prompt Button */}
        {isUser && isLastUserWithoutAI && onRetryUserPrompt && !isEditing && (
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => onRetryUserPrompt(message.content, index)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#3e55af]/20 hover:bg-[#3e55af]/30 border border-[#3e55af]/50 text-blue-200 hover:text-white text-xs font-semibold transition-all shadow-xs"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry Prompt with Yash AI</span>
            </button>
            {onRecall && (
              <button
                onClick={() => onRecall(message.content)}
                className="px-2.5 py-1.5 rounded-[4px] bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-xs font-normal transition-colors"
              >
                Recall to Input
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
