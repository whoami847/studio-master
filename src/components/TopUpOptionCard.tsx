import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

type TopUpOptionCardProps = {
  name: string;
  imageUrl: string;
  dataAiHint?: string;
};

export function TopUpOptionCard({ name, imageUrl, dataAiHint }: TopUpOptionCardProps) {
  return (
    <Card className="group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-primary">
      <CardContent className="p-0">
        <div className="relative aspect-video">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            data-ai-hint={dataAiHint}
          />
        </div>
        <div className="p-4 bg-card">
          <h3 className="font-semibold text-center group-hover:text-primary transition-colors">{name}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
