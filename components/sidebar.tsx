'use client'

import { useRef, useState, useEffect } from 'react'
import { FileText, Plus, FileIcon, File } from 'lucide-react'
import { useWorkspace } from '@/contexts/workspace-context'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const { state, dispatch } = useWorkspace()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [isResizing, setIsResizing] = useState(false)

  const startResizing = (e: React.MouseEvent) => {
    setIsResizing(true)
  }

  const stopResizing = () => {
    setIsResizing(false)
  }

  const resize = (e: MouseEvent) => {
    if (isResizing && sidebarRef.current) {
      const newWidth = e.clientX
      if (newWidth > 200 && newWidth < 600) {
        dispatch({ type: 'SET_SIDEBAR_WIDTH', payload: newWidth })
      }
    }
  }

  useEffect(() => {
    document.addEventListener('mousemove', resize)
    document.addEventListener('mouseup', stopResizing)
    return () => {
      document.removeEventListener('mousemove', resize)
      document.removeEventListener('mouseup', stopResizing)
    }
  }, [isResizing])

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'doc':
        return <FileIcon className="h-4 w-4 text-yellow-500" />
      case 'note':
        return <File className="h-4 w-4 text-blue-400" />
      default:
        return <FileText className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div
      ref={sidebarRef}
      className="relative flex h-full flex-col border-r border-gray-800 bg-[#202124]"
      style={{ width: state.sidebarWidth }}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-white">Sources</h2>
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {state.sources.length}
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center px-4 py-2">
        <Checkbox
          id="select-all"
          checked={state.sources.every((source) => source.selected)}
          onCheckedChange={(checked) => {
            dispatch({ type: 'UPDATE_ALL_SOURCES', payload: { selected: !!checked } })
          }}
        />
        <label htmlFor="select-all" className="ml-2 text-sm text-gray-400">
          Select all sources
        </label>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {state.sources.map((source) => (
          <div
            key={source.id}
            className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-800"
          >
            <Checkbox
              checked={source.selected}
              onCheckedChange={(checked) => {
                dispatch({ type: 'UPDATE_SOURCE', payload: { ...source, selected: !!checked } })
              }}
            />
            {getSourceIcon(source.type)}
            <span className="text-sm text-gray-300 truncate">{source.name}</span>
          </div>
        ))}
      </div>

      <div
        className={cn(
          "absolute right-0 top-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-primary/10",
          isResizing && "bg-primary/10"
        )}
        onMouseDown={startResizing}
      />
    </div>
  )
}

