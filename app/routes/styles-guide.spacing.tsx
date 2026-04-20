const spacing = [
    { num: 0, name: 'spacing-3xs', min: '4px', max: '4.96px' },
    { num: 1, name: 'spacing-2xs', min: '10px', max: '12px' },
    { num: 2, name: 'spacing-xs', min: '12px', max: '15px' },
    { num: 3, name: 'spacing-s', min: '16px', max: '20px' },
    { num: 4, name: 'spacing-m', min: '24px', max: '30px' },
    { num: 5, name: 'spacing-l', min: '32px', max: '40px' },
    { num: 6, name: 'spacing-xl', min: '48px', max: '60px' },
    { num: 7, name: 'spacing-2xl', min: '64px', max: '80px' },
    { num: 8, name: 'spacing-s-m', min: '16px', max: '36px' },
    { num: 9, name: 'spacing-s-l', min: '16px', max: '48px' },
    { num: 10, name: 'spacing-m-xl', min: '24px', max: '60px' },
    { num: 11, name: 'spacing-l-2xl', min: '32px', max: '80px' },
]

export default function Spacing() {
    return (
        <>
            <h1>Spacing</h1>
            <p>Spacing follows a fluid scale, meaning that text scales based on the size of the viewport and follows a sizing ratio.</p>
            <table>
                <thead>
                    <tr>
                        <th style={{ width: '100px' }} />
                        <th>Name</th>
                        <th>Min</th>
                        <th>Max</th>
                    </tr>
                </thead>
                <tbody>
                    {spacing.map(sp => (
                        <tr key={sp.num}>
                            <td>
                                <div className="bg-primary p-[3px]" style={{ minHeight: sp.min }} />
                            </td>
                            <td><code>{sp.name}</code></td>
                            <td><code>{sp.min}</code></td>
                            <td><code>{sp.max}</code></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}