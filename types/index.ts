export interface Note {
  id: string
  title: string
  content: string
  selected?: boolean
  type: 'written' | 'generated'
  createdAt: Date
  updatedAt: Date
}

export interface Source {
  id: string
  name: string
  content: string
  type: string
  createdAt: Date
}

export interface WorkspaceState {
  sidebarWidth: number
  chatHeight: number
  isSourcesOpen: boolean
  isChatOpen: boolean
  isNoteEditorOpen: boolean
  selectedNote: string | null
  workspaceName: string
  notes: Note[]
  sources: Source[]
  hasSelectedNotes: boolean
}

