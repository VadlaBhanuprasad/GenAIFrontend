import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { User, Bot, Heart } from 'lucide-react';

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
  const isDiya = selectedMode === 'truelover';

  return (
    <div className={`py-6 px-4 sm:py-8 sm:px-6 md:px-8 w-full ${isUser ? "bg-white" : "bg-gray-50 border-y border-gray-200"}`}>
      <div className={`max-w-7xl mx-auto flex gap-3 sm:gap-6 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        <div className="flex-shrink-0 flex items-start justify-center">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 ring-1 ring-indigo-200 shadow-sm">
              <User size={18} strokeWidth={2.5} />
            </div>
          ) : (
            <div className={`w-8 h-8 rounded-full text-white shadow-sm flex items-center justify-center ${isDiya ? 'bg-pink-500' : 'bg-[#10a37f]'}`}>
              {isDiya ? <Heart size={16} strokeWidth={2.5} /> : <Bot size={18} strokeWidth={2.5} />}
            </div>
          )}
        </div>
        <div className={`flex-1 space-y-2 overflow-hidden prose prose-slate max-w-none text-gray-800 break-words ${isUser ? "text-right" : ""}`}>
          {!isUser && isDiya && (
            <div className="text-xs font-semibold text-pink-500 -mt-1 mb-1 tracking-wide">Diya</div>
          )}
          {isUser ? (
            <div className="whitespace-pre-wrap flex justify-end">
              <div className="bg-gray-100 px-5 py-3 rounded-2xl rounded-tr-sm inline-block text-left text-[15px] max-w-2xl">
                {message.content}
              </div>
            </div>
          ) : isWaiting ? (
            /* ── Three-dot bouncing loader while waiting for first token ── */
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', height: '32px' }}>
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
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
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex flex-col gap-3">
                  <div className="flex">
                    <button 
                      onClick={onRetry}
                      className="px-3 py-1.5 bg-white border border-red-300 text-red-700 text-xs font-semibold rounded-md hover:bg-red-50 transition-colors shadow-sm"
                    >
                      Retry Now
                    </button>
                  </div>
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
