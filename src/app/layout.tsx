import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { WishlistDrawer } from '@/components/WishlistDrawer';
import { AppLayerModal } from '@/components/AppLayerModal';
import { DevPanel } from '@/components/DevPanel';
import { ToastContainer } from '@/components/ToastContainer';
import { SearchModal } from '@/components/SearchModal';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { RoomVisualizerModal } from '@/components/RoomVisualizerModal';
import { GalleryWallBuilderModal } from '@/components/GalleryWallBuilderModal';

export const metadata: Metadata = {
  title: 'Moonflash | Art, Personally Yours',
  description:
    'Turn personal memories into museum-grade customized physical art in seconds. Handcrafted wall tiles, stretched canvases, and glass suncatchers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans min-h-screen flex flex-col bg-white text-neutral-900 antialiased pb-16 md:pb-0">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />

        {/* Global Overlays & Modals */}
        <MobileBottomNav />
        <CartDrawer />
        <WishlistDrawer />
        <AppLayerModal />
        <RoomVisualizerModal />
        <GalleryWallBuilderModal />
        <DevPanel />
        <ToastContainer />
        <SearchModal />
      </body>
    </html>
  );
}
