import './globals.css';

export const metadata = {
  title: 'AlgoThink | Enterprise Logic Platform',
  description: 'Professional algorithmic thinking and logic evaluation environment.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

