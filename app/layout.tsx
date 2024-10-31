import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import OgImage from '../public/adhan2.jpeg';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Adhan | Visualizing the Continuous Call to Prayer Worldwide',
  description:
    'Adhan is a web app that visualizes the uninterrupted cycle of the Islamic call to prayer (Adhan) around the world, demonstrating how it resonates across different time zones.',
  metadataBase: new URL('https://adhan.pragusga.com'),
  authors: [
    {
      name: 'Taufik Pragusga',
      url: 'https://pragusga.com',
    },
  ],
  abstract: `Adhan is an innovative web app designed to highlight the unique phenomenon of the Adhan (call to prayer) that never ceases across the globe. Utilizing modern technologies like Next.js, TypeScript, and Tailwind CSS, Adhan visualizes the continuous flow of this prayer call as it resonates in various regions, one after another, marking the passage of time zones. Whether you’re curious about Islamic practices or interested in global time-based phenomena, this app provides a real-time representation of Adhan, showcasing the world's unity through spiritual moments.`,
  applicationName: 'Adhan',
  alternates: {
    canonical: 'https://adhan.pragusga.com',
  },
  category: 'Religion',
  openGraph: {
    type: 'website',
    emails: ['taufik@pragusga.com'],
    title: 'Adhan | Visualizing the Continuous Call to Prayer Worldwide',
    description:
      'Adhan is a web app that visualizes the uninterrupted cycle of the Islamic call to prayer (Adhan) around the world, demonstrating how it resonates across different time zones.',
    siteName: 'Adhan',
    countryName: 'Indonesia',
    url: 'https://adhan.pragusga.com',
    alternateLocale: 'id_ID',
    images: [
      {
        url: `${OgImage.src}`,
        width: 1200,
        height: 630,
        alt: 'Adhan | Visualizing the Continuous Call to Prayer Worldwide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@pragusga',
    title: 'Adhan | Visualizing the Continuous Call to Prayer Worldwide',
    creator: '@pragusga',
    description:
      'Adhan is a web app that visualizes the uninterrupted cycle of the Islamic call to prayer (Adhan) around the world, demonstrating how it resonates across different time zones.',
    images: [
      {
        url: `${OgImage.src}`,
        width: 1200,
        height: 630,
        alt: 'Adhan | Visualizing the Continuous Call to Prayer Worldwide',
      },
    ],
  },
  keywords: ['islam', 'religion', 'muslim', 'adhan'],
  appLinks: {
    web: {
      url: 'https://adhan.pragusga.com',
      should_fallback: false,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
