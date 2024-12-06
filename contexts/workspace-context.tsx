'use client'

import { createContext, useContext, useReducer } from 'react'
import type { WorkspaceState, Note, Source } from '@/types'

type Action =
  | { type: 'SET_SIDEBAR_WIDTH'; payload: number }
  | { type: 'SET_CHAT_HEIGHT'; payload: number }
  | { type: 'TOGGLE_SOURCES' }
  | { type: 'TOGGLE_CHAT' }
  | { type: 'SET_NOTE_EDITOR'; payload: boolean }
  | { type: 'SET_SELECTED_NOTE'; payload: string | null }
  | { type: 'SET_WORKSPACE_NAME'; payload: string }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'UPDATE_ALL_NOTES'; payload: { selected: boolean } }
  | { type: 'DELETE_SELECTED_NOTES' }
  | { type: 'CONVERT_NOTES_TO_SOURCE' }
  | { type: 'ADD_SOURCE'; payload: Source }
  | { type: 'UPDATE_SOURCE'; payload: Source }
  | { type: 'UPDATE_ALL_SOURCES'; payload: { selected: boolean } }

const initialState: WorkspaceState = {
  sidebarWidth: 300,
  chatHeight: 300,
  isSourcesOpen: true,
  isChatOpen: false,
  isNoteEditorOpen: false,
  selectedNote: null,
  workspaceName: 'Untitled notebook',
  notes: [],
  sources: [],
  hasSelectedNotes: false,
}

const WorkspaceContext = createContext<{
  state: WorkspaceState
  dispatch: React.Dispatch<Action>
} | null>(null)

function workspaceReducer(state: WorkspaceState, action: Action): WorkspaceState {
  switch (action.type) {
    case 'SET_SIDEBAR_WIDTH':
      return { ...state, sidebarWidth: action.payload }
    case 'SET_CHAT_HEIGHT':
      return { ...state, chatHeight: action.payload }
    case 'TOGGLE_SOURCES':
      return { ...state, isSourcesOpen: !state.isSourcesOpen }
    case 'TOGGLE_CHAT':
      return { ...state, isChatOpen: !state.isChatOpen }
    case 'SET_NOTE_EDITOR':
      return { ...state, isNoteEditorOpen: action.payload }
    case 'SET_SELECTED_NOTE':
      return { ...state, selectedNote: action.payload }
    case 'SET_WORKSPACE_NAME':
      return { ...state, workspaceName: action.payload }
    case 'ADD_NOTE':
      return { ...state, notes: [...state.notes, action.payload] }
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload.id ? action.payload : note
        ),
      }
    case 'UPDATE_ALL_NOTES':
      return {
        ...state,
        notes: state.notes.map(note => ({ ...note, selected: action.payload.selected })),
        hasSelectedNotes: action.payload.selected
      }
    case 'DELETE_SELECTED_NOTES':
      return {
        ...state,
        notes: state.notes.filter(note => !note.selected),
        hasSelectedNotes: false
      }
    case 'CONVERT_NOTES_TO_SOURCE':
      const notesToConvert = state.notes.filter(note => note.selected || !state.hasSelectedNotes)
      const newSources = notesToConvert.map(note => ({
        id: `source-${note.id}`,
        name: note.title,
        content: note.content,
        type: 'note',
        createdAt: new Date(),
        selected: false
      }))
      return {
        ...state,
        sources: [...state.sources, ...newSources],
        notes: state.notes.filter(note => !note.selected && state.hasSelectedNotes),
        hasSelectedNotes: false,
      }
    case 'ADD_SOURCE':
      return {
        ...state,
        sources: [...state.sources, action.payload],
      }
    case 'UPDATE_SOURCE':
      return {
        ...state,
        sources: state.sources.map((source) =>
          source.id === action.payload.id ? action.payload : source
        ),
      }
    case 'UPDATE_ALL_SOURCES':
      return {
        ...state,
        sources: state.sources.map(source => ({ ...source, selected: action.payload.selected })),
      }
    default:
      return state
  }
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(workspaceReducer, initialState)
  return (
    <WorkspaceContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider')
  }
  return context
}

