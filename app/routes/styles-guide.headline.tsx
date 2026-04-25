import { ComponentPresentation } from "~/features/styles-guide/ComponentPresentation";
import { Headline } from "~/ui/headline";

export default function StylesGuideHeadline() {
    return (
        <>
            <h1 className="cluster">Headline</h1>
            <p className="mt-xs">
                <code className="text-primary">{"<Headline />"}</code>
            </p>
            <hr />
            <ComponentPresentation 
                component={<Headline title="Title">View more</Headline>}
                source={"<Headline title=\"Title\" description=\"Description\" />"}
            />
        </>
    )
}