'use client'

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Image as SanityImage } from '@/components/image'

import type { VoterBreakdown } from '@/types'

interface VoterBreakdownProps {
  voterBreakdown: VoterBreakdown[]
}

export default function VoterBreakdown({ voterBreakdown }: VoterBreakdownProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Voter</TableHead>
          {[...Array(25)].map((_, i) => (
            <TableHead key={i}>{i + 1}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {voterBreakdown.map((voter: any) => {
          return (
            <TableRow key={`${voter.name}_${voter.organization}`}>
              <TableCell>
                <div>{voter.name}</div>
                <div className="text-sm italic text-muted-foreground">
                  {`${voter.organization} (${voter.organizationRole})`}
                </div>
              </TableCell>
              {voter.ballot.map((vote: any) => (
                <TableCell key={vote._id}>
                  <div className="w-10">
                    <SanityImage className="w-full" src={vote.image} width={40} height={40} />
                  </div>
                </TableCell>
              ))}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
