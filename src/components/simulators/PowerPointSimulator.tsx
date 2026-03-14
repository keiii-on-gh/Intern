import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: string;
  title: string;
  content: string;
}

interface PowerPointSimulatorProps {
  value: Slide[];
  onChange: (value: Slide[]) => void;
}

export const PowerPointSimulator: React.FC<PowerPointSimulatorProps> = ({ value, onChange }) => {
  const [slides, setSlides] = useState<Slide[]>(() => {
    if (value && value.length > 0) return value;
    return [{ id: '1', title: 'Title Slide', content: 'Subtitle or content here' }];
  });
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    onChange(slides);
  }, [slides, onChange]);

  const addSlide = () => {
    const newSlide = { id: Date.now().toString(), title: 'New Slide', content: 'Add content here' };
    setSlides([...slides, newSlide]);
    setActiveSlide(slides.length);
  };

  const deleteSlide = (index: number) => {
    if (slides.length === 1) return;
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    if (activeSlide >= newSlides.length) setActiveSlide(newSlides.length - 1);
  };

  const updateSlide = (key: 'title' | 'content', val: string) => {
    const newSlides = [...slides];
    newSlides[activeSlide][key] = val;
    setSlides(newSlides);
  };

  return (
    <div className="border rounded-md overflow-hidden flex h-80 bg-slate-50">
      {/* Sidebar */}
      <div className="w-48 bg-slate-100 border-r flex flex-col">
        <div className="p-2 border-b flex justify-between items-center bg-white">
          <span className="text-sm font-semibold text-slate-700">Slides</span>
          <Button type="button" variant="ghost" size="sm" onClick={addSlide} className="h-6 w-6 p-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {slides.map((slide, index) => (
            <div 
              key={slide.id}
              className={`p-2 rounded cursor-pointer border text-xs relative group ${
                activeSlide === index ? 'bg-blue-50 border-blue-300' : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
              onClick={() => setActiveSlide(index)}
            >
              <div className="font-medium truncate pr-6">{index + 1}. {slide.title || 'Untitled'}</div>
              <div className="text-slate-500 truncate mt-1">{slide.content || 'No content'}</div>
              {slides.length > 1 && (
                <button 
                  type="button"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                  onClick={(e) => { e.stopPropagation(); deleteSlide(index); }}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        <div className="bg-slate-200 border-b p-2 flex items-center justify-between">
          <div className="flex space-x-2">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              disabled={activeSlide === 0}
              onClick={() => setActiveSlide(prev => prev - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium py-1 px-2">Slide {activeSlide + 1} of {slides.length}</span>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              disabled={activeSlide === slides.length - 1}
              onClick={() => setActiveSlide(prev => prev + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 p-8 flex items-center justify-center bg-slate-100">
          <div className="bg-white w-full max-w-lg aspect-video shadow-md border rounded p-8 flex flex-col space-y-4">
            <input
              type="text"
              className="text-2xl font-bold text-center w-full outline-none border-b border-transparent hover:border-slate-200 focus:border-blue-300 pb-2"
              value={slides[activeSlide].title}
              onChange={(e) => updateSlide('title', e.target.value)}
              placeholder="Click to add title"
            />
            <textarea
              className="flex-1 w-full outline-none resize-none border border-transparent hover:border-slate-200 focus:border-blue-300 p-2 text-slate-700"
              value={slides[activeSlide].content}
              onChange={(e) => updateSlide('content', e.target.value)}
              placeholder="Click to add text"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
