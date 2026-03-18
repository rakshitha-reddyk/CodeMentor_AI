import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Send,
  Paperclip,
  Trash2,
  Sparkles,
  Code,
  Bug,
  Zap,
  Brain,
  MessageCircle,
  Copy,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { getAIResponse } from "@/services/aiService";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const aiTools = [
    {
      id: "explain",
      icon: Brain,
      title: "Explain Code",
      prompt: "Explain this code in simple terms",
      color: "from-blue-500 to-cyan-500",
      lightColor: "bg-blue-500/10 border-blue-500/20",
    },
    {
      id: "fix",
      icon: Bug,
      title: "Fix Bug",
      prompt: "Find and fix the bug in this code",
      color: "from-red-500 to-pink-500",
      lightColor: "bg-red-500/10 border-red-500/20",
    },
    {
      id: "generate",
      icon: Code,
      title: "Generate Code",
      prompt: "Generate code to solve this problem",
      color: "from-purple-500 to-pink-500",
      lightColor: "bg-purple-500/10 border-purple-500/20",
    },
    {
      id: "optimize",
      icon: Zap,
      title: "Optimize Code",
      prompt: "Optimize this code for better performance",
      color: "from-amber-500 to-orange-500",
      lightColor: "bg-amber-500/10 border-amber-500/20",
    },
  ];

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto grow textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height =
        Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  }, [inputValue]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const message = inputValue;

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const aiText = await getAIResponse(message);
      const aiMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: aiText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error getting AI response:", error);
      const errorMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: `Error: ${errorMsg}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToolClick = (prompt: string) => {
    setInputValue(prompt);
    inputRef.current?.focus();
  };

  const handleClearChat = () => {
    setMessages([]);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex gap-6 h-full">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">AI Chat</h1>
          <p className="text-lg text-muted-foreground">
            Ask CodeMentor AI anything about coding
          </p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-4 min-h-[400px]">
          {messages.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center h-full py-20">
              <div className="p-4 rounded-2xl bg-brand-primary/10 mb-6">
                <MessageCircle className="w-16 h-16 text-brand-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-center">
                Ask anything to CodeMentor AI
              </h3>
              <p className="text-muted-foreground text-center max-w-md mb-8">
                Get help with code explanations, debugging, performance
                optimization, and more
              </p>
              <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                {aiTools.map((tool) => {
                  const IconComponent = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => handleToolClick(tool.prompt)}
                      className={`p-3 rounded-lg border transition-all hover:scale-105 ${tool.lightColor} text-left`}
                    >
                      <IconComponent className="w-5 h-5 mb-2" />
                      <p className="text-sm font-medium">{tool.title}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            // Chat Messages
            messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white flex-shrink-0 mt-1">
                    <Sparkles className="w-5 h-5" />
                  </div>
                )}

                <div
                  className={`max-w-xl lg:max-w-2xl rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-brand-primary to-brand-secondary text-white rounded-br-none"
                      : "bg-surface-elevated border border-border/50 text-foreground rounded-bl-none"
                  }`}
                >
                  <p className="text-sm md:text-base leading-relaxed">
                    {message.content}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs opacity-60">
                    <span>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {message.role === "assistant" && (
                  <div className="flex gap-2 mt-1">
                    <button className="p-1.5 hover:bg-surface-elevated rounded-lg transition-colors">
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                )}

                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0 mt-1">
                    <span className="text-sm font-semibold">U</span>
                  </div>
                )}
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex gap-3 animate-in fade-in duration-300">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="bg-surface-elevated border border-border/50 rounded-2xl rounded-bl-none px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="space-y-3 border-t border-border/50 pt-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about JavaScript, React, Python, algorithms..."
                className="w-full px-4 py-3 rounded-xl bg-surface-elevated/50 border border-border/50 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 transition-all resize-none"
                rows={1}
              />
              <button className="absolute right-3 bottom-3 p-1.5 hover:bg-surface-elevated rounded-lg transition-colors">
                <Paperclip className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:shadow-lg hover:shadow-brand-primary/40 text-white border-0 rounded-lg h-full px-6 font-medium"
              >
                <Send className="w-4 h-4" />
              </Button>
              {messages.length > 0 && (
                <Button
                  onClick={handleClearChat}
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 rounded-lg px-4"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - AI Tools */}
      <div className="hidden xl:block w-72 space-y-6">
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-primary" />
            AI Tools
          </h3>
          <div className="space-y-3">
            {aiTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => handleToolClick(tool.prompt)}
                  className={`w-full p-4 rounded-xl border transition-all hover:shadow-lg group text-left ${tool.lightColor}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-br ${tool.color} bg-opacity-20`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-sm">{tool.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {tool.prompt}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tips Section */}
        <Card className="gradient-card border-card-border bg-surface-elevated/50">
          <CardContent className="pt-4 space-y-3">
            <h4 className="font-semibold text-sm">Tips</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-brand-primary font-bold">•</span>
                <span>Use Shift+Enter for a new line</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand-primary font-bold">•</span>
                <span>Share code snippets for better help</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand-primary font-bold">•</span>
                <span>Ask follow-up questions for clarity</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Usage Stats */}
        <Card className="gradient-card border-card-border bg-surface-elevated/50">
          <CardContent className="pt-4 space-y-3">
            <h4 className="font-semibold text-sm">Today</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Messages</span>
                <span className="font-semibold">{messages.length}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Tokens Used</span>
                <span className="font-semibold">
                  {messages.reduce((acc, msg) => acc + msg.content.length, 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Import missing icons
import { ArrowRight } from "lucide-react";

export default AIChat;
