import { BanknoteArrowDown } from "lucide-react";

interface TransactionProps {
    title: string;
    date: Date;
    value: number;
    transactionIcon?: React.ReactNode;
}

export function Transaction({ title, date, value, transactionIcon }: TransactionProps) {
    return (
        <div className="transaction wrapper repel py-xs shadow-sm">
            <div className="transaction__main">
                <div className="transaction__icon">
                    {transactionIcon || <BanknoteArrowDown />}
                </div>

                <div className="transaction__details">
                    <span className="transaction_title cluster font-medium">{title}</span>
                    <span className="transaction_date text-step--2">
                        {date.toLocaleDateString('pt-BR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </span>
                </div>
            </div>

            <div className="transaction__value">
                <span className="font-mono font-medium text-step--1">R$ {value.toFixed(2)}</span>
            </div>
        </div>
    )
}