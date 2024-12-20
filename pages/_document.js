import * as React from 'react'
// next
import Document, { Html, Head, Main, NextScript } from 'next/document'
// emotion
import createEmotionServer from '@emotion/server/create-instance'
// utils
import createEmotionCache from 'src/utils/createEmotionCache'
// theme
import palette from 'src/theme/palette'

// ----------------------------------------------------------------------

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/favicon/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon/favicon-16x16.png"
          />

          <meta name="theme-color" content={palette.light.primary.main} />
          <link rel="manifest" href="/manifest.json" />

          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <meta
            name="description"
            content="Our mission is to provide a platform where people can grow, learn and earn. We are here to help you to find the solution of Unemployment"
          />
          <meta
            name="keywords"
            content="react,material,kit,application,dashboard,admin,template"
          />
          <meta name="author" content="Minimal UI Kit" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

MyDocument.getInitialProps = async ctx => {
  const originalRenderPage = ctx.renderPage

  const cache = createEmotionCache()

  const { extractCriticalToChunks } = createEmotionServer(cache)

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props => <App emotionCache={cache} {...props} />,
    })

  const initialProps = await Document.getInitialProps(ctx)

  const emotionStyles = extractCriticalToChunks(initialProps.html)
  const emotionStyleTags = emotionStyles.styles.map(style => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ))

  return {
    ...initialProps,
    styles: [
      ...React.Children.toArray(initialProps.styles),
      ...emotionStyleTags,
    ],
  }
}
