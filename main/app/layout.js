import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: `${process.env.PROJECT_NAME || 'AI Linguo'} - Tutor de Inglês por IA`,
  description: 'Aprenda inglês com IA personalizada. Conversação, correção de escrita, pronúncia e vocabulário.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}