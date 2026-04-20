import { MoveRight, Plus } from "lucide-react";
import type React from "react";
import { Link } from "react-router";
import { Button } from "~/ui/Button";

const ComponentPresentation = ({ button, source }: { button: React.ReactNode; source: string }) => {
    return (
        <div className="flow">
            {button}
            <div className="py-m">
                <div>
                    <p><strong>Source</strong></p>
                    <pre>
                        <code>
                            {source}
                        </code>
                    </pre>
                </div>
            </div>
        </div>
    )
}

export default function StylesGuideButton() {
    return (
        <>
            <h1 className="cluster">Button</h1>
            <p className="mt-xs">
                <code className="text-primary">{"<Button />"}</code>
            </p>
            <nav className="cluster gutter-xs mb-xl" aria-label="variants">
                <Link className="button" data-type="badge" to="#link">Link</Link>
                <Link className="button" data-type="badge" to="#secondary">Secondary</Link>
            </nav>
            <ComponentPresentation
                button={<Button>Default</Button>}
                source={`<Button>Default</Button>`}
            />
            <h2>Variants</h2>
            <h3 id="#link">Link</h3>
            <ComponentPresentation
                button={<Link className="button" data-button-variant="link" to="/styles-guide">Link</Link>}
                source={`<Link className="button" data-button-variant="link" to="/styles-guide">Link</Link>`}
            />
            <h3 id="#secondary">Secondary</h3>
            <ComponentPresentation
                button={<Button data-button-variant="secondary">Secondary</Button>}
                source={`<Button data-button-variant="secondary">Secondary</Button>`}
            />
            <h3 id="#secondary">With Icon</h3>
            <ComponentPresentation
                button={
                    <Button>
                        Button with Icon
                        <MoveRight />
                    </Button>
                }
                source={`<Button data-button-variant="secondary">Secondary</Button>`}
            />
            <ComponentPresentation
                button={
                    <Button data-button-variant="link">
                        <Plus />
                        Link
                    </Button>
                }
                source={`<Button data-button-variant="link">Link</Button>`}
            />
        </>
    )
}