
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const slides = [
  {
    title: 'FREE FIRE DIAMONDS',
    subtitle: 'Top up your game currency instantly and securely.',
    buttonText: 'Top Up Now',
    imageUrl: 'https://images.unsplash.com/photo-1593438358459-54b22378a484?q=80&w=1200&h=800&fit=crop',
    link: '/category/free-fire'
  },
  {
    title: 'EXCLUSIVE VOUCHERS',
    subtitle: 'Get the best deals on your favorite platforms.',
    buttonText: 'Get Vouchers',
    imageUrl: 'https://images.unsplash.com/photo-1614036911732-817d3550993a?q=80&w=1200&h=800&fit=crop',
    link: '/category/vouchers'
  },
  {
    title: 'PUBG MOBILE UC',
    subtitle: 'Dominate the battleground with more UC.',
    buttonText: 'Buy UC',
    imageUrl: 'https://images.unsplash.com/photo-1587213812845-9ec1543884a4?q=80&w=1200&h=800&fit=crop',
    link: '/category/pubg'
  }
];

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[50vh] md:h-[60vh] text-white overflow-hidden bg-black">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000 ease-in-out',
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          )}
        >
          <Image
            src={slide.imageUrl}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-20 flex flex-col items-start justify-center h-full text-left p-8 md:p-16">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-2 text-primary drop-shadow-lg animate-fade-in-down">
              {slide.title}
            </h1>
             <p className="text-lg md:text-xl mb-4 text-white/90 max-w-md animate-fade-in-down" style={{animationDelay: '0.1s'}}>
              {slide.subtitle}
            </p>
            <Button size="lg" asChild className="animate-fade-in-down" style={{animationDelay: '0.2s'}}>
              <Link href={slide.link}>{slide.buttonText}</Link>
            </Button>
          </div>
        </div>
      ))}

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              'w-2.5 h-2.5 rounded-full transition-colors',
              currentIndex === index ? 'bg-primary' : 'bg-white/50'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
