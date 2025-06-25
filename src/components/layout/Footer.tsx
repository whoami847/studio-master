
import Link from 'next/link';
import { Facebook, Youtube } from 'lucide-react';

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path><path d="M14.05 2.95a8.995 8.995 0 0 1 8 8M14.05 6.95a4.995 4.995 0 0 1 4 4"></path></svg>
);
const TelegramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
);


export default function Footer() {
  return (
    <footer className="bg-card border-t hidden md:block">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          <div>
            <h3 className="text-xl font-bold mb-4 font-headline">SUPPORT</h3>
            <p className="text-foreground/80 mb-2">Phone: +8801811111111</p>
            <p className="text-foreground/80">WhatsApp: +8801811111111</p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 font-headline">ABOUT US</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-foreground/80 hover:text-primary transition-colors">About us</Link></li>
              <li><Link href="#" className="text-foreground/80 hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="text-foreground/80 hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-foreground/80 hover:text-primary transition-colors">Terms & condition</Link></li>
              <li><Link href="#" className="text-foreground/80 hover:text-primary transition-colors">Refund and Return Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 font-headline">STAY CONNECTED</h3>
            <p className="text-lg font-semibold text-foreground/90">GAMING TOP UP</p>
            <p className="text-foreground/80 mb-4">Email: gamingdemo@gmail.com</p>
            <div className="flex justify-center md:justify-start gap-4">
              <a href="#" aria-label="Facebook" className="text-foreground/80 hover:text-primary transition-colors"><Facebook className="h-6 w-6" /></a>
              <a href="#" aria-label="YouTube" className="text-foreground/80 hover:text-primary transition-colors"><Youtube className="h-6 w-6" /></a>
              <a href="#" aria-label="WhatsApp" className="text-foreground/80 hover:text-primary transition-colors"><WhatsAppIcon /></a>
              <a href="#" aria-label="Telegram" className="text-foreground/80 hover:text-primary transition-colors"><TelegramIcon /></a>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-foreground/60">
          <p>&copy; {new Date().getFullYear()} BURNERS STORE. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
