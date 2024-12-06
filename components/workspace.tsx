'use client'

import { useState, useEffect } from 'react'
import { Settings, Share } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useWorkspace } from '@/contexts/workspace-context'
import { Sidebar } from './sidebar'
import { NoteEditor } from './note-editor'
import { Chat } from './chat'
import { ActionButtons } from './action-buttons'
import { NoteCard } from './note-card'

export function Workspace() {
  const { state, dispatch } = useWorkspace()
  const [isEditingName, setIsEditingName] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault()
            dispatch({ type: 'SET_NOTE_EDITOR', payload: true })
            dispatch({ type: 'SET_SELECTED_NOTE', payload: null })
            break
          case 'f':
            e.preventDefault()
            // Implement search functionality
            console.log('Search shortcut triggered')
            break
          case '/':
            e.preventDefault()
            dispatch({ type: 'TOGGLE_CHAT' })
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dispatch])

  return (
    <div className="flex h-screen flex-col bg-[#202124]">
      <header className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
        <div className="flex items-center gap-4">
          {isEditingName ? (
            <Input
              value={state.workspaceName}
              onChange={(e) =>
                dispatch({
                  type: 'SET_WORKSPACE_NAME',
                  payload: e.target.value,
                })
              }
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
              className="h-8 w-64 bg-transparent"
            />
          ) : (
            <h1
              className="text-xl font-semibold text-white hover:cursor-pointer"
              onClick={() => setIsEditingName(true)}
            >
              {state.workspaceName}
            </h1>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="relative flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-auto p-4">
          <div className="mb-4">
            <ActionButtons />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {state.notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onSelect={(selected) => {
                  dispatch({
                    type: 'UPDATE_NOTE',
                    payload: { ...note, selected },
                  })
                }}
                onClick={() => {
                  dispatch({ type: 'SET_SELECTED_NOTE', payload: note.id })
                  dispatch({ type: 'SET_NOTE_EDITOR', payload: true })
                }}
              />
            ))}
          </div>
        </main>
      </div>

      <Chat />
      {state.isNoteEditorOpen && <NoteEditor />}
    </div>
  )
}

