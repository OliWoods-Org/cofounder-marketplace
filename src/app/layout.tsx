export const metadata = {
  title: 'CoFounder Marketplace',
  description: 'Buy, sell, and deploy AI agent teams',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
