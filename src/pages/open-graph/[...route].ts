import { getCollection } from 'astro:content'
import { OGImageRoute } from 'astro-og-canvas'
import { themeConfig } from '../../config'

async function createOGImageRoute() {
  const collectionEntries = await getCollection('posts')
  const pages = Object.fromEntries(
    collectionEntries.map(({ id, data }) => [id.replace(/\.(md|mdx)$/, ''), data])
  )
  return OGImageRoute({
    param: 'route',
    pages,
    getImageOptions: (_path, page) => ({
      title: page.title,
      description: themeConfig.site.title,
      logo: {
        path: 'public/og/og-logo.png',
        size: [80, 80]
      },
      bgGradient: [[255, 255, 255]],
      bgImage: {
        path: 'public/og/og-bg.png',
        fit: 'fill'
      },
      padding: 64,
      font: {
        title: {
          color: [255, 255, 255],
          size: 68,
          weight: 'SemiBold',
          families: ['PingFang SC']
        },
        description: {
          color: [180, 180, 180],
          size: 40,
          weight: 'Medium',
          families: ['PingFang SC']
        }
      },
      fonts: [
        'https://cdn.jsdelivr.net/npm/font-pingfang-sc-font-weight-improved@latest/PingFangSC-Medium.woff2',
        'https://cdn.jsdelivr.net/npm/font-pingfang-sc-font-weight-improved@latest/PingFangSC-Semibold.woff2',
      ]
    })
  })
}

export async function getStaticPaths() {
  const ogRoute = await createOGImageRoute()
  return ogRoute.getStaticPaths()
}

export const GET = async (context) => {
  const ogRoute = await createOGImageRoute()
  return ogRoute.GET(context)
}
