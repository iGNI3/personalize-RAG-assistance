import React, { useState, useEffect } from 'react';
import { Upload, File, FileText, Trash2, Clock, Users, Activity, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import { SkeletonLoader } from '../components/LoadingStates';
import { api } from '../api/client';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  
  const { addToast } = useToast();
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'admin';

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const data = await api.getDocuments();
      setDocuments(data.documents || []);
    } catch (err) {
      addToast('Failed to load documents', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (file) => {
    setIsUploading(true);
    setUploadProgress(10);
    
    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress(p => Math.min(p + 15, 90));
    }, 500);

    try {
      await api.uploadDocument(file, 'all');
      clearInterval(interval);
      setUploadProgress(100);
      addToast('Document uploaded and processed successfully', 'success');
      setShowUpload(false);
      fetchDocuments();
    } catch (err) {
      clearInterval(interval);
      addToast(err.message || 'Upload failed', 'error');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    
    try {
      await api.deleteDocument(id);
      addToast('Document deleted', 'success');
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      addToast('Failed to delete document', 'error');
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto">
        <div className="page-header">
          <div>
            <h1 className="text-2xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-400">Document Library</h1>
            <p className="text-slate-400 text-sm">Manage your knowledge base files and role-based access controls.</p>
          </div>
          <button 
            onClick={() => setShowUpload(!showUpload)} 
            className="clay-btn"
          >
            <Upload size={18} /> {showUpload ? 'Cancel Upload' : 'Upload Document'}
          </button>
        </div>

        {/* Upload Section */}
        {showUpload && (
          <div className="liquid-glass p-6 mb-8 animate-slide-up">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-cyan-300">
              <Upload size={20} className="text-cyan-400" />
              Add New Document
            </h2>
            <FileUpload onUpload={handleUpload} />
            
            {isUploading && (
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-secondary">Uploading & Processing...</span>
                  <span className="font-medium">{uploadProgress}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Documents Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="glass-card h-48 flex flex-col justify-between">
                <SkeletonLoader className="h-6 w-3/4 mb-4" />
                <SkeletonLoader className="h-4 w-1/2 mb-2" />
                <SkeletonLoader className="h-4 w-full mb-6" />
                <SkeletonLoader className="h-8 w-full" />
              </div>
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="glass-card py-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-bg-tertiary flex items-center justify-center mb-4">
              <FileText size={40} className="text-tertiary" />
            </div>
            <h3 className="text-xl font-medium mb-2">No documents found</h3>
            <p className="text-secondary max-w-sm mb-6">
              Your knowledge base is currently empty. Upload PDFs or Word documents to start chatting with your data.
            </p>
            <button onClick={() => setShowUpload(true)} className="btn btn-primary">
              Upload your first file
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div key={doc.id} className="glass-card flex flex-col group relative overflow-hidden">
                {/* Status Indicator Bar */}
                <div className={`absolute top-0 left-0 w-full h-1 ${
                  doc.status === 'ready' ? 'bg-success' : 
                  doc.status === 'processing' ? 'bg-warning animate-pulse' : 'bg-error'
                }`} />

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-lg bg-bg-tertiary flex items-center justify-center flex-shrink-0">
                      {doc.filename.endsWith('.pdf') ? 
                        <FileText size={20} className="text-error" /> : 
                        <File size={20} className="text-accent-secondary" />
                      }
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-medium text-primary truncate" title={doc.original_filename || doc.filename}>
                        {doc.original_filename || doc.filename}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-secondary mt-1">
                        <span>{formatBytes(doc.file_size_bytes || doc.size || 0)}</span>
                        <span>•</span>
                        <span className="uppercase">{(doc.original_filename || doc.filename).split('.').pop()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-secondary">
                      <Activity size={14} />
                      <span>{doc.num_chunks || doc.chunks_count || 0} chunks</span>
                    </div>
                    <div className="flex items-center gap-2 text-secondary">
                      <File size={14} />
                      <span>{doc.num_pages || doc.pages_count || 0} pages</span>
                    </div>
                    <div className="flex items-center gap-2 text-secondary">
                      <Clock size={14} />
                      <span>{new Date(doc.upload_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-secondary truncate">
                      <Users size={14} />
                      <span className="truncate">{doc.uploader || doc.uploader_name || 'System'}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap mb-6">
                    {(doc.access_roles || ['all']).map(role => (
                      <span key={role} className="badge badge-neutral text-[10px]">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border-glass mt-auto">
                  <div className="flex items-center gap-1.5 text-xs">
                    {doc.status === 'ready' ? (
                      <><CheckCircle2 size={14} className="text-success" /> <span className="text-success">Ready</span></>
                    ) : doc.status === 'processing' ? (
                      <><Loader2 size={14} className="animate-spin text-warning" /> <span className="text-warning">Processing</span></>
                    ) : (
                      <><AlertCircle size={14} className="text-error flex-shrink-0" /> <span className="text-error truncate" title={doc.error_message}>Error: {doc.error_message || 'Failed to process'}</span></>
                    )}
                  </div>
                  
                  {isAdmin && (
                    <button 
                      onClick={() => handleDelete(doc.id)}
                      className="btn-icon btn-ghost text-tertiary hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete document"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;
