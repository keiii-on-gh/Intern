import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Folder, FileText, Plus, Trash2, ChevronRight, FolderPlus, FilePlus } from 'lucide-react';

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId: string | null;
}

interface FileManagementSimulatorProps {
  value: FileNode[];
  onChange: (value: FileNode[]) => void;
}

export const FileManagementSimulator: React.FC<FileManagementSimulatorProps> = ({ value, onChange }) => {
  const [nodes, setNodes] = useState<FileNode[]>(() => {
    if (value && value.length > 0) return value;
    return [
      { id: 'root', name: 'Root', type: 'folder', parentId: null }
    ];
  });
  const [currentFolder, setCurrentFolder] = useState<string>('root');
  const [newItemName, setNewItemName] = useState('');
  const [isCreating, setIsCreating] = useState<'file' | 'folder' | null>(null);

  useEffect(() => {
    onChange(nodes);
  }, [nodes, onChange]);

  const getChildren = (parentId: string) => nodes.filter(n => n.parentId === parentId);

  const getPath = (folderId: string): FileNode[] => {
    const path: FileNode[] = [];
    let current: FileNode | undefined = nodes.find(n => n.id === folderId);
    while (current) {
      path.unshift(current);
      current = nodes.find(n => n.id === current?.parentId);
    }
    return path;
  };

  const handleCreate = () => {
    if (!newItemName.trim() || !isCreating) return;
    const newNode: FileNode = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      type: isCreating,
      parentId: currentFolder
    };
    setNodes([...nodes, newNode]);
    setNewItemName('');
    setIsCreating(null);
  };

  const handleDelete = (id: string) => {
    // Recursively delete children if it's a folder
    const deleteRecursive = (nodeId: string, currentNodes: FileNode[]) => {
      let updatedNodes = currentNodes.filter(n => n.id !== nodeId);
      const children = currentNodes.filter(n => n.parentId === nodeId);
      children.forEach(child => {
        updatedNodes = deleteRecursive(child.id, updatedNodes);
      });
      return updatedNodes;
    };
    setNodes(deleteRecursive(id, nodes));
  };

  const currentPath = getPath(currentFolder);
  const children = getChildren(currentFolder);

  return (
    <div className="border rounded-md overflow-hidden flex flex-col h-80 bg-white">
      {/* Toolbar */}
      <div className="bg-slate-100 border-b p-2 flex items-center justify-between">
        <div className="flex items-center space-x-1 text-sm font-medium text-slate-700">
          {currentPath.map((node, index) => (
            <React.Fragment key={node.id}>
              <button 
                type="button"
                className="hover:text-blue-600 hover:underline px-1"
                onClick={() => setCurrentFolder(node.id)}
              >
                {node.name}
              </button>
              {index < currentPath.length - 1 && <ChevronRight className="h-4 w-4 text-slate-400" />}
            </React.Fragment>
          ))}
        </div>
        <div className="flex space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="h-8 flex items-center space-x-1"
            onClick={() => setIsCreating('folder')}
          >
            <FolderPlus className="h-4 w-4" />
            <span>New Folder</span>
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="h-8 flex items-center space-x-1"
            onClick={() => setIsCreating('file')}
          >
            <FilePlus className="h-4 w-4" />
            <span>New File</span>
          </Button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-white">
        {isCreating && (
          <div className="flex items-center space-x-2 mb-4 bg-blue-50 p-2 rounded border border-blue-200">
            {isCreating === 'folder' ? <Folder className="h-5 w-5 text-blue-500" /> : <FileText className="h-5 w-5 text-slate-500" />}
            <input
              type="text"
              autoFocus
              className="flex-1 border rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`New ${isCreating} name...`}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate();
                if (e.key === 'Escape') { setIsCreating(null); setNewItemName(''); }
              }}
            />
            <Button type="button" size="sm" onClick={handleCreate}>Create</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => { setIsCreating(null); setNewItemName(''); }}>Cancel</Button>
          </div>
        )}

        {children.length === 0 && !isCreating ? (
          <div className="text-center text-slate-400 mt-8 text-sm">
            This folder is empty. Create a new file or folder.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {children.map(node => (
              <div 
                key={node.id}
                className="group flex flex-col items-center p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer relative"
                onClick={() => node.type === 'folder' && setCurrentFolder(node.id)}
              >
                {node.type === 'folder' ? (
                  <Folder className="h-12 w-12 text-blue-400 mb-2" />
                ) : (
                  <FileText className="h-12 w-12 text-slate-400 mb-2" />
                )}
                <span className="text-sm font-medium text-slate-700 text-center truncate w-full px-2" title={node.name}>
                  {node.name}
                </span>
                <button
                  type="button"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 p-1 rounded-full"
                  onClick={(e) => { e.stopPropagation(); handleDelete(node.id); }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
