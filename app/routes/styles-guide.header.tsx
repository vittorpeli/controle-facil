import { Link } from "react-router";
import { ComponentPresentation } from "~/features/styles-guide/ComponentPresentation";
import { Header } from "~/ui/Header";

export default function StylesGuideHeader() {
    return (
        <>
            <h1 className="cluster">Header</h1>
            <p className="mt-xs">
                <code className="text-primary">{"<Header />"}</code>
            </p>
            <nav className="cluster gutter-xs mb-xl" aria-label="variants">
                <Link className="button" data-type="badge" to="#no-bg">No Background</Link>
                <Link className="button" data-type="badge" to="#reverse">Reverse</Link>
            </nav>
            <ComponentPresentation 
                component={<Header subtitle="Subtitle" title="Title" />}
                source={`<Header subtitle="Subtitle" title="Title" />`}
            />
            <hr />
            <h2>Variants</h2>
            <h3 id="no-bg">No Background</h3>
            <ComponentPresentation 
                component={<Header subtitle="Subtitle" title="Title" data-background="blank" />}
                source={`<Header subtitle="Subtitle" title="Title" data-background="blank" />`}
            />
            <h3 id="reverse">Reverse</h3>
            <ComponentPresentation 
                component={<Header subtitle="Subtitle" title="Title" data-direction="reverse" />}
                source={`<Header subtitle="Subtitle" title="Title" data-direction="reverse" />`}
            />
            <ComponentPresentation 
                component={<Header subtitle="Subtitle" title="Title" data-background="blank" data-direction="reverse" />}
                source={`<Header subtitle="Subtitle" title="Title" data-background="blank" data-direction="reverse" />`}
            />
        </>
    )
}