import React, { useState, useEffect, useRef } from 'react';
import { Plus, MessageSquare, Send, PanelRightClose, PanelRightOpen, ArrowRight, Loader2, FileText, Trash2, EyeOff, ShieldCheck } from 'lucide-react';
import ChatMessage from '../components/ChatMessage';
import SourceCard from '../components/SourceCard';
import { TypingIndicator } from '../components/LoadingStates';
import { api } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import AIMascot from '../components/AIMascot';
import { motion, AnimatePresence } from 'framer-motion';

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sourcesPanelOpen, setSourcesPanelOpen] = useState(true);
  
  const { isGuest } = useAuth();
  const { addToast } = useToast();
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch saved chat threads on mount if not in Guest mode
  useEffect(() => {
    if (!isGuest) {
      fetchConversations();
    } else {
      setConversations([]);
    }
  }, [isGuest]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const fetchConversations = async () => {
    try {
      const data = await api.getConversations();
      setConversations(data || []);
    } catch (err) {
      console.error("Failed to fetch chat history:", err);
    }
  };

  const handleInput = (e) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
  };

  const startNewChat = () => {
    setMessages([]);
    setInputValue('');
    setActiveId(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const loadConversation = async (id) => {
    if (isGuest) return;
    setIsLoading(true);
    try {
      const convData = await api.getConversation(id);
      setMessages(convData.messages || []);
      setActiveId(id);
    } catch (err) {
      addToast("Failed to load conversation thread", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConversation = async (e, id) => {
    e.stopPropagation();
    try {
      await api.deleteConversation(id);
      setConversations(prev => prev.filter(c => c.id !== id));
      if (activeId === id) {
        startNewChat();
      }
      addToast("Conversation deleted", "info");
    } catch (err) {
      addToast("Failed to delete conversation", "error");
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg = { role: 'user', content: inputValue.trim(), timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    
    setIsLoading(true);
    let currentConvId = activeId;

    try {
      // Step 1: In persistent mode, ensure we have a conversation created in SQLite DB
      if (!isGuest && !currentConvId) {
        const title = userMsg.content.substring(0, 35) + (userMsg.content.length > 35 ? '...' : '');
        const newConv = await api.createConversation(title);
        currentConvId = newConv.id;
        setActiveId(currentConvId);
        setConversations(prev => [newConv, ...prev]);
      }

      // Save user message to database if persistent
      if (!isGuest && currentConvId) {
        await api.saveChatMessage(currentConvId, userMsg);
      }
      
      // Step 2: Query the RAG AI Engine
      const response = await api.queryRAG(userMsg.content);
      const assistantMsg = {
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
        metrics: response.metrics,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMsg]);

      // Step 3: Save assistant AI reply to SQLite database if persistent
      if (!isGuest && currentConvId) {
        await api.saveChatMessage(currentConvId, assistantMsg);
        // Refresh conversation list to bump updated timestamps
        fetchConversations();
      }

    } catch (err) {
      addToast(err.message || 'Failed to get response', 'error');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '**Error:** Failed to communicate with the knowledge base. Please try again.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentSources = messages
    .filter(m => m.role === 'assistant' && m.sources && m.sources.length > 0)
    .pop()?.sources || [];

  return (
    <div className="chat-layout h-[calc(100vh-64px)] flex overflow-hidden">
      {/* LEFT SIDEBAR - History or Guest Sandbox Info */}
      <aside className="chat-sidebar p-4 hidden md:flex flex-col w-72 meng-sheet-side z-10 border-r border-white/10 bg-slate-950/40 backdrop-blur-2xl">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={startNewChat} 
          className="clay-btn w-full mb-6 py-3 shadow-lg font-bold flex items-center justify-center gap-2"
        >
          <Plus size={18} /> New Chat Session
        </motion.button>
        
        <div className="text-xs font-black text-slate-400 mb-3 uppercase tracking-wider px-2 flex items-center justify-between">
          <span>{isGuest ? 'Session Mode' : 'Recent Conversations'}</span>
          {!isGuest && <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-slate-300">{conversations.length}</span>}
        </div>
        
        {isGuest ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)] space-y-3 mt-1">
            <div className="flex items-center gap-2 font-extrabold text-sm text-emerald-200">
              <EyeOff className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>Private Sandbox</span>
            </div>
            <p className="text-xs text-emerald-100/80 leading-relaxed font-medium">
              You are signed in as a Guest. To protect your privacy, zero chat transcripts, prompts, or analytics are saved to the SQLite server databases.
            </p>
            <div className="pt-2 border-t border-emerald-500/20 text-[11px] font-semibold text-emerald-300/90 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>No trace left after session end.</span>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
            {conversations.length === 0 ? (
              <div className="text-sm text-slate-500 text-center py-8 italic border border-dashed border-white/10 rounded-2xl m-2 bg-white/5">
                No saved history yet.<br />
                <span className="text-xs text-slate-600 font-normal">Start asking questions below!</span>
              </div>
            ) : (
              conversations.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => loadConversation(conv.id)}
                  className={`flex items-start gap-2.5 p-3 rounded-xl text-left transition-all duration-200 cursor-pointer group relative ${
                    activeId === conv.id 
                      ? 'bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-pink-500/10 border border-cyan-400/40 text-white shadow-lg shadow-cyan-500/10' 
                      : 'hover:bg-white/5 text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <MessageSquare size={16} className={`mt-1 flex-shrink-0 transition-colors ${activeId === conv.id ? 'text-cyan-400' : 'text-slate-500 group-hover:text-indigo-400'}`} />
                  <div className="flex-1 overflow-hidden pr-6">
                    <div className="text-xs font-bold truncate tracking-wide text-slate-200 group-hover:text-white">{conv.title}</div>
                    <div className="text-[10px] text-slate-500 mt-1 font-medium flex items-center gap-2">
                      <span>{new Date(conv.timestamp).toLocaleDateString()}</span>
                      {conv.messages_count > 0 && <span className="bg-white/5 px-1.5 py-0.2 rounded text-[9px] text-slate-400">{conv.messages_count} msgs</span>}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteConversation(e, conv.id)}
                    className="absolute right-2.5 top-3 p-1 rounded-lg hover:bg-rose-500/20 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete thread"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </aside>

      {/* CENTER PANEL - Chat Area */}
      <main className="chat-main flex-1 flex flex-col relative overflow-hidden bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950/60">
        {/* Top bar inside Chat Area */}
        <div className="h-12 px-6 border-b border-white/10 bg-slate-950/50 backdrop-blur-md flex items-center justify-between z-20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-slate-300 uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span>RAG Knowledge Intelligence</span>
            </div>

            {isGuest && (
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 rounded-full font-extrabold text-[10px] flex items-center gap-1 shadow-sm">
                <EyeOff size={11} /> PRIVATE GUEST SESSION (NO HISTORY SAVED)
              </span>
            )}
          </div>

          <button 
            onClick={() => setSourcesPanelOpen(!sourcesPanelOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-xs font-bold ${
              sourcesPanelOpen 
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm' 
                : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
            title="Toggle Document Sources Panel"
          >
            <FileText size={14} className="text-pink-400" />
            <span>Sources</span>
            <span className="px-1.5 py-0.2 rounded bg-white/10 text-[11px] font-extrabold text-slate-200 ml-0.5">{currentSources.length}</span>
            {sourcesPanelOpen ? <PanelRightClose size={14} className="ml-0.5" /> : <PanelRightOpen size={14} className="ml-0.5" />}
          </button>
        </div>

        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="mb-8 flex justify-center relative"
            >
              {/* Meng To Orbiting Colorful Geometric Clay Beads */}
              <motion.div animate={{ y: [-8, 8, -8], rotate: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }} className="absolute -top-4 -left-6 w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-[0_10px_25px_rgba(245,158,11,0.5)] border border-white/40 z-20" />
              <motion.div animate={{ y: [8, -8, 8], rotate: [0, -25, 0] }} transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }} className="absolute -bottom-2 -right-6 w-11 h-11 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 shadow-[0_10px_25px_rgba(244,63,94,0.5)] border border-white/40 z-20" />
              <motion.div animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }} className="absolute -top-2 -right-3 w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-300 to-indigo-500 shadow-[0_8px_20px_rgba(34,211,238,0.4)] border border-white/40 z-20" />
              
              {/* DesignCode 3D Hexagonal / Rounded Platform */}
              <div className="w-44 h-44 rounded-[42px] bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-1.5 shadow-[0_25px_60px_rgba(124,58,237,0.45)] border border-white/30 transform rotate-3 hover:rotate-0 transition-all duration-500 flex items-center justify-center relative">
                <div className="w-full h-full bg-slate-950/90 rounded-[38px] flex items-center justify-center backdrop-blur-xl overflow-hidden shadow-inner p-4">
                  <AIMascot size="xl" state="happy" />
                </div>
              </div>
            </motion.div>

            <motion.h1 
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="text-4xl md:text-5xl font-black mb-3 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-400 tracking-tight"
            >
              How can I help you today?
            </motion.h1>

            <motion.p 
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="text-slate-400 mb-12 text-center max-w-lg text-sm md:text-base leading-relaxed font-medium"
            >
              Ask me anything about your uploaded documents. I'll dynamically retrieve insights and synthesize verified citations with complete architectural persistence.
            </motion.p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-4">
              {[
                "Summarize the key findings from the uploaded reports",
                "What are the compliance requirements for onboarding?",
                "Extract all action items from the latest knowledge docs",
                "Compare the pricing models and technical specs"
              ].map((prompt, i) => (
                <motion.button 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.3 }}
                  onClick={() => { setInputValue(prompt); inputRef.current?.focus(); }}
                  className="liquid-prompt-card meng-card group flex items-center justify-between text-left"
                >
                  <span className="text-sm font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">{prompt}</span>
                  <ArrowRight size={18} className="text-cyan-400 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0 ml-3" />
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="messages-container flex-1 overflow-y-auto p-4 md:p-6 w-full max-w-3xl mx-auto flex flex-col gap-4">
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} message={msg} />
              ))}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="message-wrapper flex items-start w-full my-2 justify-start"
                >
                  <div className="bg-slate-900/85 backdrop-blur-xl border border-cyan-500/30 px-5 py-4 rounded-2xl flex items-center gap-3.5 w-fit shadow-xl">
                    <AIMascot size="sm" state="thinking" />
                    <Loader2 size={18} className="animate-spin text-cyan-400" />
                    <span className="text-sm font-semibold text-cyan-300 tracking-wide">Synthesizing document intelligence...</span>
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 md:px-6 pb-6 bg-transparent z-20 w-full max-w-3xl mx-auto">
          <div className="liquid-glass p-2 px-5 rounded-2xl flex items-end gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/20">
            <textarea
              ref={inputRef}
              rows={1}
              placeholder="Ask a question about your knowledge base..."
              value={inputValue}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-400 font-medium focus:outline-none resize-none py-2.5 text-sm md:text-base leading-relaxed max-h-48"
            />
            <div className="pb-1">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className={`p-3 rounded-xl flex items-center justify-center transition-all ${inputValue.trim() && !isLoading ? 'bg-gradient-to-tr from-cyan-500 via-indigo-600 to-pink-500 text-white shadow-lg shadow-indigo-500/35 border border-white/30 cursor-pointer' : 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed'}`}
              >
                <Send size={18} className={inputValue.trim() && !isLoading ? 'translate-x-0.5 -translate-y-0.5 transition-transform' : ''} />
              </motion.button>
            </div>
          </div>
          <div className="text-center mt-2.5 text-[11px] font-medium text-slate-500 tracking-wide">
            AntiGravity AI OS can make mistakes. Check important document citations in the sources drawer.
          </div>
        </div>
      </main>

      {/* RIGHT PANEL - Sources */}
      <aside className={`chat-sources-panel ${!sourcesPanelOpen ? 'collapsed' : ''} hidden md:flex flex-col meng-sheet-right z-10 border-l border-white/10 bg-slate-950/40 backdrop-blur-2xl`}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-pink-400" />
            <h2 className="font-bold text-slate-200 text-sm">Active Sources</h2>
          </div>
          <span className="px-3 py-0.5 rounded-full bg-white/10 border border-white/15 text-xs font-extrabold text-slate-300 shadow-inner">{currentSources.length}</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {currentSources.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60 px-4">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-3 border border-white/10">
                <FileText size={28} className="text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-300">No sources cited yet.</p>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Submit a prompt to view live extracted excerpts from your verified document library.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {currentSources.map((source, idx) => (
                <SourceCard key={idx} source={source} index={idx} />
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default ChatPage;
