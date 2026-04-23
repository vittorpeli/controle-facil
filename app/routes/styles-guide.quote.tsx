import { Link } from "react-router";
import { ComponentPresentation } from "~/features/styles-guide/ComponentPresentation";
import { Quote } from "~/ui/Quote";

export default function StylesGuideQuote() {
    return (
        <>
            <h1 className="cluster">Quote</h1>
            <p className="mt-xs">
                <code className="text-primary">{"<Quote />"}</code>
            </p>
            <Link to="#with-icon" className="button">With Icon</Link>
            <hr />
            <ComponentPresentation 
                component={<Quote title="Title" description="Description" />}
                source={"<Quote title=\"Title\" description=\"Description\" />"}
            />
            <h3 id="with-icon">With Icon</h3>
            <ComponentPresentation 
                component={<Quote title="Title" description="Description" quoteIcon={<span>💬</span>} />}
                source={"<Quote title=\"Title\" description=\"Description\" quoteIcon={<span>💬</span>} />"}
            />
        </>
    )
}