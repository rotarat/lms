import { useChat } from '../hooks/useChat'
import { ChatWindow } from '../components/ChatWindow'

/**
 * Container component that uses useChat and handles exam logic.
 */
export function ChatContainer() {
  const { messages, input, setInput, sendMessage } = useChat()

  return (
    <ChatWindow
      className="position-fixed bottom-0 end-0 m-3"
      style={{ width: 300, height: 400, zIndex: 1050 }}
      messages={messages}
      input={input}
      onInputChange={e => setInput(e.target.value)}
      onSend={sendMessage}
    />
  )
}
