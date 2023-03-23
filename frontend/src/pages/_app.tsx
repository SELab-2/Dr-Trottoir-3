import '@/styles/globals.css'
import "@/styles/main_stylesheet.css"
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import {ConfigProvider, theme} from "antd";

// eslint-disable-next-line require-jsdoc
export default function App({ Component, pageProps: {session, ...pageProps} }: AppProps) {
  return (
      <SessionProvider session={session} basePath={"http://localhost:3002/api/auth"}>
        <Component {...pageProps} />
      </SessionProvider>
  )
}
