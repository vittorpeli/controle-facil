import { ShoppingBag } from "lucide-react";
import { ComponentPresentation } from "~/features/styles-guide/ComponentPresentation";
import { Table, TableBody, TableCell, TableCellIcon, TableHead, TableHeader, TableRow } from "~/ui/table";

const exampleTable = () => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
            </TableRow>
        </TableHeader>

        <TableBody>
            <TableRow>
                <TableCell>Oct 24</TableCell>
                <TableCell>Starbucks</TableCell>
                <TableCell>Food &amp; Dining</TableCell>
                <TableCell>-$5.40</TableCell>
            </TableRow>

            <TableRow>
                <TableCell>Oct 23</TableCell>
                <TableCell>
                    <TableCellIcon><ShoppingBag /></TableCellIcon>
                    Whole Foods
                </TableCell>
                <TableCell>Groceries</TableCell>
                <TableCell>-$142.30</TableCell>
            </TableRow>
        </TableBody>
    </Table>
)

export default function StylesGuideTable () {
    return <>
            <h1 className="cluster">Table</h1>
            <p className="mt-xs">
                <code className="text-primary">{"<Table />"}</code>
            </p>
            <hr />
            <ComponentPresentation 
                component={exampleTable()}
                source={`
<Table>
    <TableHeader>
        <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
        </TableRow>
    </TableHeader>

    <TableBody>
        <TableRow>
            <TableCell>Oct 24</TableCell>
            <TableCell>Starbucks</TableCell>
            <TableCell>Food &amp; Dining</TableCell>
            <TableCell>-$5.40</TableCell>
        </TableRow>

        <TableRow>
            <TableCell>Oct 23</TableCell>
            <TableCell>
                <TableCellIcon><ShoppingBag /></TableCellIcon>
                Whole Foods
            </TableCell>
            <TableCell>Groceries</TableCell>
            <TableCell>-$142.30</TableCell>
        </TableRow>
    </TableBody>
</Table>
                `}
            />
        </>
}