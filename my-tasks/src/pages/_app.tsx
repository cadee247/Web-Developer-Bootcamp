// Import the AppProps type from Next.js.
// This type defines the props passed into the custom App component,
// including the page component itself and any initial props.
import type { AppProps } from "next/app";

// Custom App component: wraps all pages in the Next.js application.
// This is the entry point for rendering pages and allows you to
// add global providers, layouts, or styles if needed.
export default function MyApp({ Component, pageProps }: AppProps) {
  // Render the current page component with its props.
  // Next.js automatically injects the correct component and props here.
  return <Component {...pageProps} />;
}