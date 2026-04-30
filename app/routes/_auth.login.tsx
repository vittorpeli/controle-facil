import { ArrowRight, Lock, Mail } from 'lucide-react'
import { data, Form, Link, redirect } from 'react-router'
import { makeSignInUseCase } from '~/features/auth/application/use-cases/sign-in'
import { parseEmail } from '~/features/auth/core/email'
import { DrizzleSessionsRepository } from '~/features/auth/services/drizze-sessions-repository'
import { DrizzleUsersRepository } from '~/features/auth/services/drizzle-users-repository'
import { sessionCookie } from '~/features/auth/services/session-cookie'
import { Button } from '~/ui/Button'
import { Card, CardContent, CardHeader } from '~/ui/card'
import {
  Checkbox,
  FieldSet,
  FieldSetButton,
  FieldSetIcon,
  FieldSetInput,
  Label,
} from '~/ui/form'
import type { Route } from './+types/_auth.login'

export function meta() {
  return [
    { title: 'Seja bem vindo' },
    { name: 'Faça login novamente', content: 'Login' },
  ]
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData()

  const rawEmail = form.get('email')?.toString() ?? ''
  const rawPassword = form.get('password')?.toString() ?? ''

  const parsedEmail = parseEmail(rawEmail)
  if (parsedEmail.kind === 'err') {
    return data({ error: 'E-mail inválido' }, { status: 422 })
  }

  const signIn = makeSignInUseCase(
    new DrizzleUsersRepository(),
    new DrizzleSessionsRepository(),
  )

  try {
    const { session } = await signIn({
      email: parsedEmail.value,
      password: rawPassword,
    })

    return redirect('/app', {
      headers: {
        'Set-Cookie': await sessionCookie.serialize(session.token),
      },
    })
  } catch (err) {
    if (err instanceof Error && err.message === 'invalid credentials') {
      return data({ error: 'E-mail ou senha inválidos.' }, { status: 401 })
    }
    throw err
  }
}

export default function LoginForm({ actionData }: Route.ComponentProps) {
  return (
    <Card className="bg-light">
      <CardHeader>
        <h1 className="font-display" style={{ fontSize: 'var(--text-step-2)' }}>
          Seja bem vindo de volta!
        </h1>
        <p className="text-step--1">
          Digite suas credenciais para se conectar ao app
        </p>
      </CardHeader>
      <CardContent className="flow">
        <Form method="post">
          {actionData?.error && (
            <p role="alert" className="text-step--2 text-error">
              {actionData.error}
            </p>
          )}
          <FieldSet>
            <FieldSetButton>
              <FieldSetIcon>
                <Mail />
              </FieldSetIcon>
            </FieldSetButton>
            <FieldSetInput
              type="email"
              name="email"
              placeholder="Digite o seu E-mail..."
              autoComplete="email"
              required
            />
          </FieldSet>

          <FieldSet>
            <FieldSetButton>
              <FieldSetIcon>
                <Lock />
              </FieldSetIcon>
            </FieldSetButton>
            <FieldSetInput
              type="password"
              name="password"
              placeholder="Digite a sua senha"
              autoComplete="current-password"
              required
            />
          </FieldSet>

          <div className="repel">
            <div className="cluster gap-2xs">
              <Checkbox id="remember-me" />
              <Label htmlFor="remember-me">Lembre de mim</Label>
            </div>
            <Link
              className="button text-step--2"
              data-button-variant="link"
              to="/register"
            >
              Ou Se Cadastre
            </Link>
          </div>
          <Button
            className="w-full justify-center"
            data-button-variant="secondary"
          >
            Accessar
            <ArrowRight />
          </Button>
        </Form>
      </CardContent>
    </Card>
  )
}
