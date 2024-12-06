'use client'

import { Check, Pencil } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import type { Note } from '@/types'

interface NoteCardProps {
  note: Note
  onSelect: (selected: boolean) => void
  onClick: () => void
}

export function NoteCard({ note, onSelect, onClick }: NoteCardProps) {
  return (
    <div
      className={cn(
        "group relative rounded-lg bg-[#202124] p-4 transition-all hover:ring-1 hover:ring-primary/20",
        note.selected && "ring-2 ring-blue-500 bg-[#1a1a1a]"
      )}
    >
      <div className="absolute right-2 top-2">
        <Checkbox
          checked={note.selected}
          onCheckedChange={onSelect}
          onClick={(e) => e.stopPropagation()}
          className="h-5 w-5 rounded-sm border-gray-600 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500"
        />
      </div>
      <div className="mb-4 flex items-center gap-2">
        {note.type === 'written' ? (
          <Pencil className="h-4 w-4 text-emerald-500" />
        ) : (
          <Check className="h-4 w-4 text-blue-500" />
        )}
        <span className="text-xs text-emerald-500">
          {note.type === 'written' ? 'Written Note' : 'Generated Note'}
        </span>
      </div>
      <div
        className="cursor-pointer"
        onClick={onClick}
      >
        <h3 className="mb-1 text-lg font-medium text-white">{note.title}</h3>
        <div 
          className="text-sm text-gray-400"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      </div>
    </div>
  )
}

