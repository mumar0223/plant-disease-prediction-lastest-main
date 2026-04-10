"use client";

import { useState, useRef, useEffect } from "react";
import { mode } from "@/lib/model";
import { SendHorizonal, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function Chatbot({ disease }: { disease: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = { role: "user" as const, content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(`/api/chat_${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disease,
          messages: [...messages, userMessage],
        }),
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let loop = true;
      while (loop) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        assistantMessage += chunk;

        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = assistantMessage;
          return newMessages;
        });
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I had trouble processing that." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="border border-[var(--border)] rounded-xl flex flex-col h-full overflow-hidden bg-[var(--bg)] shadow-inner">
      <div className="bg-[var(--leaf-light)] px-4 py-3 border-b border-[var(--border)] flex items-center gap-2 text-[var(--leaf)]">
        <Bot size={18} />
        <span className="font-semibold text-[14px]">Agro Assistant</span>
      </div>

      <div
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-4"
        ref={scrollRef}
      >
        {messages.length === 0 && (
          <div className="text-center text-[13px] text-[var(--ink3)] mt-10">
            Ask me anything about {disease}...
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex shrink-0 flex-col items-center justify-center text-white ${msg.role === "user" ? "bg-[var(--ink2)]" : "bg-[var(--leaf)]"}`}
            >
              {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div
              className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed ${
                msg.role === "user"
                  ? "bg-[var(--leaf)] text-white rounded-tr-sm"
                  : "bg-white border border-[var(--border)] text-[var(--ink)] rounded-tl-sm shadow-sm"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-[15px] prose-headings:m-0 prose-p:my-1 prose-ul:my-1 prose-li:my-0 pb-1">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-[var(--leaf)] flex shrink-0 flex-col items-center justify-center text-white">
              <Bot size={16} />
            </div>
            <div className="px-5 py-3 rounded-2xl bg-white border border-[var(--border)] rounded-tl-sm shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[var(--leaf-mid)] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-[var(--leaf-mid)] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-[var(--leaf-mid)] rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSend}
        className="p-3 bg-white border-t border-[var(--border)] flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${disease}...`}
          disabled={isTyping}
          className="flex-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2.5 outline-none focus:border-[var(--leaf)] transition-colors text-[14px]"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="bg-[var(--leaf)] text-white p-3 rounded-lg flex items-center justify-center disabled:opacity-50 transition-colors hover:bg-[#2d5518] border-none cursor-pointer"
        >
          <SendHorizonal size={18} />
        </button>
      </form>
    </div>
  );
}
