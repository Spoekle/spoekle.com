import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CarouselImage {
  id: number;
  url: string;
  alt: string;
}

interface CarouselProps {
  images: CarouselImage[];
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    position: 'absolute' as const,
  }),
  center: {
    x: 0,
    opacity: 1,
    position: 'relative' as const,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    position: 'absolute' as const,
  }),
};

export default function Carousel({ images }: CarouselProps) {
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const imageIndex = ((page % images.length) + images.length) % images.length;

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="overflow-hidden rounded-2xl shadow-2xl backdrop-blur-md bg-white/10 border border-white/10">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={images[imageIndex].id}
            src={images[imageIndex].url}
            alt={images[imageIndex].alt}
            className="w-full h-80 object-cover select-none"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            draggable={false}
          />
        </AnimatePresence>
      </div>
      <div className="absolute inset-y-0 left-0 flex items-center">
        <button
          className="bg-white/20 hover:bg-white/40 text-white rounded-full p-2 m-2 shadow-lg backdrop-blur-md"
          onClick={() => paginate(-1)}
          aria-label="Previous"
        >
          &#8592;
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center">
        <button
          className="bg-white/20 hover:bg-white/40 text-white rounded-full p-2 m-2 shadow-lg backdrop-blur-md"
          onClick={() => paginate(1)}
          aria-label="Next"
        >
          &#8594;
        </button>
      </div>
      <div className="flex justify-center mt-4 gap-2">
        {images.map((img, idx) => (
          <span
            key={img.id}
            className={`inline-block w-3 h-3 rounded-full ${idx === imageIndex ? 'bg-indigo-400' : 'bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
}
