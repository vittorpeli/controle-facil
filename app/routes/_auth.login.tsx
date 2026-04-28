import { ArrowRight, Lock, Mail } from 'lucide-react'
import { Form, Link } from 'react-router'
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

export function meta() {
  return [
    { title: 'Seja bem vindo' },
    { name: 'Faça login novamente', content: 'Login' },
  ]
}

export default function LoginForm() {
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
        <Form>
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
