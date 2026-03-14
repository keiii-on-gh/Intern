import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface WordSimulatorProps {
  value: string;
  onChange: (value: string) => void;
}

export const WordSimulator: React.FC<WordSimulatorProps> = ({ value, onChange }) => {
  const [format, setFormat] = useState({
    bold: false,
    italic: false,
    underline: false,
    align: 'left'
  });

  const toggleFormat = (key: keyof typeof format, val?: any) => {
    setFormat(prev => ({
      ...prev,
      [key]: val !== undefined ? val : !prev[key]
    }));
  };

  return (
    <div className="border rounded-md overflow-hidden flex flex-col h-64">
      <div className="bg-slate-100 border-b p-2 flex items-center space-x-2">
        <Button 
          type="button" 
          variant={format.bold ? "secondary" : "ghost"} 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => toggleFormat('bold')}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant={format.italic ? "secondary" : "ghost"} 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => toggleFormat('italic')}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant={format.underline ? "secondary" : "ghost"} 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => toggleFormat('underline')}
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-slate-300 mx-2" />
        <Button 
          type="button" 
          variant={format.align === 'left' ? "secondary" : "ghost"} 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => toggleFormat('align', 'left')}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant={format.align === 'center' ? "secondary" : "ghost"} 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => toggleFormat('align', 'center')}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant={format.align === 'right' ? "secondary" : "ghost"} 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => toggleFormat('align', 'right')}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
      <textarea
        className="flex-1 p-4 resize-none outline-none"
        style={{
          fontWeight: format.bold ? 'bold' : 'normal',
          fontStyle: format.italic ? 'italic' : 'normal',
          textDecoration: format.underline ? 'underline' : 'none',
          textAlign: format.align as any
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start typing your document here..."
      />
    </div>
  );
};
