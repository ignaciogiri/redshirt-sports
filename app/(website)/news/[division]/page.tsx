import { notFound } from 'next/navigation'
import { Graph } from 'schema-dts'

import { getNewsByDivision, getDivisionPaths } from '@lib/sanity.fetch'
import { ArticleCard, Pagination } from '@components/ui'
import { PageHeader } from '@components/common'
import { baseUrl, perPage } from '@lib/constants'
import { Org, Web } from '@lib/ldJson'
import { defineMetadata } from '@lib/utils.metadata'
import { urlForImage } from '@lib/sanity.image'

import type { Metadata } from 'next'
import type { Post } from '@types'

export async function generateStaticParams() {
  const slugs = await getDivisionPaths()
  return slugs.map((slug) => ({ division: slug }))
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { [key: string]: string }
  searchParams: { [key: string]: string }
}): Promise<Metadata> {
  const { page } = searchParams
  const pageIndex = page !== undefined ? parseInt(page) : 1
  const division = await getNewsByDivision(params.division, pageIndex)

  if (!division) {
    return {}
  }

  let title = `${division?.heading}, Rumors, and More`
  let canonical = `${baseUrl}/news/${division?.slug}`
  if (pageIndex > 1) {
    title = `${division?.heading}, Rumors, and More - Page ${pageIndex}`
    canonical = `${baseUrl}/news/${division?.slug}?page=${pageIndex}`
  }

  const defaultMetadata = defineMetadata({
    title,
    description: division?.description,
  })

  return {
    ...defaultMetadata,
    openGraph: {
      ...defaultMetadata.openGraph,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(division?.heading)}`,
          width: 1200,
          height: 630,
          alt: division?.heading,
        },
      ],
      url: `/news/${division?.slug}${pageIndex > 1 ? `?page=${pageIndex}` : ''}`,
    },
    alternates: {
      ...defaultMetadata.alternates,
      canonical,
    },
    twitter: {
      ...defaultMetadata.twitter,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(division?.heading)}`,
          width: 1200,
          height: 630,
          alt: division?.heading,
        },
      ],
    },
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { [key: string]: string }
  searchParams: { [key: string]: string }
}) {
  const { page } = searchParams
  const pageIndex = page !== undefined ? parseInt(page) : 1
  const division = await getNewsByDivision(params.division, pageIndex)

  if (!division) {
    return notFound()
  }
  const totalPages = Math.ceil(division?.totalPosts / perPage)
  const nextDisabled = pageIndex === totalPages
  const prevDisabled = pageIndex === 1

  const breadcrumbs = [
    {
      title: 'News',
      href: '/news',
    },
    {
      title: division?.name,
      href: `/news/${division?.slug}`,
    },
  ]

  const jsonLd: Graph = {
    '@context': 'https://schema.org',
    '@graph': [
      Org,
      Web,
      {
        '@type': 'WebPage',
        '@id': `${baseUrl}/news/${params.division}${page ? `?page=${page}` : ''}`,
        url: `${baseUrl}/news/${params.division}${page ? `?page=${page}` : ''}`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          name: `${division?.name} Breadcrumbs`,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${baseUrl}`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'News',
              item: `${baseUrl}/news`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: division?.name,
              item: `${baseUrl}/news/${params.division}`,
            },
          ],
        },
      },
      {
        '@type': 'CollectionPage',
        mainEntity: division.posts.map((post: Post) => ({
          '@type': 'NewsArticle',
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          image: urlForImage(post.mainImage).url(),
          author: {
            '@type': 'Person',
            name: post.author.name,
            url: `${baseUrl}/authors/${post.author.slug}`,
          },
        })),
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader title={division?.heading} breadcrumbs={breadcrumbs} />
      <section className="container pb-12 sm:pb-16 lg:pb-20 xl:pb-24">
        <div className="mt-8 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 xl:gap-16">
          {division.posts.map((post: Post) => (
            <ArticleCard
              key={post._id}
              title={post.title}
              date={post.publishedAt}
              image={post.mainImage}
              slug={post.slug}
              division={post.division}
              conferences={post.conferences}
              author={post.author}
              estimatedReadingTime={post.estimatedReadingTime}
            />
          ))}
          {!division.posts.length && (
            <div className="col-span-3">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Coming Soon
              </h2>
            </div>
          )}
        </div>
        {totalPages > 1 && (
          <Pagination
            currentPage={pageIndex}
            totalPosts={division.totalPosts}
            nextDisabled={nextDisabled}
            prevDisabled={prevDisabled}
            slug={`/news/${params.division}`}
          />
        )}
      </section>
    </>
  )
}