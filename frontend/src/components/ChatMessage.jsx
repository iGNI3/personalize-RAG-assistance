import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, Clock, Cpu, Sparkles, BookOpen } from 'lucide-react';
import { useState } from 'react';
import AIMascot from './AIMascot';
import { motion } from 'framer-motion';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Custom rich markdown rendering components inspired by Claude Web UI
  const markdownComponents = {
    h1: ({ node, ...props }) => (
      <h1 className="text-xl sm:text-2xl font-black text-white mt-6 mb-3 tracking-tight border-b border-white/10 pb-2.5 flex items-center gap-2" {...props} />
    ),
    h2: ({ node, ...props }) => (
      <h2 className="text-lg sm:text-xl font-extrabold text-cyan-300 mt-6 mb-3 tracking-tight flex items-center gap-2" {...props} />
    ),
    h3: ({ node, ...props }) => (
      <h3 className="text-base sm:text-lg font-extrabold text-indigo-300 mt-5 mb-2.5 tracking-wide flex items-center gap-1.5" {...props} />
    ),
    h4: ({ node, ...props }) => (
      <h4 className="text-sm sm:text-base font-bold text-pink-300 mt-4 mb-2 uppercase tracking-wider" {...props} />
    ),
    p: ({ node, ...props }) => (
      <p className="mb-4 text-slate-200 leading-[1.8] font-normal text-sm md:text-base last:mb-0" {...props} />
    ),
    ul: ({ node, ...props }) => (
      <ul className="list-disc pl-6 mb-5 space-y-2.5 text-slate-200 marker:text-cyan-400 marker:text-base text-sm md:text-base" {...props} />
    ),
    ol: ({ node, ...props }) => (
      <ol className="list-decimal pl-6 mb-5 space-y-2.5 text-slate-200 marker:text-indigo-400 marker:font-extrabold font-normal text-sm md:text-base" {...props} />
    ),
    li: ({ node, ...props }) => (
      <li className="leading-relaxed pl-1.5" {...props} />
    ),
    strong: ({ node, ...props }) => (
      <strong className="font-extrabold text-white text-[98%] px-0.5 rounded" {...props} />
    ),
    em: ({ node, ...props }) => (
      <em className="italic text-cyan-200/90 font-medium" {...props} />
    ),
    blockquote: ({ node, ...props }) => (
      <blockquote className="border-l-[4px] border-indigo-500 bg-gradient-to-r from-indigo-500/15 via-slate-900/40 to-transparent px-5 py-4 rounded-r-2xl my-5 text-slate-300 italic shadow-md border-y border-r border-white/5 flex flex-col gap-2" {...props}>
        <div className="flex items-center gap-1.5 not-italic text-xs font-bold text-indigo-300 uppercase tracking-widest">
          <BookOpen size={13} className="text-indigo-400" />
          <span>Extracted Knowledge Context</span>
        </div>
        <div>{props.children}</div>
      </blockquote>
    ),
    code: ({ node, inline, className, children, ...props }) => {
      if (inline) {
        return (
          <code className="bg-slate-900 border border-white/20 text-pink-300 px-2 py-0.5 rounded-lg text-xs md:text-sm font-mono font-bold shadow-sm" {...props}>
            {children}
          </code>
        );
      }
      return (
        <div className="my-4 rounded-2xl overflow-hidden border border-white/15 bg-slate-950/90 shadow-2xl">
          <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Code / Structured Data</span>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-300 font-bold">Copy</span>
          </div>
          <pre className="p-4 overflow-x-auto text-xs md:text-sm font-mono text-cyan-200 leading-relaxed">
            <code {...props}>{children}</code>
          </pre>
        </div>
      );
    },
    table: ({ node, ...props }) => (
      <div className="my-5 overflow-x-auto rounded-2xl border border-white/15 shadow-2xl bg-slate-950/70 backdrop-blur-xl">
        <table className="w-full text-left border-collapse text-sm" {...props} />
      </div>
    ),
    thead: ({ node, ...props }) => (
      <thead className="bg-slate-900 text-xs font-black uppercase tracking-wider text-slate-200 border-b border-white/20" {...props} />
    ),
    th: ({ node, ...props }) => (
      <th className="py-3.5 px-4 text-cyan-300 font-black whitespace-nowrap" {...props} />
    ),
    tbody: ({ node, ...props }) => (
      <tbody className="divide-y divide-white/10" {...props} />
    ),
    tr: ({ node, ...props }) => (
      <tr className="hover:bg-white/[0.04] transition-colors duration-150" {...props} />
    ),
    td: ({ node, ...props }) => (
      <td className="py-3 px-4 text-slate-300 leading-relaxed font-medium" {...props} />
    ),
    a: ({ node, ...props }) => (
      <a className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 font-bold transition-colors inline-flex items-center gap-1" target="_blank" rel="noopener noreferrer" {...props} />
    ),
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
      className={`message-wrapper flex items-start w-full my-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {isUser ? (
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold text-sm md:text-base px-6 py-3.5 rounded-3xl shadow-lg border border-white/25 ml-auto max-w-[80%] w-fit whitespace-pre-wrap leading-relaxed">
          {message.content}
        </div>
      ) : (
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-[28px] shadow-2xl overflow-hidden w-full max-w-[92%] text-slate-100 flex flex-col">
          {/* Card Header with Integrated Mascot */}
          <div className="flex items-center justify-between px-6 py-3.5 bg-gradient-to-r from-white/[0.07] via-white/[0.04] to-white/[0.02] border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-500 to-pink-500 p-0.5 flex items-center justify-center shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                  <AIMascot size="xs" state="idle" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-200 to-pink-300 font-black tracking-wide text-sm sm:text-base">
                  RAG Intelligence Core
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-cyan-500/15 text-cyan-300 px-2 py-0.5 rounded-full font-extrabold border border-cyan-400/30">
                  <Sparkles size={11} className="text-cyan-400" />
                  <span>Claude Synthesis Engine</span>
                </span>
              </div>
            </div>
            
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all text-xs font-bold border border-white/15 shadow-inner active:scale-95"
              title="Copy response to clipboard"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} className="text-slate-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Response Body with Claude-style rich markdown typography */}
          <div className="p-6 sm:p-8 text-sm md:text-base text-slate-100 selection:bg-cyan-500/30 selection:text-white">
            <ReactMarkdown components={markdownComponents}>
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Metrics Footer */}
          {message.metrics && (
            <div className="px-6 py-3.5 bg-slate-950/80 border-t border-white/10 flex flex-wrap gap-3 text-xs text-slate-400 items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 bg-cyan-500/15 text-cyan-300 px-3 py-1 rounded-xl border border-cyan-500/30 font-bold shadow-sm">
                  <Clock size={13} className="text-cyan-400" />
                  <span>{message.metrics.response_time_ms}ms response</span>
                </div>
                <div className="flex items-center gap-1.5 bg-indigo-500/15 text-indigo-300 px-3 py-1 rounded-xl border border-indigo-500/30 font-bold shadow-sm">
                  <Cpu size={13} className="text-indigo-400" />
                  <span>{message.metrics.model_name}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-xl border border-white/10 text-slate-300 font-medium">
                <span>Context Volume:</span>
                <span className="text-cyan-300 font-extrabold">{message.metrics.total_tokens} tokens</span>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessage;
