
const cssUsage = [
    { step: 0, utilityClass: '.text-step-0', cssProperty: 'var(--text-step-0)' },
    { step: 1, utilityClass: '.text-step-1', cssProperty: 'var(--text-step-1)' },
    { step: 2, utilityClass: '.text-step-2', cssProperty: 'var(--text-step-2)' },
    { step: 3, utilityClass: '.text-step-3', cssProperty: 'var(--text-step-3)' },
    { step: 4, utilityClass: '.text-step-4', cssProperty: 'var(--text-step-4)' },
    { step: 5, utilityClass: '.text-step-5', cssProperty: 'var(--text-step-5)' },
]

const lineHeights = [
    { step: 0, item: 'Micro', cssProperty: 'var(--leading-micro)' },
    { step: 1, item: 'Flat', cssProperty: 'var(--leading-flat)' },
    { step: 2, item: 'Fine', cssProperty: 'var(--leading-fine)' },
    { step: 3, item: 'Standard', cssProperty: 'var(--leading-standard)' },
    { step: 4, item: 'Loose', cssProperty: 'var(--leading-loose)' },
]

const weights = [
    { step: 0, item: 'Regular', cssProperty: 'var(--font-weight-regular)' },
    { step: 1, item: 'Medium', cssProperty: 'var(--font-weight-medium)' },
    { step: 2, item: 'Bold', cssProperty: 'var(--font-weight-bold)' },
    { step: 3, item: 'Black', cssProperty: 'var(--font-weight-black)' },
]

const fonts = [
    { step: 0, item: 'Base', cssProperty: 'var(--font-base)' },
    { step: 1, item: 'Mono', cssProperty: 'var(--font-mono)' },
    { step: 2, item: 'Display', cssProperty: 'var(--font-display)' },
    { step: 3, item: 'Serif', cssProperty: 'var(--font-serif)' },
]

export default function Typography() {
    return (
        <>
            <h1>Typography</h1>

            <hr />

            <div className="flow">
                <h2>Sizes</h2>
                <p>Text sizes follow a fluid scale, meaning that text scales based on the size of the viewport and follows a sizing ratio.</p>
                <div>
                    <p className="text-step-0">Step-0</p>
                    <p className="text-step-1">Step-1</p>
                    <p className="text-step-2">Step-2</p>
                    <p className="text-step-3">Step-3</p>
                    <p className="text-step-4">Step-4</p>
                    <p className="text-step-5">Step-5</p>
                </div>
            </div>

            <hr />

            <div className="flow">
                <h2>Usage</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Utility Class</th>
                            <th>CSS Custom Property</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cssUsage.map((item) => (
                            <tr key={item.step}>
                                <td><code>{item.utilityClass}</code></td>
                                <td><code>{item.cssProperty}</code></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <hr />

            <div className="flow">
                <h2>Leading (line height)</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>CSS Custom Property</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lineHeights.map((item) => (
                            <tr key={item.step}>
                                <td><code>{item.item}</code></td>
                                <td><code>{item.cssProperty}</code></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flow">
                <h2>Weights</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>CSS Custom Property</th>
                        </tr>
                    </thead>
                    <tbody>
                        {weights.map((item) => (
                            <tr key={item.step}>
                                <td><code>{item.item}</code></td>
                                <td><code>{item.cssProperty}</code></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flow">
                <h2>Fonts</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>CSS Custom Property</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fonts.map((item) => (
                            <tr key={item.step}>
                                <td><code>{item.item}</code></td>
                                <td><code>{item.cssProperty}</code></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}