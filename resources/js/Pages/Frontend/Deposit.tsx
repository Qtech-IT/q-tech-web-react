import { Button } from "@/Components/UI/Button";
import { Card, CardContent } from "@/Components/UI/Card";
import { Input } from "@/Components/UI/Input";
import { useTranslations } from "@/Hooks/useTranslations";
import UserLayout from "@/Layouts/FrontendLayout";
import { useForm } from "@inertiajs/react";
import { Check, Copy, Upload } from "lucide-react";
import { useEffect, useState } from "react";

export default function Deposit({
    cryptos,
    title,
    deposit_fee,
    currency_symbol,
    default_currency,
    minimum_deposit_amount,
    maximum_deposit_amount,
}: any) {
    const { t } = useTranslations();

    const [selectedCrypto, setSelectedCrypto] = useState(cryptos[0]);
    const [selectedNetwork, setSelectedNetwork] = useState(
        cryptos[0]?.wallet_addresses?.[0]?.network || null
    );
    const [copied, setCopied] = useState(false);
    const [voucherPreview, setVoucherPreview] = useState<string | null>(null);

    const wallet = selectedCrypto?.wallet_addresses?.find(
        (w: any) => w.network === selectedNetwork
    );

    const { data, setData, post, processing } = useForm({
        amount: "",
        voucher: null as File | null,
        crypto_id: selectedCrypto?.id,
        network: selectedNetwork,
        wallet_address: wallet?.address || "",
    });

    useEffect(() => {
        setData("crypto_id", selectedCrypto?.id || null);
        setData("network", selectedNetwork || null);
        setData("wallet_address", wallet?.address || "");
    }, [selectedCrypto, selectedNetwork, wallet]);

    const copyAddress = () => {
        if (!wallet?.address) return;
        navigator.clipboard.writeText(wallet.address);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const submit = () => {
        post(route("user.deposit.request"), {
            forceFormData: true,
            onSuccess: () => {
                setData("amount", "");
                setData("voucher", null);
                setVoucherPreview(null);
            },
        });
    };

    return (
        <UserLayout title={title}>
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-5 bg-gray-50 min-h-screen">


                {/* COIN SELECT */}
                <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap py-2 px-1">
                    {cryptos.map((coin: any) => (
                        <button
                            key={coin.id}
                            onClick={() => {
                                setSelectedCrypto(coin);
                                setSelectedNetwork(
                                    coin.wallet_addresses?.[0]?.network || null
                                );
                            }}
                            className={`flex items-center gap-2 h-9 px-3 rounded-full text-xs
                                shrink-0 max-w-[120px] overflow-hidden transition-all
                                ${selectedCrypto.id === coin.id
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
                        >
                            <div className="w-5 h-5 rounded-full overflow-hidden">
                                <img
                                    src={coin.images.thumb}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <span className="truncate">
                                {coin.symbol}
                            </span>
                        </button>
                    ))}
                </div>

                {/* NETWORK */}
                <div className="grid grid-cols-2 gap-2">
                    {selectedCrypto.wallet_addresses?.length ? (
                        selectedCrypto.wallet_addresses.map((w: any) => (
                            <button
                                key={w.id}
                                onClick={() => setSelectedNetwork(w.network)}
                                className={`py-2 rounded-lg text-sm font-medium transition-all
                                    ${selectedNetwork === w.network
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
                            >
                                {w.network}
                            </button>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm col-span-2 text-center">
                            {t("No network available")}
                        </p>
                    )}
                </div>

                {/* QR + ADDRESS */}
                {wallet && (
                    <Card className="bg-white border border-gray-200 shadow-sm rounded-xl text-center">
                        <CardContent className="py-6 space-y-4">

                            <div className="flex justify-center">
                                <img
                                    src={`/storage/${wallet.qr_code_path}`}
                                    className="w-44 h-44 rounded-2xl bg-white p-3 border border-gray-200 shadow-sm"
                                />
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    {t("Deposit to the following address")}
                                </p>
                                <p className="text-sm break-all mt-1 text-gray-900">
                                    {wallet.address}
                                </p>
                            </div>

                            <div className="flex justify-center">
                                <Button
                                    onClick={copyAddress}
                                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 shadow-sm"
                                >
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                    {copied ? "Copied" : "Copy"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* VOUCHER */}
                <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
                    <CardContent className="py-6 text-center space-y-4">

                        {/* Label */}
                        <div>
                            <p className="text-sm font-medium text-gray-700">
                                {t("Upload Payment Voucher")}
                                <span className="text-red-500 ml-1">*</span>
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                {t("Upload screenshot or proof of your payment")}
                            </p>
                        </div>

                        {/* Upload Box */}
                        <label className="cursor-pointer block">
                            <div
                                className={`w-44 h-44 mx-auto rounded-2xl border flex items-center justify-center overflow-hidden transition-all
                ${voucherPreview
                                        ? "border-gray-300 bg-gray-50"
                                        : "border-red-400 bg-red-50 hover:bg-red-100 animate-pulse"
                                    }`}
                            >
                                {voucherPreview ? (
                                    <img
                                        src={voucherPreview}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Upload className="text-red-400" size={28} />
                                )}
                            </div>

                            {/* Hidden Input */}
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e: any) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    setData("voucher", file);

                                    const previewUrl = URL.createObjectURL(file);
                                    setVoucherPreview(previewUrl);
                                }}
                            />
                        </label>

                        {/* Error Message */}
                        {!data.voucher && (
                            <p className="text-xs text-red-500">
                                {t("Voucher is required")}
                            </p>
                        )}

                    </CardContent>
                </Card>

                {/* AMOUNT */}
                <div className="space-y-2">
                    <Input
                        placeholder={t("Enter amount")}
                        className="bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-900 h-11 rounded-lg"
                        value={data.amount}
                        type="number"
                        min={0}
                        onChange={(e) => setData("amount", e.target.value)}
                    />

                    {deposit_fee > 0 && (
                        <p className="text-xs text-gray-500">
                            {t("A fee of")}{" "}
                            <span className="text-gray-900 font-medium">
                                {deposit_fee}%
                            </span>{" "}
                            {t("will be applied")}
                        </p>
                    )}
                </div>

                {/* EXTRA NOTE */}
                <p className="text-xs text-gray-400 text-center">
                    {t("Make sure the network matches before sending funds")}
                </p>

                {/* SUBMIT */}


                <Button
                    disabled={processing}
                    onClick={submit}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 shadow-sm active:scale-[0.98] transition"
                >
                    {t("Submit for review")}
                </Button>



            </div>
        </UserLayout>
    );
}