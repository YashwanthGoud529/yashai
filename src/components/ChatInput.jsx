"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Sparkles, 
  Mic, 
  MicOff, 
  Square, 
  Code, 
  Lightbulb, 
  FileText,
  CornerDownLeft
} from "lucide-react";

export default function ChatInput({ 
  onSendMessage, 
  loading, 
  onStop,
  modelName = "gemini-flash-latest",
  disabled = false,
  externalInput = "",
  onClearExternalInput
}) {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  // Sync external recalled input
  useEffect(() => {
    if (externalInput) {
      setInput(externalInput);
      if (onClearExternalInput) onClearExternalInput();
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(externalInput.length, externalInput.length);
        }
      }, 50);
    }
  }, [externalInput, onClearExternalInput]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 180);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  // Speech recognition initialization
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!input.trim() || loading || disabled) return;
    onSendMessage(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleInsertPrefix = (prefix) => {
    setInput((prev) => {
      const newText = prev ? `${prefix} ${prev}` : `${prefix} `;
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newText.length, newText.length);
        }
      }, 50);
      return newText;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pb-3 sm:pb-5">
      
      {/* Quick Prompt Modifier Chips (Kokonut UI style) */}
      <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          type="button"
          onClick={() => handleInsertPrefix("Explain this step by step:")}
          className="flex items-center gap-1 px-2.5 py-1 rounded-[4px] bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-indigo-300 text-[11px] font-normal transition-colors whitespace-nowrap"
        >
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>Explain Step-by-Step</span>
        </button>

        <button
          type="button"
          onClick={() => handleInsertPrefix("Write clean code with comments for:")}
          className="flex items-center gap-1 px-2.5 py-1 rounded-[4px] bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-blue-300 text-[11px] font-normal transition-colors whitespace-nowrap"
        >
          <Code className="w-3 h-3 text-blue-400" />
          <span>Write Code</span>
        </button>

        <button
          type="button"
          onClick={() => handleInsertPrefix("Summarize the key takeaways of:")}
          className="flex items-center gap-1 px-2.5 py-1 rounded-[4px] bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-emerald-300 text-[11px] font-normal transition-colors whitespace-nowrap"
        >
          <FileText className="w-3 h-3 text-emerald-400" />
          <span>Summarize</span>
        </button>
      </div>

      {/* Floating Glassmorphic Input Composer */}
      <motion.div 
        animate={{ 
          borderColor: isFocused ? "rgba(99, 102, 241, 0.6)" : "rgba(30, 41, 59, 0.8)",
          boxShadow: isFocused ? "0 8px 30px -10px rgba(99, 102, 241, 0.25)" : "0 4px 20px -5px rgba(0, 0, 0, 0.5)"
        }}
        className="relative rounded-[4px] bg-slate-900/90 border transition-all duration-200 backdrop-blur-md overflow-hidden"
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Yash AI anything... (Enter to send, Shift+Enter for new line)"
          disabled={disabled}
          rows={1}
          className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 px-3.5 pt-3 pb-11 outline-none resize-none text-xs sm:text-sm leading-relaxed max-h-[180px] font-normal"
        />

        {/* Footer inside input box */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/60 pt-1.5">
          {/* Left Badges */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-indigo-500/10 text-indigo-400 font-mono text-[11px] border border-indigo-500/20 font-semibold">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              {modelName}
            </span>
            <span className="hidden sm:inline-block text-[11px] text-slate-500 font-normal">
              {input.length} chars
            </span>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-1.5">
            {/* Voice input with pulsing wave */}
            <button
              type="button"
              onClick={toggleVoice}
              className={`p-1.5 rounded-[4px] transition-colors relative ${
                isListening
                  ? "bg-rose-600 text-white animate-pulse"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
              title={isListening ? "Listening... click to stop" : "Voice input"}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>

            {/* Send / Stop */}
            {loading ? (
              <button
                type="button"
                onClick={onStop}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all animate-pulse"
                title="Stop generation"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>Stop</span>
              </button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleSubmit}
                disabled={!input.trim() || disabled}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[4px] bg-indigo-600 hover:bg-indigo-500 disabled:opacity-35 disabled:hover:bg-indigo-600 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <span>Send</span>
                <CornerDownLeft className="w-3 h-3" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="text-center mt-1.5 text-[11px] text-slate-500 font-normal">
        Yash AI streams real-time responses with MongoDB Atlas Cloud. Verify critical facts.
      </div>
    </div>
  );
}
