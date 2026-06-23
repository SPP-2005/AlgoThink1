import './globals.css';

export const metadata = {
  title: 'AlgoThink | Student Logic Academy',
  description: 'Master algorithmic thinking and learn how to break down complex coding problems step-by-step!',
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

