
import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import { Toaster } from "@/components/ui/toaster"
import BottomNav from '@/components/layout/BottomNav';
import { OrderProvider } from '@/contexts/OrderContext';
import { WalletProvider } from '@/contexts/WalletContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import Footer from '@/components/layout/Footer';
import { NotificationProvider } from '@/contexts/NotificationContext';
import PopupNotification from '@/components/PopupNotification';
import { ProductProvider } from '@/contexts/ProductContext';
import { TutorialProvider } from '@/contexts/TutorialContext';
import { GatewayProvider } from '@/contexts/GatewayContext';

export const metadata: Metadata = {
  title: 'BurnerTop',
  description: 'Top up your favorite games and vouchers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <WalletProvider>
              <OrderProvider>
                <NotificationProvider>
                  <ProductProvider>
                    <TutorialProvider>
                      <GatewayProvider>
                        <div className="flex flex-col min-h-screen">
                          <Header />
                          <main className="flex-grow animate-fade-in pb-20 md:pb-0">{children}</main>
                          <Footer />
                          <BottomNav />
                        </div>
                        <Toaster />
                        <PopupNotification />
                      </GatewayProvider>
                    </TutorialProvider>
                  </ProductProvider>
                </NotificationProvider>
              </OrderProvider>
            </WalletProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
