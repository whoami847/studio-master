
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTutorials } from '@/contexts/TutorialContext';
import Image from 'next/image';
import Link from 'next/link';

export default function TutorialPage() {
  const { tutorials } = useTutorials();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-bold font-headline text-center">Tutorials</CardTitle>
        </CardHeader>
        <CardContent>
          {tutorials.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {tutorials.map((tutorial) => (
                  <Link key={tutorial.id} href={tutorial.link} target="_blank" rel="noopener noreferrer" className="group block">
                    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary">
                        <div className="relative aspect-video">
                            <Image
                                src={tutorial.thumbnail}
                                alt="Tutorial Thumbnail"
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                data-ai-hint="video thumbnail"
                            />
                        </div>
                        <div className="p-4">
                            <p className="font-medium text-center truncate group-hover:text-primary transition-colors">{tutorial.link}</p>
                        </div>
                    </Card>
                  </Link>
                ))}
             </div>
          ) : (
             <p className="text-muted-foreground mt-4 text-center">No tutorials are available yet. Please check back later!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
