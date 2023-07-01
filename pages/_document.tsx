import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main className={`flex min-h-screen`}/>
        <NextScript />
      </body>
    </Html>
  )
}
