import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ghost, X, Send, Terminal } from 'lucide-react';

const AiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "B00! Just kidding. I'm the ghost of this blog. Ask me for a tour!", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = { id: Date.now(), text: input, isBot: false };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');

    setTimeout(() => {
      let reply = "I might be a ghost, but even I love reading a good blog post! How can I help you navigate the site?";
      const lowerInput = input.toLowerCase();

      if (lowerInput.includes('post') || lowerInput.includes('write') || lowerInput.includes('create')) {
        reply = "Looking to immortalize your thoughts? Click the 'Write' button in the navigation bar to start creating a new post.";
      } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        reply = "Boo! Just kidding. Welcome to the blog. Why not check out our 'Latest Reads' on the home page?";
      } else if (lowerInput.includes('who are you') || lowerInput.includes('ghost')) {
        reply = "I am the resident Ghost of Blogs Past. I haunt this web app to help you find the best articles and write your own!";
      } else if (lowerInput.includes('read') || lowerInput.includes('article') || lowerInput.includes('blog')) {
        reply = "Head back to the Home page to scroll through all the amazing stories our authors have summoned.";
      } else if (lowerInput.includes('hack')) {
        reply = "I may look like a hacker ghost, but I'm really just here to help you blog. No hacking allowed in this sanctuary!";
      }

      setMessages((prev) => [...prev, { id: Date.now() + 1, text: reply, isBot: true }]);
    }, 800);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            drag
            dragConstraints={{ top: -500, left: -1000, right: 0, bottom: 0 }}
            dragElastic={0.2}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
               scale: 1, 
               opacity: 1,
               y: [0, -15, 0],
               x: [0, 10, -5, 0]
            }}
            transition={{ 
               scale: { duration: 0.3 },
               y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
               x: { repeat: Infinity, duration: 4, ease: "easeInOut" }
            }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 md:bottom-10 md:right-10 p-3 md:p-4 rounded-full bg-black/80 border border-green-500/50 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] hover:bg-black transition-all z-50 flex items-center justify-center cursor-move"
            title="Drag me or click me!"
          >
            <motion.div
               animate={{ opacity: [0.5, 1, 0.5] }}
               transition={{ repeat: Infinity, duration: 2 }}
            >
               <Ghost size={28} className="md:w-[36px] md:h-[36px]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hacker Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 w-auto sm:w-96 bg-black border-2 border-green-500/30 rounded-lg shadow-[0_0_30px_rgba(34,197,94,0.2)] z-50 overflow-hidden flex flex-col h-[60vh] max-h-[500px] font-mono"
          >
            {/* Header */}
            <div className="bg-green-950/50 border-b border-green-500/30 p-4 flex justify-between items-center backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="text-green-400">
                  <Terminal size={20} />
                </div>
                <span className="font-bold text-green-400 tracking-wider text-sm">GHOST.EXE</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-green-500 hover:text-green-300 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/90 text-sm">
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.isBot ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={msg.id}
                  className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div 
                    className={`max-w-[85%] p-3 rounded text-xs ${
                      msg.isBot 
                        ? 'border border-green-500/20 text-green-400 bg-green-950/20' 
                        : 'border border-gray-600 text-gray-300 bg-gray-900'
                    }`}
                  >
                    {msg.isBot && <span className="text-green-600 block mb-1 font-bold text-[10px]">root@local:~#</span>}
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-black border-t border-green-500/30">
              <form onSubmit={handleSend} className="flex space-x-2">
                <span className="text-green-500 mt-2 mr-1">{'>'}</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter command..."
                  className="flex-1 bg-transparent border-b border-green-500/30 px-2 py-1 focus:outline-none focus:border-green-500 text-green-400 transition-colors placeholder-green-800"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2 text-green-500 hover:text-green-300 transition-colors disabled:opacity-50 disabled:hover:text-green-500 shrink-0"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiAssistant;
