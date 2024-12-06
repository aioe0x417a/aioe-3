'use client'

import { FileUp, Plus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWorkspace } from '@/contexts/workspace-context'

export function ActionButtons() {
  const { state, dispatch } = useWorkspace()

  const handleSelectAll = () => {
    dispatch({
      type: 'UPDATE_ALL_NOTES',
      payload: { selected: !state.hasSelectedNotes }
    })
  }

  const handleDeleteSelected = () => {
    dispatch({ type: 'DELETE_SELECTED_NOTES' })
  }

  const handleConvertToSource = () => {
    dispatch({ type: 'CONVERT_NOTES_TO_SOURCE' })
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        className="flex items-center gap-2"
        onClick={() => dispatch({ type: 'SET_NOTE_EDITOR', payload: true })}
      >
        <Plus className="h-4 w-4" />
        Add note
      </Button>

      {state.hasSelectedNotes ? (
        <>
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={handleDeleteSelected}
          >
            <Trash2 className="h-4 w-4" />
            Delete notes
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={handleConvertToSource}
          >
            <FileUp className="h-4 w-4" />
            Convert selected notes to source
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={handleSelectAll}
          >
            <X className="h-4 w-4" />
            Deselect All
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="ghost"
            className="flex items-center gap-2 hover:bg-gray-800"
            onClick={handleConvertToSource}
          >
            <FileUp className="h-4 w-4" />
            Convert all notes to source
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={handleSelectAll}
          >
            Select all
          </Button>
        </>
      )}
    </div>
  )
}

