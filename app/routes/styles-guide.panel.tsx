import { Compass } from "lucide-react";
import { ComponentPresentation } from "~/features/styles-guide/ComponentPresentation";
import { Panel, PanelControls, PanelInfo } from "~/ui/panel";

export default function StylesGuidePanel () {
    return <>
            <h1 className="cluster">Panel</h1>
            <p className="mt-xs">
                <code className="text-primary">{"<Panel />"}</code>
            </p>
            <hr />
            <ComponentPresentation
                component={
                    <Panel title="Impact Simulator" icon={<Compass />}>
                        <PanelControls>Controls</PanelControls>
                        <PanelInfo>Card</PanelInfo>
                    </Panel>
                }
                source={"<Panel />"}
            />
        </>
}