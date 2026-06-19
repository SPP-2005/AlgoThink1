import './globals.css';

export const metadata = {
  title: 'AlgoThink: The Literal Lab',
  description: 'AlgoThink - Teach algorithmic thinking in a playful, game-like environment.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Inter:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
