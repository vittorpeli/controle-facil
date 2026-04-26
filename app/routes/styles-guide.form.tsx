import { Search } from "lucide-react";
import { ComponentPresentation } from "~/features/styles-guide/ComponentPresentation";
import { Button } from "~/ui/Button";
import { Card, CardContent, CardHeader } from "~/ui/card";
import { Checkbox, FieldSet, FieldSetButton, FieldSetIcon, FieldSetInput, Input, Label } from "~/ui/form";

const exampleForm = () => (
    <Card className="bg-light">
        <CardHeader>
            <h1 className="font-display" style={{fontSize: "var(--text-step-2)"}}>Welcome Back</h1>
            <p className="text-step--1">Enter your credentials</p>
        </CardHeader>
        <CardContent className="flow">
            <Input name="email" type="text" placeholder="Digite Seu E-mail"/>
            <Input name="password" type="password" placeholder="Sua Senha"/>
            <div className="repel">
                <div className="cluster gap-2xs">
                    <Checkbox id="remember-me" />
                    <Label htmlFor="remember-me">Remember me</Label>
                </div>
                <p className="text-step--2">Forgot your password?</p>
            </div>
            <Button className="w-full justify-center" data-button-variant="secondary">Access →</Button>
        </CardContent>
    </Card>
)

const exampleSearchForm = () => (
    <div>
        <FieldSet>
            <FieldSetButton data-button-variant="link">
                <FieldSetIcon><Search /></FieldSetIcon>
            </FieldSetButton>
            <FieldSetInput type="text" placeholder="Search..."/>
        </FieldSet>
    </div>
)

export default function StylesGuideForm() {
    return (
        <>
            <h1 className="cluster">Form</h1>
            <hr />
            <ComponentPresentation
                component={exampleForm()}
                source={`
<Card className="bg-light">
    <CardHeader>
        <h1 className="font-display" style={{fontSize: "var(--text-step-2)"}}>Welcome Back</h1>
        <p className="text-step--1">Enter your credentials</p>
    </CardHeader>
    <CardContent className="flow">
        <Input name="email" type="text" placeholder="Digite Seu E-mail"/>
        <Input name="password" type="password" placeholder="Sua Senha"/>
        <div className="repel">
            <div className="cluster gap-2xs">
                <Checkbox id="remember-me" />
                <Label htmlFor="remember-me">Remember me</Label>
            </div>
            <p className="text-step--2">Forgot your password?</p>
        </div>
        <Button className="w-full justify-center" data-button-variant="secondary">Access →</Button>
    </CardContent>
</Card>                    
`}
            />
            <h2>Search Input</h2>
            <ComponentPresentation
                component={exampleSearchForm()}
                source={`
<form>
    <FieldSet>
        <FieldSetButton data-button-variant="link">
            <FieldSetIcon><Search /></FieldSetIcon>
        </FieldSetButton>
        <FieldSetInput type="text" placeholder="Search..."/>
    </FieldSet>
</form>                    
`}
            />
        </>
    )
}