const colors = [
  {
    num: 0,
    name: 'Primary',
    hexCode: '#032126',
    cssProperty: 'var(--color-primary)',
    textColorClass: '.text-primary',
    bgUtilityClass: '.bg-primary',
  },
  {
    num: 1,
    name: 'Dark',
    hexCode: '#000405',
    cssProperty: 'var(--color-dark)',
    textColorClass: '.text-dark',
    bgUtilityClass: '.bg-dark',
  },
  {
    num: 2,
    name: 'Dark Glare',
    hexCode: '#375257',
    cssProperty: 'var(--color-dark-glare)',
    textColorClass: '.text-dark-glare',
    bgUtilityClass: '.bg-dark-glare',
  },
  {
    num: 3,
    name: 'Secondary',
    hexCode: '#A7D5B8',
    cssProperty: 'var(--color-secondary)',
    textColorClass: '.text-secondary',
    bgUtilityClass: '.bg-secondary',
  },
  {
    num: 4,
    name: 'Light',
    hexCode: '#E8ECE9',
    cssProperty: 'var(--color-light)',
    textColorClass: '.text-light',
    bgUtilityClass: '.bg-light',
  },
  {
    num: 5,
    name: 'Error',
    hexCode: '#ba1a1a',
    cssProperty: 'var(--color-error)',
    textColorClass: '.text-error',
    bgUtilityClass: '.bg-error',
  },
]

export default function Colors() {
  return (
        <>
            <h1>Colors</h1>
            <p>You can either use colors directly, using a CSS Custom Property, or with generated CSS utility classes.</p>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Hex Code</th>
                        <th>CSS Custom Property</th>
                        <th>Color Utility Class</th>
                        <th>BG Utility Class</th>
                    </tr>
                </thead>
                <tbody>
                    {colors.map(color => (
                        <tr key={color.num}>
                            <td>
                                <div className="cluster items-center gutter-s" style={{ flexWrap: 'nowrap' }}>
                                    <div className="styles-guide__swatch" style={{ backgroundColor: color.hexCode }} role="presentation" />
                                    <strong>{color.name}</strong>
                                </div>
                            </td>
                            <td><code>{color.hexCode}</code></td>
                            <td><code>{color.cssProperty}</code></td>
                            <td><code>{color.textColorClass}</code></td>
                            <td><code>{color.bgUtilityClass}</code></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}
