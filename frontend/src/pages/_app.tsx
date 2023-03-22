import '@/styles/globals.css'
import "@/styles/main_stylesheet.css"
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import {ConfigProvider, theme} from "antd";

// eslint-disable-next-line require-jsdoc
export default function App({ Component, pageProps: {session, ...pageProps} }: AppProps) {
  return (
      <ConfigProvider
          theme={{
              // algorithm: theme.defaultAlgorithm,
              components: {
                  Button: {
                      colorPrimary: '#E6E600',
                      colorPrimaryHover: "#cfcf00",
                  },
                  Form: {
                      colorPrimary: "#a91",
                      colorText: "#a91",
                      colorTextLabel: "#fff",
                      colorPrimaryText: "#fff",
                  },
              },
          }}
      >
          <SessionProvider session={session}>
            <Component {...pageProps} />
          </SessionProvider>
      </ConfigProvider>
  )
}
