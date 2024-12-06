import { WorkspaceProvider } from '@/contexts/workspace-context'
import { Workspace } from '@/components/workspace'

export default function Home() {
  return (
    <WorkspaceProvider>
      <Workspace />
    </WorkspaceProvider>
  )
}

