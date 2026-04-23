import { ComponentPresentation } from "~/features/styles-guide/ComponentPresentation";
import { Transaction } from "~/ui/Transaction";

export default function StylesGuideTransaction() {
    return (
        <>
            <h1 className="cluster">Transactions</h1>
            <p className="mt-xs">
                <code className="text-primary">{"<Transaction />"}</code>
            </p>
            <hr />
            <ComponentPresentation 
                component={<Transaction title="Internet" date={new Date()} value={85.0} />}
                source={"<Transaction title=\"Internet\" date={new Date()} value={85.0} />"}
            />
        </>
    )
}