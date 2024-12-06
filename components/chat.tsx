'use client'

import { useState } from 'react'
import { ChevronDown, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useWorkspace } from '@/contexts/workspace-context'
import type { ChatMessage } from '@/types'

export function Chat() {
  const { state, dispatch } = useWorkspace()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (!input.trim()) return
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    }
    
    setMessages([...messages, newMessage])
    setInput('')
  }

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[900px] max-w-[calc(100%-32px)] bg-[#1a1a1a]"
      style={{ height: state.isChatOpen ? state.chatHeight : '56px' }}
    >
      <Button
        variant="ghost"
        className="w-full flex justify-between items-center px-4 h-14 hover:bg-gray-800"
        onClick={() => dispatch({ type: 'TOGGLE_CHAT' })}
      >
        <ChevronDown className="h-4 w-4" />
        <span className="text-sm text-gray-400">AI Assistant</span>
      </Button>

      {state.isChatOpen && (
        <>
          <div className="h-[calc(100%-112px)] overflow-auto p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className="rounded-lg bg-gray-800 px-4 py-2">
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-800 bg-[#1a1a1a] p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="bg-[#2a2a2a] border-gray-700"
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button size="icon" onClick={sendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

