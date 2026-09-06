"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  flowType: string;
  systemMessage?: string;
}

export function ChatInterface({ flowType, systemMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          flowType,
        }),
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const content = await response.text();
      const assistantMessage: Message = {
        id: `assistant_${Date.now()}`,
        role: "assistant",
        content: content || "I'm processing your request...",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto flex h-[600px] max-w-2xl flex-col">
      <CardHeader className="border-b px-4 py-3">
        <CardTitle className="text-lg">
          {flowType === "SITUATION_ANALYZER"
            ? "Situation Analyzer"
            : "Document Analysis"}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-4">
          {/* Initial system message */}
          {systemMessage && messages.length === 0 && (
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="rounded-lg bg-muted px-4 py-2">
                <p className="text-sm">{systemMessage}</p>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "mb-4 flex items-start gap-3",
                message.role === "user" && "flex-row-reverse"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  message.role === "user"
                    ? "bg-primary"
                    : "bg-muted-foreground/20"
                )}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4 text-primary-foreground" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>

              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-4 py-2",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted-foreground/20">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-lg bg-muted px-4 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>

      {/* Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your situation..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
}
