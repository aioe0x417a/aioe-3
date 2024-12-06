'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import type { UploadedFile } from '@/types'

interface FileUploadProps {
  onFileUpload: (file: UploadedFile) => void
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      // In a real application, you would upload the file to your server or a cloud storage service
      // For this example, we'll simulate an upload with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const uploadedFile: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file), // In a real app, this would be the URL from your server
      }

      onFileUpload(uploadedFile)
      toast({
        title: 'File uploaded successfully',
        description: `${file.name} has been added to your sources.`,
      })
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your file. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        type="file"
        onChange={handleFileChange}
        disabled={isUploading}
        className="hidden"
        id="file-upload"
      />
      <Button asChild variant="outline" disabled={isUploading}>
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? 'Uploading...' : 'Upload file'}
        </label>
      </Button>
    </div>
  )
}

