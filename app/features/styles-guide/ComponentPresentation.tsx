export const ComponentPresentation = ({ component, source }: { component: React.ReactNode; source: string }) => {
    return (
        <div className="flow">
            {component}
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