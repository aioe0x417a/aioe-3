'use client'

import { useState, useEffect } from 'react'
import { Bold, Italic, List, Type, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useWorkspace } from '@/contexts/workspace-context'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Note } from '@/types'

export function NoteEditor() {
  const { state, dispatch } = useWorkspace()
  const [title, setTitle] = useState('New note')
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start typing your note here...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none min-h-[200px] focus:outline-none'
      }
    },
  })

  useEffect(() => {
    if (state.selectedNote) {
      const selectedNote = state.notes.find(note => note.id === state.selectedNote)
      if (selectedNote) {
        setTitle(selectedNote.title)
        setCurrentNoteId(selectedNote.id)
        editor?.commands.setContent(selectedNote.content)
      }
    } else {
      setTitle('New note')
      setCurrentNoteId(null)
      editor?.commands.setContent('')
    }
  }, [state.selectedNote, state.notes, editor])

  const saveNote = () => {
    if (!editor) return

    const noteContent = editor.getHTML()
    const newNote: Note = {
      id: currentNoteId || Date.now().toString(),
      title: title,
      content: noteContent,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    if (currentNoteId) {
      dispatch({ type: 'UPDATE_NOTE', payload: newNote })
    } else {
      dispatch({ type: 'ADD_NOTE', payload: newNote })
    }

    dispatch({ type: 'SET_NOTE_EDITOR', payload: false })
  }

  if (!editor) {
    return null
  }

  return (
    <Card className="fixed inset-[10%] z-50 flex flex-col bg-background">
      <div className="flex items-center justify-between border-b p-4">
        <input
          type="text"
          placeholder="New note"
          value={title === 'New note' ? '' : title}
          onChange={(e) => setTitle(e.target.value || 'New note')}
          onFocus={() => {
            if (title === 'New note') {
              setTitle('')
            }
          }}
          onBlur={() => {
            if (title.trim() === '') {
              setTitle('New note')
            }
          }}
          className="text-xl font-semibold bg-transparent outline-none placeholder:text-muted-foreground"
        />
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBold().run()}>
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            <Type className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={saveNote}>
            Save
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch({ type: 'SET_NOTE_EDITOR', payload: false })}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <EditorContent 
        editor={editor} 
        className="flex-1 overflow-auto p-4 [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:p-4 [&_.ProseMirror]:rounded-lg [&_.ProseMirror]:transition-colors [&_.ProseMirror]:border [&_.ProseMirror]:border-input [&_.ProseMirror]:bg-background [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:focus:ring-2 [&_.ProseMirror]:focus:ring-ring [&_.ProseMirror-placeholder]:text-muted-foreground" 
      />
    </Card>
  )
}

