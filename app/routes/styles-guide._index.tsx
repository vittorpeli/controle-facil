export default function StylesGuideIndex() {
    return (
        <>
            <h1 className="cluster">Styles guide</h1>
            <p>It’s recommended that you use <span className="font-bold">this system as the single source of truth</span> for the UI.</p>
            <div className="flow">
                <h2>Design Tokens</h2>
                <p>Design tokens are the basic building blocks of the design system. They include colors, typography, and spacing.</p>
            </div>
            <div className="flow">
                <h2>CSS</h2>
                <p>Use the CSS utilities and layout compositions to build your UI. If you find yourself writing custom CSS, consider adding a new utility or composition to the system.</p>
            </div>
            <div className="flow">
                <h2>Components</h2>
                <p>Use the components to build your UI. If you find yourself writing custom CSS for a component, consider adding a new component to the system.</p>
            </div>
        </>
    )
}