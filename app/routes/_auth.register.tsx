import { Lock, Mail, User } from 'lucide-react'
import { Form, Link } from 'react-router'
import { Button } from '~/ui/Button'
import { Card, CardContent, CardHeader } from '~/ui/card'
import {
  FieldSet,
  FieldSetButton,
  FieldSetIcon,
  FieldSetInput,
} from '~/ui/form'

export function meta() {
  return [
    { title: 'Cadastre-se' },
    { name: 'Crie sua conta', content: 'Cadastro' },
  ]
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
