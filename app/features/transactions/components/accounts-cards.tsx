import { Archive, SquarePen } from 'lucide-react'
import { Button } from '~/ui/Button'
import { Card, CardContent, CardHeader } from '~/ui/card'
import { Headline } from '~/ui/headline'
import type { AccountWithBalance } from '../core/account'

export function AccountCards(accounts: AccountWithBalance[]) {
  return (
    <div className="grid">
      {accounts.map((account) => (
        <Card key={account.id}>
          <CardHeader>
            <Headline title={account.name}>
              <div className="flex flex-row items-center gap-2xs mr-s">
                <Button data-button-variant="link">
                  <Archive />
                </Button>
                <Button data-button-variant="link">
                  <SquarePen />
                </Button>
              </div>
            </Headline>
          </CardHeader>

          <CardContent>
            <span>{account.balance}</span>
          </CardContent>
        </Card>
      ))}
      {accounts.length === 0 && (
        <p className="font-mono">Nenhuma conta encontrada</p>
      )}
    </div>
  )
}
