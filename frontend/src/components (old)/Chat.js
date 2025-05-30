import React, { useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm      from 'remark-gfm'
import { askChatbot } from '../api/ai'
import '../pages/Chat.css'

export default function Chat() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi, I am your AI tutor, ask me anything!', type: 'plain' }
  ])
  const [input, setInput] = useState('')
  const timerRef         = useRef(null)

  const sendMessage = async e => {
    e.preventDefault()
    if (!input.trim()) return

    // 1) append the user message
    setMessages(ms => [...ms, { from: 'user', text: input, type: 'plain' }])
    // 2) append the placeholder
    setMessages(ms => [...ms, { from: 'bot', text: 'Thinking…', type: 'placeholder' }])
    setInput('')

    // after 10s swap to "Typing…"
    timerRef.current = setTimeout(() => {
      setMessages(ms =>
        ms.map(m =>
          m.type === 'placeholder'
            ? { from: 'bot', text: 'Typing…', type: 'placeholder' }
            : m
        )
      )
    }, 10000)

    try {
      const { message_resp } = await askChatbot({ message: input })
      clearTimeout(timerRef.current)
      setMessages(ms =>
        ms.map(m =>
          m.type === 'placeholder'
            ? { from: 'bot', text: message_resp, type: 'markdown' }
            : m
        )
      )
    } catch (err) {
      console.error('Chatbot error:', err.response || err)
      setMessages(ms =>
        ms.map(m =>
          m.type === 'placeholder'
            ? { from: 'bot', text: 'Sorry, something went wrong.', type: 'plain' }
            : m
        )
      )
    }
  }

  return (
    <div className="chat-container">
      <div className="card chat-card">
        <div className="card-header bg-primary text-white">AI Tutor</div>
        <div className="card-body messages-box">
          <ul className="list-unstyled messages-list">
            {messages.map((m, i) => (
              <li key={i} className={`message ${m.from}`}>
                {m.type === 'markdown' ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.text}
                  </ReactMarkdown>
                ) : (
                  <div className="message-content">{m.text}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
        <form className="message-form" onSubmit={sendMessage}>
          <div className="input-group">
            <input
              type="text"
              className="form-control message-input"
              placeholder="Type your question..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-send">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
