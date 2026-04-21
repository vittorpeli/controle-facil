import { ComponentPresentation } from "~/features/styles-guide/ComponentPresentation";
import { Nav } from "~/ui/nav";

const pages = [
    { label: "Typography", to: "/styles-guide/typography" },
    { label: "Spacing", to: "/styles-guide/spacing" },
    { label: "Button", to: "/styles-guide/button" },
    { label: "Colors", to: "/styles-guide/colors" },
]

export default function StylesGuideNav() {
    return (
        <>
            <h1 className="cluster">Navigation</h1>
            <p className="mt-xs">
                <code className="text-primary">{"<Nav />"}</code>
            </p>
            <ComponentPresentation 
                component={<Nav title="Title" subtitle="Subtitle" userData={{ name: "John Doe", membershipStatus: "Premium Member" }} pages={pages} />} 
                source={`<Nav title="Title" subtitle="Subtitle" userData={{ name: "John Doe", membershipStatus: "Premium Member" }} pages={pages} />`}
            />
        </>
    )
}