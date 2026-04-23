import { ComponentPresentation } from "~/features/styles-guide/ComponentPresentation";
import * as Chart from "~/ui/chart";

const sampleLegend = [
    { label: 'Receita', colorClass: 'bg-primary' },
    { label: 'Despesa', colorClass: 'bg-dark-glare' },
]

const exampleChart = () => (
    <Chart.ChartContainer height={300}>
        <Chart.ChartLegend item={sampleLegend} />
        <Chart.ChartCanvas height={300}>
            <Chart.ChartLine
                path="M0,200 C250,100 750,300 1000,150"
                color="var(--color-primary)"
                strokeWidth="3"
            />

            <Chart.ChartArea 
                path="M0,200 C250,100 750,300 1000,150 L1000,300 L0,300 Z"
            />

            <Chart.ChartLine
                path="M0,250 C250,150 750,350 1000,200"
                color="var(--color-dark-glare)"
                dashed={true}
            />
        </Chart.ChartCanvas>
    </Chart.ChartContainer>
)

export default function StylesGuideChart() {
    return (
        <>
            <h1 className="cluster">Chart</h1>
            <p className="mt-xs">
                <code className="text-primary font-mono">{"<Chart />"}</code>
            </p>
            <ComponentPresentation 
                component={exampleChart()}
                source={`
<Chart.ChartContainer height={300}>
    <Chart.ChartLegend item={sampleLegend} />
    <Chart.ChartCanvas height={300}>
        <Chart.ChartLine
            path="M0,200 C250,100 750,300 1000,150"
            color="#047857"
            strokeWidth="3"
        />

        <Chart.ChartArea 
            path="M0,200 C250,100 750,300 1000,150 L1000,300 L0,300 Z"
            fillUrl="url(#incomeGrad)"
        />

        <Chart.ChartLine
            path="M0,250 C250,150 750,350 1000,200"
            color="#DC2626"
        />
    </Chart.ChartCanvas>
</Chart.ChartContainer>
                `}
            />
        </>
    )
}