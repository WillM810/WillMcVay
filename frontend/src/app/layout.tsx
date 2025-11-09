import '../index.css';

import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'William McVay: Full Stack Developer',
  description: 'Web site created with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Web site created using Next.js"
        />
        <title>William McVay: Full Stack Developer</title>
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>

  )
}