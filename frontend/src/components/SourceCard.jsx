import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';

const SourceCard = ({ source, index }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Relevance color
  let scoreColor = 'bg-error';
  if (source.relevance_score > 0.7) scoreColor = 'bg-success';
  else if (source.relevance_score > 0.4) scoreColor = 'bg-warning';

  return (
    <div className="glass-panel rounded-lg p-3 mb-3 border border-border-glass hover:border-border-glass-hover transition-colors">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <div className="bg-bg-tertiary text-xs px-1.5 py-0.5 rounded text-secondary font-medium">
            [{index + 1}]
          </div>
          <FileText size={14} className="text-accent-secondary flex-shrink-0" />
          <span className="text-sm font-medium truncate text-primary" title={source.filename.replace(/^[0-9a-fA-F]{16}_/, '')}>
            {source.filename.replace(/^[0-9a-fA-F]{16}_/, '')}
          </span>
          <span className="text-xs text-secondary flex-shrink-0">
            p.{source.page}
          </span>
        </div>
        <div className="flex items-center gap-2 pl-2">
          <div className="w-16 h-1.5 bg-bg-primary rounded-full overflow-hidden">
            <div 
              className={`h-full ${scoreColor}`} 
              style={{ width: `${Math.min(100, source.relevance_score * 100)}%` }} 
            />
          </div>
          {expanded ? <ChevronUp size={16} className="text-secondary" /> : <ChevronDown size={16} className="text-secondary" />}
        </div>
      </div>
      
      {expanded && (
        <div className="mt-3 text-xs text-text-secondary leading-relaxed p-2 bg-bg-primary rounded border border-border-glass animate-fade-in">
          {source.chunk_text}
        </div>
      )}
    </div>
  );
};

export default SourceCard;
