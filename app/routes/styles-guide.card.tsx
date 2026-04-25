import { Zap } from "lucide-react";
import { Link } from "react-router";
import { ComponentPresentation } from "~/features/styles-guide/ComponentPresentation";
import { Card, CardContent, CardHeader } from "~/ui/card";

const exampleCard = () => (
    <Card className="flow flow-space-2xl" style={{ "--gutter": "var(--spacing-l)" } as React.CSSProperties}>
        <CardHeader>
            <div className="repel">
                <h4>Monthly Savings</h4>
                <Zap />
            </div>
        </CardHeader>
        <CardContent>
            <div className="flow flow-space-s">
                <span className="font-bold text-step-5">$450</span>
                <p>65% of goal</p>
            </div>
        </CardContent>
    </Card>
)

export default function StylesGuideCard() {
    return (
        <>
            <h1 className="cluster">Card</h1>
            <p className="mt-xs">
                <code className="text-primary">{"<Card />"}</code>
            </p>
            <nav className="cluster gutter-xs mb-xl" aria-label="variants">
                <Link className="button" data-type="badge" to="#secondary">No Header</Link>
                <Link className="button" data-type="badge" to="#link">Link</Link>
            </nav>
            <ComponentPresentation
                component={exampleCard()}
                source={`
<Card className="flow flow-space-2xl" style={{ "--gutter": "var(--spacing-l)" } as React.CSSProperties}>
    <CardHeader>
        <div className="repel">
            <h4>Monthly Savings</h4>
            <Zap />
        </div>
    </CardHeader>
    <CardContent>
        <div className="flow flow-space-s">
            <span className="font-bold text-step-5">$ 450</span>
            <p>65% of goal</p>
        </div>
    </CardContent>
</Card>                
                `}
            />
        </>
    )
}