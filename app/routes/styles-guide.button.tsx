import { MoveRight, Plus } from "lucide-react";
import { Link } from "react-router";
import { ComponentPresentation } from "~/features/styles-guide/ComponentPresentation";
import { Button } from "~/ui/Button";

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
                component={<Button>Default</Button>}
                source={`<Button>Default</Button>`}
            />
            <h2>Variants</h2>
            <h3 id="#link">Link</h3>
            <ComponentPresentation
                component={<Link className="button" data-button-variant="link" to="/styles-guide">Link</Link>}
                source={`<Link className="button" data-button-variant="link" to="/styles-guide">Link</Link>`}
            />
            <h3 id="#secondary">Secondary</h3>
            <ComponentPresentation
                component={<Button data-button-variant="secondary">Secondary</Button>}
                source={`<Button data-button-variant="secondary">Secondary</Button>`}
            />
            <h3 id="#secondary">With Icon</h3>
            <ComponentPresentation
                component={
                    <Button>
                        Button with Icon
                        <MoveRight />
                    </Button>
                }
                source={`<Button data-button-variant="secondary">Secondary</Button>`}
            />
            <ComponentPresentation
                component={
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