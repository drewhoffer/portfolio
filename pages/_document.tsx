import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const meta = {
    title: "Drew's Zoo",
    description:
      "Personal playground for me to talk about things I care about. Whether it's new tech, old tech, cool tech, boring tech, I'll probably talk it about it eventually.",
  };

  return (
    <Html lang="en">
      <Head>
        <meta name="robots" content="follow, index" />
        <meta name="description" content={meta.description} />
        <meta property="og:site_name" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        {/* <meta property="og:image" content={meta.image} /> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@drewhoffer" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        {/* <meta name="twitter:image" content={meta.image} /> */}
        <script defer data-domain="drewszoo.ca" src="https://plausible.drewszoo.ca/js/script.js"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
