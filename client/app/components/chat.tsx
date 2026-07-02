'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, FileText, ChevronDown, ExternalLink, Loader2 } from "lucide-react";
import * as React from 'react';

interface IMessage {
    role: 'assistant' | 'user';
    content?: string;
    document?: Doc[];
}

interface Doc {
    pageContent?: string;
    metadata?: {
        loc?: {
            pageNumber?: number;
        };
        source?: string;
    };
}

const ChatComponent: React.FC = () => {
    const [message, setMessage] = React.useState<string>('');
    const [messages, setMessages] = React.useState<IMessage[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [expandedDocs, setExpandedDocs] = React.useState<Record<number, boolean>>({});
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleChatMessage = async () => {
      if (!message.trim()) return;

      const userMsg = message.trim();
      setMessage("");
      setMessages((prev) => [...prev, { role: "user", content: userMsg }]);

      setLoading(true);
      try {
        // Aapka existing GET call perfect hai
        const res = await fetch(
          `http://localhost:8000/chat?message=${encodeURIComponent(userMsg)}`,
        );
        const data = await res.json();

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data?.answer, // <-- Backend ke 'answer' se match kiya
            document: data?.results, // <-- Backend ke 'results' se match kiya
          },
        ]);
      } catch (error) {
        console.error("Chat error:", error);
        const errorMsg =
          error instanceof TypeError
            ? "Failed to reach the server. Make sure the backend is running on port 8000."
            : "Sorry, something went wrong. Please try again.";
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: errorMsg,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleChatMessage();
        }
    };

    const toggleDocs = (index: number) => {
        setExpandedDocs((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    const renderContent = (content?: string) => {
        if (!content) return null;
        // Simple markdown-like rendering: split by double newlines for paragraphs
        return content.split('\n\n').map((paragraph, i) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;
            // Check for bullet points
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                const items = trimmed.split('\n').filter(l => l.trim());
                return (
                    <ul key={i} className="my-2 space-y-1">
                        {items.map((item, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm leading-relaxed text-zinc-300">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                                <span>{item.replace(/^[-*]\s*/, '')}</span>
                            </li>
                        ))}
                    </ul>
                );
            }
            // Check for numbered list
            if (/^\d+\.\s/.test(trimmed)) {
                const items = trimmed.split('\n').filter(l => l.trim());
                return (
                    <ol key={i} className="my-2 list-inside list-decimal space-y-1 text-sm leading-relaxed text-zinc-300">
                        {items.map((item, j) => (
                            <li key={j}>{item.replace(/^\d+\.\s*/, '')}</li>
                        ))}
                    </ol>
                );
            }
            return (
                <p key={i} className="my-1.5 text-sm leading-relaxed text-zinc-300">
                    {trimmed}
                </p>
            );
        });
    };

    return (
        <div className="flex h-full flex-col">
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
                {messages.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center">
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10">
                            <Bot className="h-8 w-8 text-violet-400" />
                        </div>
                        <h2 className="mb-2 text-xl font-medium text-white">Ask anything about your PDF</h2>
                        <p className="max-w-md text-center text-sm text-zinc-500">
                            Upload a document on the left, then start asking questions.
                            The AI will search through your document and provide answers.
                        </p>
                    </div>
                ) : (
                    <div className="mx-auto max-w-3xl space-y-6">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {/* Avatar */}
                                {msg.role === 'assistant' && (
                                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20">
                                        <Bot className="h-4 w-4 text-violet-400" />
                                    </div>
                                )}

                                {/* Message bubble */}
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                                        msg.role === 'user'
                                            ? 'bg-violet-500/15 text-white'
                                            : 'bg-zinc-800/50 text-zinc-300'
                                    }`}
                                >
                                    {renderContent(msg.content)}

                                    {/* Document references */}
                                    {msg.document && msg.document.length > 0 && (
                                        <div className="mt-3 border-t border-zinc-700/40 pt-2">
                                            <button
                                                onClick={() => toggleDocs(index)}
                                                className="flex items-center gap-1.5 text-xs text-violet-400 transition-colors hover:text-violet-300"
                                            >
                                                <FileText className="h-3.5 w-3.5" />
                                                <span>{msg.document.length} source{msg.document.length > 1 ? 's' : ''} referenced</span>
                                                <ChevronDown
                                                    className={`h-3 w-3 transition-transform ${
                                                        expandedDocs[index] ? 'rotate-180' : ''
                                                    }`}
                                                />
                                            </button>
                                            {expandedDocs[index] && (
                                                <div className="mt-2 space-y-2">
                                                    {msg.document.map((doc, di) => (
                                                        <div
                                                            key={di}
                                                            className="rounded-lg border border-zinc-700/30 bg-zinc-900/50 p-2.5 text-xs"
                                                        >
                                                            <div className="mb-1 flex items-center gap-2 text-zinc-500">
                                                                <FileText className="h-3 w-3" />
                                                                <span className="truncate">
                                                                    {doc.metadata?.source || 'Document'}
                                                                </span>
                                                                {doc.metadata?.loc?.pageNumber && (
                                                                    <span className="shrink-0 rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
                                                                        p. {doc.metadata.loc.pageNumber}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="leading-relaxed text-zinc-400">
                                                                {doc.pageContent?.slice(0, 200)}
                                                                {(doc.pageContent?.length ?? 0) > 200 ? '...' : ''}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* User avatar */}
                                {msg.role === 'user' && (
                                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-zinc-800">
                                        <User className="h-4 w-4 text-zinc-400" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Loading indicator */}
                        {loading && (
                            <div className="flex items-start gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20">
                                    <Bot className="h-4 w-4 text-violet-400" />
                                </div>
                                <div className="rounded-2xl bg-zinc-800/50 px-4 py-3">
                                    <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input area */}
            <div className="border-t border-zinc-800/40 px-6 py-4">
                <div className="mx-auto flex max-w-3xl items-center gap-2">
                    <Input
                        placeholder="Ask a question about your document..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 border-zinc-700/50 bg-zinc-900/50 text-sm text-white placeholder:text-zinc-500 focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20"
                    />
                    <Button
                        onClick={handleChatMessage}
                        disabled={!message.trim() || loading}
                        className="h-9 shrink-0 gap-1.5 bg-violet-500 px-4 text-white hover:bg-violet-600 disabled:opacity-40"
                    >
                        <Send className="h-4 w-4" />
                        <span>Send</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChatComponent;