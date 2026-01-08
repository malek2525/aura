import React, { useState, useRef } from 'react';
import { Icons } from '../components/Icons';

interface CodeMergerProps {
  onBack: () => void;
}

interface FileEntry {
  name: string;
  path: string;
  size: number;
  status: 'unchanged' | 'modified' | 'new' | 'conflict';
}

export const CodeMerger: React.FC<CodeMergerProps> = ({ onBack }) => {
  const [sourceFiles, setSourceFiles] = useState<FileEntry[]>([]);
  const [targetFiles, setTargetFiles] = useState<FileEntry[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mergeStatus, setMergeStatus] = useState<'idle' | 'success'>('idle');

  // Refs for the hidden inputs
  const sourceInputRef = useRef<HTMLInputElement>(null);
  const targetInputRef = useRef<HTMLInputElement>(null);

  const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>, isSource: boolean) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).map(file => ({
        name: file.name,
        path: file.webkitRelativePath,
        size: file.size,
        status: 'unchanged' as const
      }));
      
      if (isSource) {
        setSourceFiles(files);
      } else {
        setTargetFiles(files);
      }
      setMergeStatus('idle');
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate processing time
    setTimeout(() => {
      // Simple mock logic: randomly mark some source files as modified or new
      const updatedSource = sourceFiles.map(f => ({
        ...f,
        status: (Math.random() > 0.7 ? 'modified' : Math.random() > 0.8 ? 'new' : 'unchanged') as FileEntry['status']
      }));
      setSourceFiles(updatedSource);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleMerge = () => {
    setMergeStatus('success');
    // In a real app, this would generate a download
  };

  const FileList = ({ files, title }: { files: FileEntry[], title: string }) => (
    <div className="bg-warm-white rounded-xl border border-warm-gray overflow-hidden flex flex-col h-64">
      <div className="bg-white px-4 py-2 border-b border-warm-gray flex justify-between items-center">
        <span className="font-bold text-xs text-text-muted uppercase tracking-wider">{title}</span>
        <span className="text-xs text-text-sec">{files.length} files</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {files.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-text-muted opacity-50">
            <Icons.Folder size={32} />
            <span className="text-xs mt-2">No folder selected</span>
          </div>
        ) : (
          files.map((file, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white transition-colors text-sm">
              <Icons.File size={14} className="text-text-sec" />
              <div className="flex-1 truncate">
                 <div className="truncate text-text-main">{file.name}</div>
                 <div className="text-[10px] text-text-muted truncate">{file.path}</div>
              </div>
              {file.status === 'modified' && <div className="w-2 h-2 rounded-full bg-orange-400" title="Modified"></div>}
              {file.status === 'new' && <div className="w-2 h-2 rounded-full bg-success" title="New"></div>}
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="bg-white px-4 py-4 flex items-center border-b border-warm-gray sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-text-sec hover:bg-warm-white rounded-full">
          <Icons.ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-text-main mr-8">Code Fusion</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Upload Zones */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Source Zone */}
          <div 
             onClick={() => sourceInputRef.current?.click()}
             className="aspect-square rounded-2xl border-2 border-dashed border-coral/30 bg-coral-light/10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-coral-light/20 transition-colors"
          >
             <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-coral">
                <Icons.Upload size={24} />
             </div>
             <div className="text-center">
               <p className="font-bold text-sm text-text-main">Source</p>
               <p className="text-xs text-text-muted">Folder A</p>
             </div>
             <input 
               type="file" 
               // @ts-ignore - directory attributes are non-standard but supported in most browsers
               webkitdirectory="" directory="" multiple 
               className="hidden" 
               ref={sourceInputRef}
               onChange={(e) => handleFolderUpload(e, true)}
             />
          </div>

          {/* Target Zone */}
          <div 
             onClick={() => targetInputRef.current?.click()}
             className="aspect-square rounded-2xl border-2 border-dashed border-warm-gray bg-warm-white flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
          >
             <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-text-sec">
                <Icons.Download size={24} />
             </div>
             <div className="text-center">
               <p className="font-bold text-sm text-text-main">Target</p>
               <p className="text-xs text-text-muted">Folder B</p>
             </div>
             <input 
               type="file" 
                // @ts-ignore
               webkitdirectory="" directory="" multiple 
               className="hidden" 
               ref={targetInputRef}
               onChange={(e) => handleFolderUpload(e, false)}
             />
          </div>
        </div>

        {/* Action Button */}
        {(sourceFiles.length > 0 && targetFiles.length > 0) && (
          <div className="animate-in fade-in slide-in-from-top-4">
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full py-3 bg-text-main text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Icons.Sparkles className="animate-spin" size={18} /> Analyzing...
                </>
              ) : (
                <>
                  <Icons.Search size={18} /> Analyze Differences
                </>
              )}
            </button>
          </div>
        )}

        {/* File Lists */}
        <div className="space-y-4">
           <FileList files={sourceFiles} title="Source Files" />
           <FileList files={targetFiles} title="Target Files" />
        </div>

        {/* Merge Result */}
        {mergeStatus === 'success' && (
           <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-in zoom-in">
              <div className="bg-success text-white p-2 rounded-full">
                 <Icons.Check size={20} />
              </div>
              <div>
                 <p className="font-bold text-green-800 text-sm">Merge Successful</p>
                 <p className="text-xs text-green-700">Code merged into a new package.</p>
              </div>
           </div>
        )}
      </div>

      {/* Footer Action */}
      <div className="p-4 bg-white border-t border-warm-gray">
        <button 
           onClick={handleMerge}
           disabled={sourceFiles.length === 0 || targetFiles.length === 0}
           className="w-full py-4 bg-coral text-white font-bold rounded-xl shadow-lg shadow-coral/30 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none"
        >
          <Icons.Zap size={20} fill="currentColor" />
          Merge Codes
        </button>
      </div>
    </div>
  );
};