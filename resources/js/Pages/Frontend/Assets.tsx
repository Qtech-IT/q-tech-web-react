import { Card, CardContent } from "@/Components/UI/Card";
import { useTranslations } from "@/Hooks/useTranslations";
import UserLayout from "@/Layouts/FrontendLayout";

export default function Assets({
    balance,
    currency,
    totalTrades,
    tradeLoss,
    tradeWin,
    totalTradeAmount,
    totalDepositAmount,
    totalWithdrawAmount,
    winRatio,
}: any) {

    const { t } = useTranslations();

    const format = (num: number) =>
        (num || 0);

    return (
        <UserLayout title="Assets">
            <div className="max-w-xl mx-auto px-4 py-6 space-y-4">

                {/* ── BALANCE ───────────────── */}
                <Card
                    className="border"
                    style={{
                        background: "#ffffff",
                        borderColor: "#e2e8f0",
                    }}
                >
                    <CardContent className="py-6 text-center">
                        <p className="text-sm" style={{ color: "#64748b" }}>
                            {t("Total Balance")}
                        </p>
                        <h2 className="text-3xl font-bold mt-1" style={{ color: "#0f172a" }}>
                            {format(balance)} {currency}
                        </h2>
                    </CardContent>
                </Card>

                {/* ── QUICK STATS ───────────────── */}
                <div className="grid grid-cols-2 gap-3">

                    <Card
                        className="border"
                        style={{
                            background: "#ffffff",
                            borderColor: "#e2e8f0",
                        }}
                    >
                        <CardContent className="py-4">
                            <p className="text-xs" style={{ color: "#64748b" }}>
                                {t("Deposits")}
                            </p>
                            <p className="font-semibold mt-1" style={{ color: "#0f172a" }}>
                                {format(totalDepositAmount)} {currency}
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className="border"
                        style={{
                            background: "#ffffff",
                            borderColor: "#e2e8f0",
                        }}
                    >
                        <CardContent className="py-4">
                            <p className="text-xs" style={{ color: "#64748b" }}>
                                {t("Withdrawals")}
                            </p>
                            <p className="font-semibold mt-1" style={{ color: "#0f172a" }}>
                                {format(totalWithdrawAmount)} {currency}
                            </p>
                        </CardContent>
                    </Card>

                </div>

                {/* ── TRADING STATS ───────────────── */}
                <Card
                    className="border"
                    style={{
                        background: "#ffffff",
                        borderColor: "#e2e8f0",
                    }}
                >
                    <CardContent className="py-5 space-y-3">

                        <div className="flex justify-between text-sm">
                            <span style={{ color: "#64748b" }}>{t("Total Trades")}</span>
                            <span style={{ color: "#0f172a" }}>{totalTrades}</span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span style={{ color: "#64748b" }}>{t("Trade Volume")}</span>
                            <span style={{ color: "#0f172a" }}>
                                {format(totalTradeAmount)} {currency}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span style={{ color: "#64748b" }}>{t("Profit")}</span>
                            <span style={{ color: "#16a34a" }}>
                                +{format(tradeWin)} {currency}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span style={{ color: "#64748b" }}>{t("Loss")}</span>
                            <span style={{ color: "#dc2626" }}>
                                -{format(tradeLoss)} {currency}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span style={{ color: "#64748b" }}>{t("Win Ratio")}</span>
                            <span style={{ color: "#2563eb", fontWeight: 500 }}>
                                {winRatio}%
                            </span>
                        </div>

                    </CardContent>
                </Card>

            </div>
        </UserLayout>
    );
}