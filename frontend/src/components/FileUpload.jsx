import React, { useState, useRef } from 'react';
import { UploadCloud, File as FileIcon } from 'lucide-react';

const FileUpload = ({ onUpload, accept = ".pdf,.docx" }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    setFile(selectedFile);
    if (onUpload) {
      onUpload(selectedFile);
    }
    // Reset for next upload
    setTimeout(() => setFile(null), 1000);
  };

  return (
    <div 
      className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-bg-tertiary flex items-center justify-center mb-4 text-accent-primary">
          <UploadCloud size={32} />
        </div>
        <h3 className="text-lg font-medium text-primary mb-1">Drag & drop files here</h3>
        <p className="text-sm text-secondary mb-4">Supports PDF, DOCX up to 50MB</p>
        
        <button className="btn btn-secondary pointer-events-none">
          Browse Files
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
