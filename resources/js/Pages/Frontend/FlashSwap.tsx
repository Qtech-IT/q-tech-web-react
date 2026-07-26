import { Button } from '@/Components/UI/Button'
import { useTranslations } from '@/Hooks/useTranslations'
import UserLayout from '@/Layouts/FrontendLayout'
import { ArrowLeftRight } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

const ACCOUNTS = ['Options account', 'Funds account', 'Quant trading account']

const COIN_COLORS: Record<string, string> = {
    USDT: '#26a17b',
    BTC: '#f7931a',
    ETH: '#627eea',
    BNB: '#f3ba2f',
    SOL: '#9945ff',
    XRP: '#346aa9',
}

export default function FlashSwap({
    cryptos = [],
    availableBalance = 0,
    defaultFrom = 'USDT',
    defaultTo = 'USDC',
    title
}: any) {

    const rawList = cryptos?.data || cryptos || []

    const [fromCoin, setFromCoin] = useState(defaultFrom)
    const [toCoin, setToCoin] = useState(defaultTo)
    const [account, setAccount] = useState('Options account')
    const [quantity, setQuantity] = useState('')

    const [coinSheet, setCoinSheet] = useState<'from' | 'to' | null>(null)
    const [accSheet, setAccSheet] = useState(false)
    const [pendingAcc, setPendingAcc] = useState(account)

    const { t } = useTranslations();

    const swapCoins = () => {
        setFromCoin(toCoin)
        setToCoin(fromCoin)
    }

    const handleSwap = () => {
        toast.error('Flash Swap not available yet', { position: 'bottom-center' })
    }

    const confirmAccount = () => {
        setAccount(pendingAcc)
        setAccSheet(false)
    }

    const coinColor = (sym: string) =>
        COIN_COLORS[sym?.toUpperCase()] || '#6366f1'

    return (
        <UserLayout title={title}>
            {/* <div className="bg-white min-h-screen flex flex-col"> */}
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-5 bg-gray-50 min-h-screen">


                {/* ── COIN SWAP HEADER ── */}
                <div className="grid grid-cols-3 items-start px-4 py-5">

                    {/* FROM */}
                    <div
                        onClick={() => setCoinSheet('from')}
                        className="text-left cursor-pointer flex flex-col justify-between min-h-[52px]"
                    >
                        <p className="text-[17px] sm:text-[18px] font-semibold text-gray-900">
                            {fromCoin}
                        </p>

                        <p className="text-sm text-gray-400 mt-1">
                            {t('Available')} {Number(availableBalance).toFixed(2)} {fromCoin}
                        </p>
                    </div>

                    {/* SWAP CENTER */}
                    <div className="flex justify-center items-center">
                        <button
                            onClick={swapCoins}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"
                        >
                            <ArrowLeftRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>

                    {/* TO */}
                    <div
                        onClick={() => setCoinSheet('to')}
                        className="text-right cursor-pointer flex flex-col justify-between min-h-[52px]"
                    >
                        <p className="text-[16px] sm:text-[18px] font-semibold text-gray-900">
                            {toCoin}
                        </p>

                        {/* empty space to balance layout */}
                        <p className="text-sm text-transparent mt-1 select-none">
                            placeholder
                        </p>
                    </div>
                </div>

                {/* ── DIVIDER ── */}
                <div className="h-1.5 bg-gray-100" />

                {/* ── ACCOUNT SELECT ── */}
                <div
                    className="flex items-center justify-between px-4 py-4 border-b border-gray-100 cursor-pointer"
                    onClick={() => {
                        setPendingAcc(account)
                        setAccSheet(true)
                    }}
                >
                    <p className="text-sm text-gray-500">{t('Account')}</p>
                    <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                        {account}
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </p>
                </div>

                {/* ── AMOUNT INPUT ── */}
                <div className="px-4 pt-5 pb-4">
                    <p className="text-sm text-gray-500 mb-3">
                        {t('Exchange quantity')}
                    </p>

                    <div className="flex items-center border-b border-gray-200 pb-3 gap-2">
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder={t('Please enter the exchange quantity')}
                            className="flex-1 text-[15px] bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-300"
                        />

                        <div className="flex items-center gap-2 text-sm text-gray-400 flex-shrink-0">
                            <span>{fromCoin}</span>
                            <span className="text-gray-200">|</span>
                            <button
                                onClick={() => setQuantity(String(availableBalance))}
                                className="text-blue-600 font-medium"
                            >
                                {t('All')}
                            </button>
                        </div>
                    </div>

                    <p className="text-xs text-gray-400 mt-3">
                        {t('Available')} {Number(availableBalance).toFixed(2)} {fromCoin}
                    </p>
                </div>

                {/* ── SUBMIT ── */}
                <div className="px-4 mt-2">
                    <Button
                        onClick={handleSwap}
                        className="w-full h-11 rounded-lg font-semibold"
                        style={{
                            background: "#2563eb",
                            color: "#fff",
                            boxShadow: "0 6px 18px rgba(37,99,235,0.25)",
                        }}
                    >
                        {t('Exchange')}
                    </Button>
                </div>
            </div>

            {/* ── ACCOUNT SHEET ── */}
            {accSheet && (
                <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={() => setAccSheet(false)}>
                    <div className="w-full bg-white rounded-t-2xl pb-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between px-4 py-3 border-b">
                            <button onClick={() => setAccSheet(false)}>{t('Cancel')}</button>
                            <span>{t('Select account')}</span>
                            <button onClick={confirmAccount} className="text-blue-600">{t('Confirm')}</button>
                        </div>

                        {ACCOUNTS.map((acc) => (
                            <button
                                key={acc}
                                onClick={() => setPendingAcc(acc)}
                                className={`w-full py-4 text-center border-b
                                ${pendingAcc === acc ? 'text-blue-600 font-medium' : ''}`}
                            >
                                {acc}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── COIN SHEET ── */}
            {coinSheet && (
                <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={() => setCoinSheet(null)}>
                    <div className="w-full bg-white rounded-t-2xl pb-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between px-4 py-3 border-b">
                            <button onClick={() => setCoinSheet(null)}>{t('Cancel')}</button>
                            <span>{t('Select coin')}</span>
                            <button onClick={() => setCoinSheet(null)} className="text-blue-600">{t('Confirm')}</button>
                        </div>

                        <div className="max-h-72 overflow-y-auto">
                            {rawList.map((c: any) => (
                                <button
                                    key={c.id}
                                    onClick={() => {
                                        if (coinSheet === 'from') setFromCoin(c.symbol)
                                        if (coinSheet === 'to') setToCoin(c.symbol)
                                        setCoinSheet(null)
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 border-b"
                                >
                                    {c.images?.small ? (
                                        <img src={c.images.small} className="w-9 h-9 rounded-full" />
                                    ) : (
                                        <div
                                            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                            style={{ background: coinColor(c.symbol) }}
                                        >
                                            {c.symbol?.slice(0, 2)}
                                        </div>
                                    )}

                                    <div className="flex-1 text-left">
                                        <p className="font-medium">{c.symbol}</p>
                                        <p className="text-xs text-gray-400">{c.name}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </UserLayout>
    )
}

// import { Button } from '@/Components/UI/Button';
// import { Card, CardContent } from "@/Components/UI/Card";
// import { useTranslations } from '@/Hooks/useTranslations';
// import UserLayout from '@/Layouts/FrontendLayout';
// import { ArrowLeftRight } from 'lucide-react';
// import { useState } from 'react';
// import toast from 'react-hot-toast';

// const ACCOUNTS = ['Options account', 'Funds account', 'Quant trading account']

// const COIN_COLORS: Record<string, string> = {
//     USDT: '#26a17b',
//     BTC: '#f7931a',
//     ETH: '#627eea',
//     BNB: '#f3ba2f',
//     SOL: '#9945ff',
//     XRP: '#346aa9',
// }

// export default function FlashSwap({
//     cryptos = [],
//     availableBalance = 0,
//     defaultFrom = 'USDT',
//     defaultTo = 'USDC',
//     title
// }: any) {

//     const rawList = cryptos?.data || cryptos || []

//     const [fromCoin, setFromCoin] = useState(defaultFrom)
//     const [toCoin, setToCoin] = useState(defaultTo)
//     const [account, setAccount] = useState('Options account')
//     const [quantity, setQuantity] = useState('')

//     const [coinSheet, setCoinSheet] = useState<'from' | 'to' | null>(null)
//     const [accSheet, setAccSheet] = useState(false)
//     const [pendingAcc, setPendingAcc] = useState(account)

//     const { t } = useTranslations();

//     const swapCoins = () => {
//         setFromCoin(toCoin)
//         setToCoin(fromCoin)
//     }

//     const handleSwap = () => {
//         toast.error('Flash Swap not available yet', { position: 'bottom-center' })
//     }

//     const confirmAccount = () => {
//         setAccount(pendingAcc)
//         setAccSheet(false)
//     }

//     const coinColor = (sym: string) =>
//         COIN_COLORS[sym?.toUpperCase()] || '#6366f1'

//     return (
//         <UserLayout title={title}>
//             <div className="max-w-xl mx-auto px-4 py-6 space-y-5 bg-gray-50 min-h-screen">

//                 {/* ── COIN CARD ── */}
//                 <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
//                     <CardContent className="py-6 text-center space-y-4">

//                         {/* FROM */}
//                         <div onClick={() => setCoinSheet('from')} className="cursor-pointer">
//                             <p className="text-xs text-gray-400">{t('From')}</p>
//                             <p className="text-lg font-semibold text-gray-900">{fromCoin}</p>
//                         </div>

//                         {/* SWAP */}
//                         <div className="flex justify-center">
//                             <button
//                                 onClick={swapCoins}
//                                 className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white"
//                             >
//                                 <ArrowLeftRight size={16} />
//                             </button>
//                         </div>

//                         {/* TO */}
//                         <div onClick={() => setCoinSheet('to')} className="cursor-pointer">
//                             <p className="text-xs text-gray-400">{t('To')}</p>
//                             <p className="text-lg font-semibold text-green-600">{toCoin}</p>
//                         </div>

//                     </CardContent>
//                 </Card>

//                 {/* ── BALANCE CARD ── */}
//                 <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
//                     <CardContent className="py-6 text-center">
//                         <p className="text-sm text-gray-500">{t('Available Balance')}</p>
//                         <h2 className="text-2xl font-bold text-gray-900 mt-1">
//                             {Number(availableBalance).toFixed(8)} {fromCoin}
//                         </h2>
//                     </CardContent>
//                 </Card>

//                 {/* ── ACCOUNT CARD ── */}
//                 <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
//                     <CardContent
//                         onClick={() => {
//                             setPendingAcc(account)
//                             setAccSheet(true)
//                         }}
//                         className="py-5 flex items-center justify-between cursor-pointer"
//                     >
//                         <p className="text-sm text-gray-500">{t('Account')}</p>
//                         <p className="text-sm font-medium text-gray-900">
//                             {account}
//                         </p>
//                     </CardContent>
//                 </Card>

//                 {/* ── INPUT CARD ── */}
//                 <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
//                     <CardContent className="py-5 space-y-4">

//                         <input
//                             type="number"
//                             value={quantity}
//                             onChange={(e) => setQuantity(e.target.value)}
//                             placeholder={`${t('Enter amount')} (${fromCoin})`}
//                             className="w-full h-11 border border-gray-200 rounded-lg px-3 focus:border-blue-500 outline-none"
//                         />

//                         <div className="flex justify-between text-sm">
//                             <span className="text-gray-400">
//                                 {t('Available')} {Number(availableBalance).toFixed(8)} {fromCoin}
//                             </span>

//                             <button
//                                 onClick={() => setQuantity(String(availableBalance))}
//                                 className="text-blue-600 font-medium"
//                             >
//                                 {t('All')}
//                             </button>
//                         </div>

//                     </CardContent>
//                 </Card>

//                 {/* ── SUBMIT ── */}
//                 <Button
//                     onClick={handleSwap}
//                     className="w-full h-11 rounded-lg font-semibold"
//                     style={{
//                         background: "#2563eb",
//                         color: "#fff",
//                         boxShadow: "0 6px 18px rgba(37,99,235,0.25)",
//                     }}
//                 >
//                     {t('Exchange')}
//                 </Button>

//             </div>

//             {/* ── ACCOUNT SHEET ── */}
//             {accSheet && (
//                 <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={() => setAccSheet(false)}>
//                     <div className="w-full bg-white rounded-t-2xl pb-6" onClick={(e) => e.stopPropagation()}>
//                         <div className="flex justify-between px-4 py-3 border-b">
//                             <button onClick={() => setAccSheet(false)}>{t('Cancel')}</button>
//                             <span>{t('Select account')}</span>
//                             <button onClick={confirmAccount} className="text-blue-600">{t('Confirm')}</button>
//                         </div>

//                         {ACCOUNTS.map((acc) => (
//                             <button
//                                 key={acc}
//                                 onClick={() => setPendingAcc(acc)}
//                                 className={`w-full py-4 text-center border-b
//                                 ${pendingAcc === acc ? 'text-blue-600 font-medium' : ''}`}
//                             >
//                                 {acc}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {/* ── COIN SHEET ── */}
//             {coinSheet && (
//                 <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={() => setCoinSheet(null)}>
//                     <div className="w-full bg-white rounded-t-2xl pb-6" onClick={(e) => e.stopPropagation()}>
//                         <div className="flex justify-between px-4 py-3 border-b">
//                             <button onClick={() => setCoinSheet(null)}>{t('Cancel')}</button>
//                             <span>{t('Select coin')}</span>
//                             <button onClick={() => setCoinSheet(null)} className="text-blue-600">{t('Confirm')}</button>
//                         </div>

//                         <div className="max-h-72 overflow-y-auto">
//                             {rawList.map((c: any) => (
//                                 <button
//                                     key={c.id}
//                                     onClick={() => {
//                                         if (coinSheet === 'from') setFromCoin(c.symbol)
//                                         if (coinSheet === 'to') setToCoin(c.symbol)
//                                         setCoinSheet(null)
//                                     }}
//                                     className="w-full flex items-center gap-3 px-4 py-3 border-b"
//                                 >
//                                     {c.images?.small ? (
//                                         <img src={c.images.small} className="w-9 h-9 rounded-full" />
//                                     ) : (
//                                         <div
//                                             className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
//                                             style={{ background: coinColor(c.symbol) }}
//                                         >
//                                             {c.symbol?.slice(0, 2)}
//                                         </div>
//                                     )}

//                                     <div className="flex-1 text-left">
//                                         <p className="font-medium">{c.symbol}</p>
//                                         <p className="text-xs text-gray-400">{c.name}</p>
//                                     </div>
//                                 </button>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </UserLayout>
//     )
// }