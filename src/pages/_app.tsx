import type { AppProps } from "next/app";

// Import global CSS here (ONLY place Next.js allows it)
import "../styles/login.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
