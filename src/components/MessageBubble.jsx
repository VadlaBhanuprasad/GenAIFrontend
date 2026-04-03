import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { User, Bot, Heart, RotateCcw } from 'lucide-react';

/* ---------- Typing indicator styles (injected once) ---------- */
const typingStyles = `
  @keyframes msgBounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40%           { transform: translateY(-6px); opacity: 1; }
  }
  .typing-dot {
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: #10a37f;
    animation: msgBounce 1.2s ease-in-out infinite;
  }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
`;

if (typeof document !== 'undefined' && !document.getElementById('typing-indicator-styles')) {
  const tag = document.createElement('style');
  tag.id = 'typing-indicator-styles';
  tag.textContent = typingStyles;
  document.head.appendChild(tag);
}

/* ---------- Component ---------- */
const MessageBubble = ({ message, selectedMode, onRetry }) => {
  const isUser = message.role === "user";
  const isStreaming = message.streaming;
  const isWaiting = isStreaming && !message.content; // bot waiting for first token
  const isColdStarting = message.isColdStarting;
  const isDiya = selectedMode === 'truelover';

  return (
    <div className={`py-4 px-3 sm:py-8 sm:px-6 md:px-8 w-full ${isUser ? "bg-white" : "bg-gray-50 border-y border-gray-200"}`}>
      <div className={`max-w-7xl mx-auto flex gap-2 sm:gap-6 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        <div className="flex-shrink-0 flex items-start justify-center">
          {isUser ? (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 ring-1 ring-indigo-200 shadow-sm">
              <User size={16} className="sm:w-[18px]" strokeWidth={2.5} />
            </div>
          ) : (
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-white shadow-sm flex items-center justify-center ${isDiya ? 'bg-pink-500' : 'bg-[#10a37f]'}`}>
              {isDiya ? <Heart size={14} className="sm:w-[16px]" strokeWidth={2.5} /> : <Bot size={16} className="sm:w-[18px]" strokeWidth={2.5} />}
            </div>
          )}
        </div>
        <div className={`flex-1 space-y-1 sm:space-y-2 overflow-hidden prose prose-slate prose-sm sm:prose-base max-w-none text-gray-800 break-words ${isUser ? "text-right" : ""}`}>
          {!isUser && isDiya && (
            <div className="text-[10px] sm:text-xs font-semibold text-pink-500 -mt-1 mb-1 tracking-wide">Diya</div>
          )}
          {isUser ? (
            <div className="whitespace-pre-wrap flex justify-end">
              <div className="bg-gray-100 px-4 py-2 sm:px-5 sm:py-3 rounded-2xl rounded-tr-sm inline-block text-left text-[13px] sm:text-[15px] max-w-[85%] sm:max-w-2xl">
                {message.content}
              </div>
            </div>
          ) : isWaiting ? (
            /* ── Three-dot bouncing loader or Cold Start Message ── */
            <div className="space-y-3">
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', height: '32px' }}>
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
              {isColdStarting && (
                <div className="text-xs text-gray-500 animate-pulse bg-gray-100/50 px-3 py-1 rounded-full border border-gray-200 inline-block font-medium">
                  ☕ Waking up the server... This might take 30-50 seconds on Render free tier.
                </div>
              )}
            </div>
          ) : (
            <div>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const language = match ? match[1] : "";

                    return !inline && match ? (
                      <div className="relative group rounded-xl overflow-hidden my-4 border border-zinc-800 shadow-lg">
                        <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-xs font-sans">
                          <span>{language}</span>
                        </div>
                        <SyntaxHighlighter
                          {...props}
                          style={vscDarkPlus}
                          language={language}
                          PreTag="div"
                          className="!m-0 !p-4 !bg-zinc-950 text-sm"
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code {...props} className={`${className || ''} bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-pink-600 before:content-none after:content-none`}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>

              {message.error && (
                <div className="mt-4 space-y-3">
                  <div className={`p-3 sm:p-4 rounded-xl border ${message.isRateLimit ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-red-50 border-red-200 text-red-800'} text-xs sm:text-sm flex flex-col gap-1 sm:gap-2 max-w-xl shadow-sm`}>
                    <div className="font-semibold flex items-center gap-2">
                      {message.isRateLimit ? 'Too Many Requests' : 'Execution Error'}
                    </div>
                  </div>
                  <button
                    onClick={onRetry}
                    className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-gray-200 text-gray-700 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95 group"
                  >
                    <RotateCcw size={14} className="group-hover:rotate-[-45deg] transition-transform" />
                    <span>Try again</span>
                  </button>
                </div>
              )}

              {isStreaming && (
                <span className="inline-block w-2.5 h-4 ml-1 bg-gray-400 animate-pulse align-middle rounded-sm"></span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
