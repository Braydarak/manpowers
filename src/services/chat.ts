export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export async function sendChat(
  messages: ChatMessage[],
  context?: string,
  locale?: string
): Promise<{ reply: string }> {
  const res = await fetch('https://manpowers.es//backend/chat.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, context, locale })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Chat request failed');
  }
  return res.json();
}
