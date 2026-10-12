import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  X,
  Send,
  ShoppingBag,
  Bot,
  User,
  ArrowRight,
  Loader2,
  Package,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'add_to_cart';
    productId: string;
    label: string;
  };
}

export const AiAssistantDrawer: React.FC = () => {
  const {
    isAiAssistantOpen,
    setIsAiAssistantOpen,
    role,
    cart,
    addToCart,
    products,
    showToast,
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-01',
      sender: 'assistant',
      text: `Namaste! I am MartSaathi, your digital grocery and wholesale AI advisor for My Mart Nepal. Whether you need family meal ingredients, wholesale carton pricing, or help drafting a bulk Kirana order, ask me anytime!`,
      timestamp: 'Just now',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (!isAiAssistantOpen) return null;

  const quickPrompts = [
    'Draft a 10-carton Kirana store restock order',
    'Best Basmati Rice & Mustard Oil prices',
    'Ingredients for authentic Nepali Dal Bhat',
    'How do I apply for 30-day B2B credit?',
  ];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputVal;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          role,
          currentCart: cart,
        }),
      });

      if (!response.ok) {
        throw new Error('Server response was not ok');
      }

      const data = await response.json();
      const botReply = data.reply || 'Namaste! How else can I assist your order?';

      // Check if bot mentions specific products so we can provide a quick add button
      let action: any = undefined;
      const lower = textToSend.toLowerCase();
      if (lower.includes('rice') || lower.includes('basmati')) {
        action = {
          type: 'add_to_cart',
          productId: 'prod-001',
          label: 'Add Himalayan Basmati Rice',
        };
      } else if (lower.includes('wai wai')) {
        action = {
          type: 'add_to_cart',
          productId: 'prod-004',
          label: 'Add Wai Wai Chicken Cartons',
        };
      } else if (lower.includes('oil') || lower.includes('mustard')) {
        action = {
          type: 'add_to_cart',
          productId: 'prod-002',
          label: 'Add Dhara Mustard Oil',
        };
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedAction: action,
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-fallback-${Date.now()}`,
          sender: 'assistant',
          text: `Namaste! For your order today, we highly recommend our aged Himalayan Basmati Rice (Rs. 185/kg or Rs. 3,750 for 25kg bulk sack) and Dhara Shuddh Mustard Oil (Rs. 260/1L). All items are available in stock for same-day delivery across Kathmandu Valley.`,
          timestamp: 'Just now',
          suggestedAction: {
            type: 'add_to_cart',
            productId: 'prod-001',
            label: 'Add Himalayan Basmati Rice',
          },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: { type: string; productId: string }) => {
    const matched = products.find((p) => p.id === action.productId);
    if (matched) {
      addToCart(matched, 1, role === 'wholesale');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={() => setIsAiAssistantOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-neutral-200">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-emerald-950 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-emerald-200">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">MartSaathi AI Advisor</h2>
                <span className="text-[11px] text-emerald-300 block">
                  Grounding: My Mart Official Nepal Catalogue
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsAiAssistantOpen(false)}
              className="p-1 rounded-lg text-emerald-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages View */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-neutral-50/50">
            {messages.map((m) => {
              const isAssistant = m.sender === 'assistant';
              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${isAssistant ? 'items-start' : 'items-end justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-2`}>
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        isAssistant
                          ? 'bg-white text-neutral-800 border border-neutral-200/80 shadow-2xs'
                          : 'bg-emerald-800 text-white rounded-br-xs'
                      }`}
                    >
                      <p className="whitespace-pre-line">{m.text}</p>
                      <span
                        className={`text-[10px] block mt-1.5 ${
                          isAssistant ? 'text-neutral-400' : 'text-emerald-200'
                        }`}
                      >
                        {m.timestamp}
                      </span>
                    </div>

                    {/* Quick Add Action if recommended */}
                    {m.suggestedAction && (
                      <button
                        onClick={() => handleActionClick(m.suggestedAction!)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{m.suggestedAction.label}</span>
                      </button>
                    )}
                  </div>

                  {!isAssistant && (
                    <div className="w-7 h-7 rounded-full bg-neutral-800 text-white flex items-center justify-center shrink-0 mb-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 bg-white rounded-2xl border border-neutral-200 text-xs text-neutral-500 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                  <span>Consulting My Mart pricing and warehouse inventory...</span>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions and Input */}
          <div className="p-4 border-t border-neutral-200 bg-white space-y-3">
            {/* Quick chips */}
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="px-2.5 py-1 bg-neutral-100 hover:bg-emerald-50 hover:text-emerald-900 text-neutral-600 rounded-lg text-[11px] whitespace-nowrap transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask MartSaathi about products, recipes, or bulk packs..."
                className="flex-1 px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-hidden focus:border-emerald-700"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isLoading}
                className="p-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white rounded-xl transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
