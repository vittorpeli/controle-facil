import { Lock, Mail, User } from 'lucide-react'
import { Form, Link } from 'react-router'
import { makeRegisterUseCase } from '~/features/auth/application/use-cases/register'
import { parseEmail } from '~/features/auth/core/email'
import { DrizzleUsersRepository } from '~/features/auth/services/drizzle-users-repository'
import { Button } from '~/ui/Button'
import { Card, CardContent, CardHeader } from '~/ui/card'
import {
  FieldSet,
  FieldSetButton,
  FieldSetIcon,
  FieldSetInput,
} from '~/ui/form'
import type { Route } from './+types/_auth.register'

export function meta() {
  return [
    { title: 'Cadastre-se' },
    { name: 'Crie sua conta', content: 'Cadastro' },
  ]
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData()

  const rawName = form.get('name')?.toString() ?? ''
  const rawEmail = form.get('email')?.toString() ?? ''
  const rawPass = form.get('password')?.toString() ?? ''

  const parsedEmail = parseEmail(rawEmail)
  if (parsedEmail.kind === 'err') {
    return Response.json({ error: parsedEmail.error.message }, { status: 422 })
  }

  const register = makeRegisterUseCase(new DrizzleUsersRepository())

  try {
    const { user } = await register({
      userName: rawName,
      email: parsedEmail.value,
      password: rawPass,
    })

    return Response.json({ userId: user.id }, { status: 201 })
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === 'user already exists with that email'
    ) {
      return Response.json({ error: err.message }, { status: 409 })
    }
    throw err
  }
}

export default function RegisterForm() {
  return (
    <Card className="bg-light">
      <CardHeader>
        <h1 className="font-display" style={{ fontSize: 'var(--text-step-2)' }}>
          Cadastre-se!
        </h1>
        <p className="text-step--1">
          Crie sua conta e comece a controlar o seu dinheiro
        </p>
      </CardHeader>
      <CardContent className="flow">
        <Form>
          <FieldSet>
            <FieldSetButton>
              <FieldSetIcon>
                <User />
              </FieldSetIcon>
            </FieldSetButton>
            <FieldSetInput type="text" placeholder="Digite o seu nome" />
          </FieldSet>

          <FieldSet>
            <FieldSetButton>
              <FieldSetIcon>
                <Mail />
              </FieldSetIcon>
            </FieldSetButton>
            <FieldSetInput type="text" placeholder="O Seu Melhor E-mail..." />
          </FieldSet>

          <FieldSet>
            <FieldSetButton>
              <FieldSetIcon>
                <Lock />
              </FieldSetIcon>
            </FieldSetButton>
            <FieldSetInput type="text" placeholder="Digite a sua senha" />
          </FieldSet>

          <div>
            <Link
              className=" button text-step--2"
              data-button-variant="link"
              to="/login"
            >
              Já sou cadastrado
            </Link>
          </div>
          <Button
            className="w-full justify-center"
            data-button-variant="secondary"
            type="submit"
          >
            Criar conta →
          </Button>
        </Form>
      </CardContent>
    </Card>
  )
}
