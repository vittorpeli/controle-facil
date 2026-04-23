import { useMemo } from "react";

interface ChartData {
    income: number;
    expense: number;
}

interface HookReturn {
    incomePath: string;
    expensePath: string;
    areaPath: string;
}

export function useChartPath(data: ChartData[], height: number, width: number = 1000): HookReturn {
    return useMemo(() => {
        if (!data || data.length === 0) return {incomePath: '', expensePath: '', areaPath: ''};

        const maxVal = Math.max(...data.map(d => Math.max(d.income, d.expense))) || 1;
        const xScale = width / (data.length - 1 || 1);

        const getCoordinates = (key: 'income' | 'expense') => data.map((d, i) => {
            const x = i * xScale;
            const y = height - (d[key] / maxVal) * height;
            return `${x},${y}`;
        })

        const incomeCoords = getCoordinates('income');
        const expenseCoords = getCoordinates('expense');

        const incomePath = `M${incomeCoords.join(' ')}`
        const expensePath = `M${expenseCoords.join(' ')}`
        const areaPath = `${incomePath} L ${width},${height} L 0,${height} Z`

        return { incomePath, expensePath, areaPath };
    }, [data, height, width]);
}