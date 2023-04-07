import "@/styles/globals.css";
import Container from "../Components/Container/Container";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import PlausibleProvider from "next-plausible";

import GiveFeedback from "@/Components/GiveFeedback/GiveFeedback";

function Loading() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => {
      url !== router.asPath && setLoading(true);
    };
    const handleComplete = (url) => {
      url === router.asPath && setLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  });

  return (
    loading && (
      <div className="spinnerWrapper">
        <div className="spinner"></div>
      </div>
    )
  );
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <PlausibleProvider domain="app.publicly.so">
      <SessionProvider session={pageProps.session}>
        <Container>
          <Loading />
          <Component {...pageProps} />
          <GiveFeedback />
        </Container>
      </SessionProvider>
    </PlausibleProvider>
  );
}
