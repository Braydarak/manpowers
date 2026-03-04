export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export async function sendChat(
  messages: ChatMessage[],
  context?: string,
  locale?: string
): Promise<{ reply: string }> {
  const apiUrl = import.meta.env.VITE_API_URL || 'https://manpowers.es/backend/chat.php';
  
  // Basic validation
  if (!messages || messages.length === 0) {
    throw new Error('No messages to send');
  }

  // Sanitize messages (basic trim)
  const sanitizedMessages = messages.map(msg => ({
    ...msg,
    content: msg.content.trim().slice(0, 1000) // Limit content length
  }));

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: sanitizedMessages, context, locale })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Chat request failed');
  }
  return res.json();
}
