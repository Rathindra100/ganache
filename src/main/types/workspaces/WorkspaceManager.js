import path from 'path'
import fs from 'fs'
import Workspace from './Workspace'
import WorkspaceSettings, { DEFAULT_WORKSPACE_NAME } from '../settings/WorkspaceSettings'

class WorkspaceManager {
  constructor(directory) {
    this.directory = directory
    this.workspaces = []
  }

  enumerateWorkspaces() {
    const workspacesDirectory = path.join(this.directory, 'workspaces')
    if (fs.existsSync(workspacesDirectory)) {
      this.workspaces = fs.readdirSync(workspacesDirectory).filter((file) => {
        return fs.lstatSync(path.join(workspacesDirectory, file)).isDirectory
      }).map((file) => {
        let settings = new WorkspaceSettings(path.join(workspacesDirectory, file), path.join(workspacesDirectory, file, "chaindata"))
        settings.bootstrap()
        const name = settings.get("name")
        return new Workspace(name)
      })
    }

    this.workspaces.push(new Workspace(DEFAULT_WORKSPACE_NAME))
  }

  bootstrap() {
    this.enumerateWorkspaces()
    for (let i = 0; i < this.workspaces.length; i++) {
      this.workspaces[i].bootstrap()
    }
  }

  getNonDefaultNames() {
    return this.workspaces
      .filter((workspace) => workspace.name !== DEFAULT_WORKSPACE_NAME)
      .map((workspace) => workspace.name)
  }

  get(name) {
    return this.workspaces.find((workspace) => name === workspace.name)
  }
}

export default WorkspaceManager