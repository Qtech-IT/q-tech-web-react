import { Button } from "@/Components/UI/Button";
import { Card, CardContent } from "@/Components/UI/Card";
import { Input } from "@/Components/UI/Input";
import { useTranslations } from "@/Hooks/useTranslations";
import UserLayout from "@/Layouts/FrontendLayout";
import { useForm } from "@inertiajs/react";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export default function Withdrawal({
    title,
    wallet_address,
    withdrawal_fee,
    available_balance,
    currency,
    min_withdraw = 0,
    max_withdraw = 0,
}: any) {
    const { t } = useTranslations();
    const [copied, setCopied] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        amount: "",
        wallet_address: wallet_address || "",
    });

    const copyAddress = () => {
        if (!wallet_address) return;
        navigator.clipboard.writeText(wallet_address);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const submit = () => {
        post(route("user.withdrawal.request"));
    };

    const amount = parseFloat(data.amount || "0");

    const feeAmount =
        withdrawal_fee > 0 ? (amount * withdrawal_fee) / 100 : 0;

    const receiveAmount = amount - feeAmount;

    return (
        <UserLayout title={title}>
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-5 bg-gray-50 min-h-screen">


                {/* ── BALANCE CARD ── */}
                <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
                    <CardContent className="py-6 text-center">
                        <p className="text-sm text-gray-500">
                            {t("Available Balance")}
                        </p>
                        <h2 className="text-3xl font-bold text-gray-900 mt-1">
                            {available_balance} {currency}
                        </h2>
                    </CardContent>
                </Card>

                {/* ── WALLET CARD ── */}
                <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
                    <CardContent className="py-5 space-y-3 text-center">

                        <p className="text-sm text-gray-500">
                            {t("Your Withdrawal Wallet")}
                        </p>

                        <p className="text-sm text-gray-800 break-all font-medium">
                            {wallet_address || t("No wallet added")}
                        </p>

                        {/* CENTERED COPY BUTTON */}
                        <div className="flex justify-center pt-2">
                            <Button
                                onClick={copyAddress}
                                className="flex items-center gap-2 px-5 py-2 rounded-lg transition-all"
                                style={{
                                    background: copied ? "#16a34a" : "#2563eb",
                                    color: "#fff",
                                    boxShadow: "0 4px 14px rgba(37,99,235,0.25)",
                                }}
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                {copied ? t("Copied") : t("Copy Address")}
                            </Button>
                        </div>

                    </CardContent>
                </Card>

                {/* ── INPUT CARD ── */}
                <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
                    <CardContent className="py-5 space-y-4">

                        <Input
                            type="number"
                            placeholder={t("Enter amount")}
                            className="h-11 border-gray-200 focus:border-blue-500"
                            value={data.amount}
                            onChange={(e) => setData("amount", e.target.value)}
                        />

                        {withdrawal_fee > 0 && (
                            <p className="text-xs text-gray-500">
                                {t("Fee")} {withdrawal_fee}% {t("will be deducted")}
                            </p>
                        )}

                        {amount > 0 && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm space-y-1">
                                {withdrawal_fee > 0 && (
                                    <p className="text-gray-600">
                                        {t("Fee")}:{" "}
                                        <span className="text-gray-900 font-medium">
                                            {feeAmount.toFixed(6)} {currency}
                                        </span>
                                    </p>
                                )}

                                <p className="text-gray-600">
                                    {t("You will receive")}:{" "}
                                    <span className="text-green-600 font-semibold">
                                        {receiveAmount > 0 ? receiveAmount.toFixed(2) : 0} {currency}
                                    </span>
                                </p>
                            </div>
                        )}

                        {errors.amount && (
                            <p className="text-red-500 text-xs">
                                {errors.amount}
                            </p>
                        )}

                    </CardContent>
                </Card>

                {/* ── SUBMIT ── */}
                <Button
                    disabled={processing}
                    onClick={submit}
                    className="w-full h-11 rounded-lg font-semibold"
                    style={{
                        background: "#2563eb",
                        color: "#fff",
                        boxShadow: "0 6px 18px rgba(37,99,235,0.25)",
                    }}
                >
                    {t("Request Withdrawal")}
                </Button>

            </div>
        </UserLayout>
    );
}