'use client'

import { Fragment, useState } from 'react'
import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/navigation'
import { SidebarOpen } from 'lucide-react'

import { cn } from '@lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '@components/ui/Sheet'
import { Button } from '@components/ui/Button'
import { ScrollArea } from '@components/ui/ScrollArea'
import { STATIC_NAV_ITEMS } from '@lib/constants'
import LargeLogo from './LargeLogo'

export function MobileNav(props: any) {
  const [open, setOpen] = useState(false)

  const { divisions } = props

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
        >
          <SidebarOpen className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent size="xl" position="left" className="pr-0">
        <MobileLink href="/" className="flex items-center" onOpenChange={setOpen}>
          <LargeLogo className="h-10 w-auto" />
          <span className="sr-only">Redshirt Sports</span>
        </MobileLink>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-2">
            {divisions.map((division: any, index: number) => (
              <div key={index} className="flex flex-col space-y-3 pt-6">
                <h4 className="text-xl font-bold">{division.name}</h4>
                {division.conferences?.length > 0 &&
                  division.conferences.map((conference: any) => (
                    <Fragment key={`mobile_nav_${conference._id}`}>
                      <MobileLink
                        href={`/news/${division.slug}/${conference.slug}`}
                        onOpenChange={setOpen}
                        className="font-serif"
                      >
                        {conference.shortName ?? conference.name}
                      </MobileLink>
                    </Fragment>
                  ))}
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col space-y-3">
            {STATIC_NAV_ITEMS.map(
              (item) =>
                item.href && (
                  <MobileLink key={item.href} href={item.href} onOpenChange={setOpen}>
                    {item.title}
                  </MobileLink>
                ),
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({ href, onOpenChange, className, children, ...props }: MobileLinkProps) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  )
}