import { useState, useRef } from 'react'
import { askChatbot } from '../../../shared/api/ai'

/**
 * Hook that manages chat state and interaction with the AI API.
 */
export function useChat() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi, I am your AI tutor, ask me anything!', type: 'plain' }
  ])
  const [input, setInput] = useState('')
  const timerRef = useRef(null)

  const sendMessage = async () => {
    const text = input.trim()
    if (!text) return

    // append user message
    setMessages(ms => [...ms, { from: 'user', text, type: 'plain' }])
    // append placeholder
    setMessages(ms => [...ms, { from: 'bot', text: 'Thinking…', type: 'placeholder' }])
    setInput('')

    // after 10s change placeholder
    timerRef.current = setTimeout(() => {
      setMessages(ms =>
        ms.map(m => m.type === 'placeholder'
          ? { ...m, text: 'Typing…' }
          : m
        )
      )
    }, 10000)

    try {
      const { message_resp } = await askChatbot({ message: text })
      clearTimeout(timerRef.current)
      // replace placeholder with real response
      setMessages(ms =>
        ms.map(m => m.type === 'placeholder'
          ? { from: 'bot', text: message_resp, type: 'markdown' }
          : m
        )
      )
    } catch (err) {
      clearTimeout(timerRef.current)
      setMessages(ms =>
        ms.map(m => m.type === 'placeholder'
          ? { from: 'bot', text: 'Sorry, something went wrong.', type: 'plain' }
          : m
        )
      )
    }
  }

  return {
    messages,
    input,
    setInput,
    sendMessage
  }
}
