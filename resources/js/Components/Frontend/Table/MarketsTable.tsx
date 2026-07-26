import { Card } from "@/Components/UI/Card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/UI/Table"
import { Link } from "@inertiajs/react"

export default function MarketsTable({ rawList }: any) {
    return (
        <div>
            {/* HEADER */}
            <div className="flex justify-between mb-3">
                <h2 className="font-bold text-lg">Markets</h2>
                <Link href="/market" className="text-primary text-sm">
                    See all →
                </Link>
            </div>

            <Card className="rounded-2xl border shadow-sm overflow-hidden">

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[60px]">#</TableHead>
                            <TableHead>Coin</TableHead>
                            <TableHead className="text-right w-[140px]">Price</TableHead>
                            <TableHead className="text-right w-[100px]">24h</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {rawList.slice(0, 10).map((c: any, i: number) => (
                            <TableRow
                                key={c.id}
                                className="cursor-pointer hover:bg-muted/40"
                            >
                                {/* INDEX */}
                                <TableCell className="text-muted-foreground">
                                    {i + 1}
                                </TableCell>

                                {/* COIN */}
                                <TableCell>
                                    <Link
                                        href={`/user/trade/${c.id}`}
                                        className="flex items-center gap-3"
                                    >
                                        {c.images?.small ? (
                                            <img
                                                src={c.images.small}
                                                className="h-9 w-9 rounded-full"
                                            />
                                        ) : (
                                            <div className="h-9 w-9 rounded-full bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                                                {c.symbol?.slice(0, 2)}
                                            </div>
                                        )}

                                        <div>
                                            <p className="font-semibold text-sm">
                                                {c.symbol}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {c.name}
                                            </p>
                                        </div>
                                    </Link>
                                </TableCell>

                                {/* PRICE */}
                                <TableCell className="text-right  font-bold">
                                    ${formatPrice(c.usd_price)}
                                </TableCell>

                                {/* CHANGE */}
                                <TableCell className="text-right">
                                    <span
                                        className={`font-semibold text-xs ${c.price_change_24h >= 0
                                            ? "text-green-500"
                                            : "text-red-500"
                                            }`}
                                    >
                                        {c.price_change_24h >= 0 ? "+" : ""}
                                        {Number(c.price_change_24h).toFixed(2)}%
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </Card>
        </div>
    )
}

/* HELPERS */
function formatPrice(p: any) {
    if (!p) return "—"
    const n = Number(p)
    if (n >= 1000) return n.toLocaleString()
    if (n >= 1) return n.toFixed(4)
    return n.toFixed(6)
}