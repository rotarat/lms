import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Card, Form, InputGroup, Button, FormControl } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useState } from 'react'

/**
 * Presentational component for the Chat UI with open/close functionality.
 */
export function ChatWindow({ className, style, messages, input, onInputChange, onSend }) {
  const [isOpen, setIsOpen] = useState(true)

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={className} style={style}>
      <Card className={`${isOpen ? 'h-100 d-flex flex-column' : ''}`}>
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <span>AI Tutor</span>
          <Button 
            variant="outline-light" 
            size="sm" 
            onClick={toggleChat}
            className="border-0"
          >
            {isOpen ? '−' : '+'}
          </Button>
        </Card.Header>
        
        {isOpen && (
          <>
            <Card.Body className="flex-grow-1 overflow-auto p-2">
              <ul className="list-unstyled mb-0">
                {messages.map((m, i) => (
                  <li key={i} className={`mb-2 ${m.from === 'user' ? 'text-end' : ''}`}>
                    {m.type === 'markdown' ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
                    ) : (
                      <div>{m.text}</div>
                    )}
                  </li>
                ))}
              </ul>
            </Card.Body>
            
            <Form onSubmit={e => { e.preventDefault(); onSend() }} className="p-2 mt-auto">
              <InputGroup>
                <FormControl
                  type="text"
                  placeholder="Type your question..."
                  value={input}
                  onChange={onInputChange}
                />
                <Button variant="primary" type="submit">Send</Button>
              </InputGroup>
            </Form>
          </>
        )}
      </Card>
    </div>
  )
}

ChatWindow.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  messages: PropTypes.array.isRequired,
  input: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
}