"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Mic, MicOff, Square } from "lucide-react";

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

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-3 md:pb-5">
      <div className="relative rounded-[4px] bg-slate-900/90 border border-slate-800 focus-within:border-indigo-500/70 shadow-lg transition-all duration-150 backdrop-blur-md">
        
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Yash AI anything... (Shift+Enter for new line)"
          disabled={disabled}
          rows={1}
          className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 px-3.5 pt-3 pb-11 outline-none resize-none text-xs md:text-sm leading-relaxed max-h-[180px] font-normal"
        />

        {/* Footer inside input box */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/50 pt-1.5">
          {/* Left badges */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-indigo-500/10 text-indigo-400 font-mono text-[11px] border border-indigo-500/20 font-semibold">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              {modelName}
            </span>
            <span className="hidden sm:inline-block text-[11px] text-slate-500 font-normal">
              {input.length} chars
            </span>
          </div>

          {/* Right Action buttons with 4px radius */}
          <div className="flex items-center gap-1.5">
            {/* Voice input */}
            <button
              type="button"
              onClick={toggleVoice}
              className={`p-1.5 rounded-[4px] transition-colors ${
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all"
                title="Stop generation"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!input.trim() || disabled}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[4px] bg-indigo-600 hover:bg-indigo-500 disabled:opacity-35 disabled:hover:bg-indigo-600 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <span>Send</span>
                <Send className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="text-center mt-1.5 text-[11px] text-slate-500 font-normal">
        Yash AI responses may occasionally contain inaccuracies. Verify critical details.
      </div>
    </div>
  );
}
