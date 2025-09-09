"use client";

import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';

// Couleurs de fond pour les slides
const slideColors = [
  'bg-gradient-to-r from-blue-400 to-purple-500',
  'bg-gradient-to-r from-green-400 to-blue-500',
  'bg-gradient-to-r from-yellow-400 to-red-500',
  'bg-gradient-to-r from-pink-400 to-indigo-500'
];

const slideContent = [
  { emoji: '📝', title: 'Écriture', subtitle: 'Rédigez vos notes en Markdown' },
  { emoji: '🔄', title: 'Synchronisation', subtitle: 'Sync temps réel multi-appareils' },
  { emoji: '🗂️', title: 'Organisation', subtitle: 'Classez et retrouvez facilement' },
  { emoji: '🚀', title: 'Performance', subtitle: 'Interface rapide et fluide' }
];

export default function HeroSection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation vers un slide spécifique
  const animateToSlide = useCallback((targetIndex: number) => {
    if (!carouselRef.current || isAnimating || targetIndex === currentSlide) return;

    setIsAnimating(true);
    const slides = carouselRef.current.querySelectorAll('.slide');
    const currentSlideEl = slides[currentSlide];
    const targetSlideEl = slides[targetIndex];

    // Direction de l'animation
    const direction = targetIndex > currentSlide ? 1 : -1;

    // Timeline pour l'animation
    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentSlide(targetIndex);
        setIsAnimating(false);
      }
    });

    // Préparer le slide cible
    gsap.set(targetSlideEl, {
      display: 'flex',
      x: direction > 0 ? '100%' : '-100%'
    });

    // Animer les slides
    tl.to(currentSlideEl, {
      x: direction > 0 ? '-100%' : '100%',
      duration: 0.6,
      ease: 'power2.inOut'
    })
    .to(targetSlideEl, {
      x: '0%',
      duration: 0.6,
      ease: 'power2.inOut'
    }, 0)
    .set(currentSlideEl, { display: 'none' });

  }, [currentSlide, isAnimating]);

  // Animation automatique
  useEffect(() => {
    const startAutoPlay = () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      timelineRef.current = gsap.timeline({
        repeat: -1,
        delay: 3,
        repeatDelay: 3
      });

      timelineRef.current.add(() => {
        if (!isAnimating) {
          const nextIndex = (currentSlide + 1) % slideColors.length;
          animateToSlide(nextIndex);
        }
      });
    };

    startAutoPlay();

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [currentSlide, isAnimating, animateToSlide]);

  // Initialisation
  useEffect(() => {
    if (!carouselRef.current) return;

    const slides = carouselRef.current.querySelectorAll('.slide');
    
    // Initialiser tous les slides
    slides.forEach((slide, index) => {
      gsap.set(slide, {
        display: index === 0 ? 'flex' : 'none',
        x: '0%'
      });
    });
  }, []);

  const handleSlideClick = (index: number) => {
    // Arrêter l'autoplay temporairement
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    animateToSlide(index);

    // Reprendre l'autoplay après un délai
    setTimeout(() => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      
      timelineRef.current = gsap.timeline({
        repeat: -1,
        delay: 5,
        repeatDelay: 3
      });

      timelineRef.current.add(() => {
        if (!isAnimating) {
          const nextIndex = (currentSlide + 1) % slideColors.length;
          animateToSlide(nextIndex);
        }
      });
    }, 1000);
  };

  return (
    <section className="bg-blue-50 rounded-xl p-10 flex flex-col md:flex-row items-center gap-8">
      <div className="flex-1">
        <h1 className="text-4xl font-bold mb-4">Organisez vos pensées, synchronisez sans effort.</h1>
        <p className="text-gray-700 mb-6"> <span className='font-bold'>NotesMD</span> est votre solution complète pour une gestion de notes Markdown sans accroc, avec synchronisation en temps réel et organisation intelligente.</p>
        <p className="text-gray-700 mb-6">Içi, vous utiliserer la base de données de <span className='font-bold'>test</span>(commune à toutes les visiteurs). Contactez moi si vous vouler l'utiliser(<span className='font-bold'>votre propre base de données😉</span>) </p>
        <Link href="https://drive.google.com/file/d/1n7TbX-Ifffw1HRJ_nb_31eTAbF_ANlVq/view?usp=sharing" target='_blank' className="cursor-pointer bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
          Télécharger l'application mobile ici
        </Link>
      </div>
      
      <div className="flex-1 flex flex-col items-center">
        <div 
          ref={carouselRef}
          className="relative w-full max-w-md h-64 overflow-hidden rounded-lg shadow-lg"
        >
          {slideColors.map((color, index) => (
            <div 
              key={index}
              className={`slide absolute top-0 left-0 w-full h-full flex items-center justify-center ${color} text-white text-2xl font-bold`}
            >
              <div className="text-center p-4">
                <div className="text-5xl mb-4">{slideContent[index].emoji}</div>
                <div className="text-2xl mb-2">{slideContent[index].title}</div>
                <div className="text-sm font-normal opacity-90">{slideContent[index].subtitle}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex mt-4 space-x-2">
          {slideColors.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideClick(index)}
              disabled={isAnimating}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'bg-blue-700 scale-110' 
                  : 'bg-blue-300 hover:bg-blue-500'
              } ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              aria-label={`Aller à la slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}