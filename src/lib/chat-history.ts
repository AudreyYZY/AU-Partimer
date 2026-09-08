type Message = { role: "user" | "assistant"; content: string };
export function boundedChatHistory(messages: Message[]): Message[] {
  const result: Message[] = [];
  let remaining = 20000;
  for (const message of messages.slice(-20).reverse()) {
    const content = message.content.trim().slice(0, Math.min(4000, remaining));
    if (!content) break;
    result.unshift({ role: message.role, content });
    remaining -= content.length;
  }
  return result;
}
