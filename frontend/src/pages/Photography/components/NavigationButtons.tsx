import React from 'react';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';

interface NavigationButtonsProps {
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  isEditing: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  isEditing
}) => {
  if (isEditing) return null;
  
  return (
    <>
      {/* Left navigation button */}
      <div className="absolute left-4 inset-y-0 flex items-center">
        {hasPrev && (
          <button 
            onClick={onPrev}
            className="bg-white/20 rounded-full p-2 text-white hover:bg-white/30 transition"
            aria-label="Previous photo"
          >
            <MdNavigateBefore size={32} />
          </button>
        )}
      </div>
      
      {/* Right navigation button */}
      <div className="absolute right-4 inset-y-0 flex items-center">
        {hasNext && (
          <button 
            onClick={onNext}
            className="bg-white/20 rounded-full p-2 text-white hover:bg-white/30 transition"
            aria-label="Next photo"
          >
            <MdNavigateNext size={32} />
          </button>
        )}
      </div>
    </>
  );
};

export default NavigationButtons;
