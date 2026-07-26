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

export default function Transfer({ cryptos = [], availableBalance = 0, defaultCurrency = 'USDT', title }: any) {
    const rawList = cryptos?.data || cryptos || []

    const [fromAccount, setFromAccount] = useState('Options account')
    const [toAccount, setToAccount] = useState('Funds account')
    const [coin, setCoin] = useState(defaultCurrency || 'USDT')
    const [quantity, setQuantity] = useState('')

    const [accSheet, setAccSheet] = useState<'from' | 'to' | null>(null)
    const [coinSheet, setCoinSheet] = useState(false)
    const [pendingAcc, setPendingAcc] = useState('')

    const openAccSheet = (field: 'from' | 'to') => {
        setPendingAcc(field === 'to' ? toAccount : fromAccount)
        setAccSheet(field)
    }

    const confirmAccount = () => {
        if (accSheet === 'to') setToAccount(pendingAcc)
        if (accSheet === 'from') setFromAccount(pendingAcc)
        setAccSheet(null)
    }

    const swapAccounts = () => {
        setFromAccount(toAccount)
        setToAccount(fromAccount)
    }

    const handleTransfer = () => {

        toast.error(' This feature is Not available yet', { position: 'bottom-center' })
        // router.post(route('user.transfer.store'), { from: fromAccount, to: toAccount, coin, quantity })
    }

    const { t } = useTranslations();

    const coinColor = (sym: string) => COIN_COLORS[sym?.toUpperCase()] || '#6366f1'

    return (
        <UserLayout title={title}>
            {/* <div className="bg-white min-h-screen flex flex-col"> */}

            <div className="max-w-4xl mx-auto px-4 py-6 space-y-5 bg-gray-50 min-h-screen">

                {/* ── ACCOUNT SELECTOR ROW ── */}
                <div className="flex items-center justify-between px-4 py-5">
                    <div className="flex flex-col gap-4">

                        {/* FROM */}
                        <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => openAccSheet('from')}
                        >
                            <div className="flex flex-col items-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                                <div className="w-px h-5 bg-gray-200 my-0.5" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">
                                    {t('From')}
                                </p>
                                <p className="text-sm font-medium text-gray-900">{fromAccount}</p>
                            </div>
                        </div>

                        {/* TO */}
                        <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => openAccSheet('to')}
                        >
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-400">To</p>
                                <p className="text-sm font-medium text-green-600 flex items-center gap-1">
                                    {toAccount}
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        {/* SWAP BTN */}
                        <button
                            onClick={swapAccounts}
                            className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white active:scale-95 transition-transform"
                        >
                            <ArrowLeftRight size={17} />
                        </button>

                        {/* COIN SELECTOR */}
                        <button
                            onClick={() => setCoinSheet(true)}
                            className="flex items-center gap-1 text-[15px] font-semibold text-gray-900"
                        >
                            {coin}
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                        </button>
                    </div>
                </div>

                {/* ── DIVIDER ── */}
                <div className="h-1.5 bg-gray-100" />

                {/* ── AMOUNT INPUT ── */}
                <div className="px-4 pt-5 pb-4">
                    <p className="text-sm text-gray-500 mb-3">
                        {t('Transfer quantity')}
                    </p>
                    <div className="flex items-center border-b border-gray-200 pb-3 gap-2">
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Please enter the transfer quantity"
                            className="flex-1 text-[15px] bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-300"
                        />
                        <div className="flex items-center gap-2 text-sm text-gray-400 flex-shrink-0">
                            <span>{coin}</span>
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
                        {t("Available")} {Number(availableBalance).toFixed(2)} {coin}
                    </p>
                </div>

                {/* ── SUBMIT ── */}
                <div className="px-4 mt-2">

                    <Button
                        onClick={handleTransfer}
                        className="w-full h-11 rounded-lg font-semibold"
                        style={{
                            background: "#2563eb",
                            color: "#fff",
                            boxShadow: "0 6px 18px rgba(37,99,235,0.25)",
                        }}
                    >
                        {t('Transfer')}
                    </Button>
                </div>
            </div>

            {/* ── ACCOUNT BOTTOM SHEET ── */}
            {accSheet && (
                <div
                    className="fixed inset-0 z-50 flex items-end bg-black/40"
                    onClick={() => setAccSheet(null)}
                >
                    <div
                        className="w-full bg-white rounded-t-2xl pb-6 animate-in slide-in-from-bottom-4 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
                            <button
                                onClick={() => setAccSheet(null)}
                                className="text-sm text-gray-400"
                            >
                                {t('Cancel')}
                            </button>
                            <span className="text-[15px] font-medium text-gray-900">
                                {accSheet === 'to' ? 'Transfer to' : 'Transfer from'}
                            </span>
                            <button
                                onClick={confirmAccount}
                                className="text-sm font-medium text-blue-600"
                            >
                                {t('Confirm')}
                            </button>
                        </div>

                        {ACCOUNTS.map((acc) => (
                            <button
                                key={acc}
                                onClick={() => setPendingAcc(acc)}
                                className={`w-full py-4 text-center text-[15px] border-b border-gray-50 transition
                                    ${pendingAcc === acc ? 'text-blue-600 font-medium' : 'text-gray-900'}`}
                            >
                                {acc}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── COIN BOTTOM SHEET ── */}
            {coinSheet && (
                <div
                    className="fixed inset-0 z-50 flex items-end bg-black/40"
                    onClick={() => setCoinSheet(false)}
                >
                    <div
                        className="w-full bg-white rounded-t-2xl pb-6 animate-in slide-in-from-bottom-4 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
                            <button
                                onClick={() => setCoinSheet(false)}
                                className="text-sm text-gray-400"
                            >
                                {t('Cancel')}
                            </button>
                            <span className="text-[15px] font-medium text-gray-900">
                                {t('Select coin')}
                            </span>
                            <button
                                onClick={() => setCoinSheet(false)}
                                className="text-sm font-medium text-blue-600"
                            >
                                {t('Confirm')}
                            </button>
                        </div>

                        <div className="max-h-72 overflow-y-auto">
                            {rawList.map((c: any) => (
                                <button
                                    key={c.id}
                                    onClick={() => { setCoin(c.symbol); setCoinSheet(false) }}
                                    className="w-full flex items-center gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition"
                                >
                                    {c.images?.small ? (
                                        <img src={c.images.small} className="w-9 h-9 rounded-full" alt={c.symbol} />
                                    ) : (
                                        <div
                                            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                                            style={{ background: coinColor(c.symbol) }}
                                        >
                                            {c.symbol?.slice(0, 2)}
                                        </div>
                                    )}
                                    <div className="flex-1 text-left">
                                        <p className="text-[15px] font-medium text-gray-900">{c.symbol}</p>
                                        <p className="text-xs text-gray-400">{c.name}</p>
                                    </div>
                                    {coin === c.symbol && (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </UserLayout>
    )
}


// import { Button } from "@/Components/UI/Button";
// import { Card, CardContent } from "@/Components/UI/Card";
// import UserLayout from '@/Layouts/FrontendLayout';
// import { router } from '@inertiajs/react';
// import { ArrowLeftRight } from 'lucide-react';
// import { useState } from 'react';

// const ACCOUNTS = ['Options account', 'Funds account', 'Quant trading account']

// const COIN_COLORS: Record<string, string> = {
//     USDT: '#26a17b',
//     BTC: '#f7931a',
//     ETH: '#627eea',
//     BNB: '#f3ba2f',
//     SOL: '#9945ff',
//     XRP: '#346aa9',
// }

// export default function Transfer({
//     cryptos = [],
//     availableBalance = 0,
//     defaultCurrency = 'USDT',
//     title
// }: any) {

//     const rawList = cryptos?.data || cryptos || []

//     const [fromAccount, setFromAccount] = useState('Options account')
//     const [toAccount, setToAccount] = useState('Funds account')
//     const [coin, setCoin] = useState(defaultCurrency || 'USDT')
//     const [quantity, setQuantity] = useState('')

//     const [accSheet, setAccSheet] = useState<'from' | 'to' | null>(null)
//     const [coinSheet, setCoinSheet] = useState(false)
//     const [pendingAcc, setPendingAcc] = useState('')

//     const openAccSheet = (field: 'from' | 'to') => {
//         setPendingAcc(field === 'to' ? toAccount : fromAccount)
//         setAccSheet(field)
//     }

//     const confirmAccount = () => {
//         if (accSheet === 'to') setToAccount(pendingAcc)
//         if (accSheet === 'from') setFromAccount(pendingAcc)
//         setAccSheet(null)
//     }

//     const swapAccounts = () => {
//         setFromAccount(toAccount)
//         setToAccount(fromAccount)
//     }

//     const handleTransfer = () => {
//         router.post(route('user.transfer.store'), {
//             from: fromAccount,
//             to: toAccount,
//             coin,
//             quantity
//         })
//     }

//     const coinColor = (sym: string) =>
//         COIN_COLORS[sym?.toUpperCase()] || '#6366f1'

//     return (
//         <UserLayout title={title}>
//             <div className="max-w-xl mx-auto px-4 py-6 space-y-5 bg-gray-50 min-h-screen">

//                 {/* ── ACCOUNT CARD ── */}
//                 <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
//                     <CardContent className="py-6 space-y-4 text-center">

//                         <p className="text-sm text-gray-500">
//                             Transfer Between Accounts
//                         </p>

//                         {/* FROM */}
//                         <div onClick={() => openAccSheet('from')} className="cursor-pointer">
//                             <p className="text-xs text-gray-400">From</p>
//                             <p className="text-sm font-medium text-gray-900">
//                                 {fromAccount}
//                             </p>
//                         </div>

//                         {/* SWAP */}
//                         <div className="flex justify-center">
//                             <button
//                                 onClick={swapAccounts}
//                                 className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white active:scale-95 transition"
//                             >
//                                 <ArrowLeftRight size={16} />
//                             </button>
//                         </div>

//                         {/* TO */}
//                         <div onClick={() => openAccSheet('to')} className="cursor-pointer">
//                             <p className="text-xs text-gray-400">To</p>
//                             <p className="text-sm font-medium text-green-600">
//                                 {toAccount}
//                             </p>
//                         </div>

//                     </CardContent>
//                 </Card>

//                 {/* ── BALANCE CARD ── */}
//                 <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
//                     <CardContent className="py-6 text-center">
//                         <p className="text-sm text-gray-500">
//                             Available Balance
//                         </p>
//                         <h2 className="text-3xl font-bold text-gray-900 mt-1">
//                             {Number(availableBalance).toFixed(8)} {coin}
//                         </h2>
//                     </CardContent>
//                 </Card>

//                 {/* ── INPUT CARD ── */}
//                 <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
//                     <CardContent className="py-5 space-y-4">

//                         {/* COIN SELECT */}
//                         <button
//                             onClick={() => setCoinSheet(true)}
//                             className="w-full flex justify-between items-center border border-gray-200 rounded-lg px-3 h-11"
//                         >
//                             <span className="text-gray-900 font-medium">{coin}</span>
//                             <span className="text-gray-400 text-sm">Select</span>
//                         </button>

//                         {/* AMOUNT */}
//                         <input
//                             type="number"
//                             value={quantity}
//                             onChange={(e) => setQuantity(e.target.value)}
//                             placeholder={`Enter amount (${coin})`}
//                             className="w-full h-11 border border-gray-200 rounded-lg px-3 focus:border-blue-500 outline-none"
//                         />

//                         <div className="flex justify-between text-sm">
//                             <span className="text-gray-400">
//                                 Available {Number(availableBalance).toFixed(8)} {coin}
//                             </span>

//                             <button
//                                 onClick={() => setQuantity(String(availableBalance))}
//                                 className="text-blue-600 font-medium"
//                             >
//                                 All
//                             </button>
//                         </div>

//                     </CardContent>
//                 </Card>

//                 {/* ── SUBMIT ── */}
//                 <Button
//                     onClick={handleTransfer}
//                     className="w-full h-11 rounded-lg font-semibold"
//                     style={{
//                         background: "#2563eb",
//                         color: "#fff",
//                         boxShadow: "0 6px 18px rgba(37,99,235,0.25)",
//                     }}
//                 >
//                     Transfer
//                 </Button>

//             </div>

//             {/* ── ACCOUNT BOTTOM SHEET ── */}
//             {accSheet && (
//                 <div
//                     className="fixed inset-0 z-50 flex items-end bg-black/40"
//                     onClick={() => setAccSheet(null)}
//                 >
//                     <div
//                         className="w-full bg-white rounded-t-2xl pb-6"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <div className="flex justify-between px-4 py-3 border-b">
//                             <button onClick={() => setAccSheet(null)}>Cancel</button>
//                             <span>{accSheet === 'to' ? 'Transfer to' : 'Transfer from'}</span>
//                             <button onClick={confirmAccount} className="text-blue-600">
//                                 Confirm
//                             </button>
//                         </div>

//                         {ACCOUNTS.map((acc) => (
//                             <button
//                                 key={acc}
//                                 onClick={() => setPendingAcc(acc)}
//                                 className={`w-full py-4 text-center border-b
//                                 ${pendingAcc === acc ? 'text-blue-600' : ''}`}
//                             >
//                                 {acc}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {/* ── COIN BOTTOM SHEET ── */}
//             {coinSheet && (
//                 <div
//                     className="fixed inset-0 z-50 flex items-end bg-black/40"
//                     onClick={() => setCoinSheet(false)}
//                 >
//                     <div
//                         className="w-full bg-white rounded-t-2xl pb-6"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <div className="flex justify-between px-4 py-3 border-b">
//                             <button onClick={() => setCoinSheet(false)}>Cancel</button>
//                             <span>Select coin</span>
//                             <button onClick={() => setCoinSheet(false)} className="text-blue-600">
//                                 Confirm
//                             </button>
//                         </div>

//                         <div className="max-h-72 overflow-y-auto">
//                             {rawList.map((c: any) => (
//                                 <button
//                                     key={c.id}
//                                     onClick={() => {
//                                         setCoin(c.symbol)
//                                         setCoinSheet(false)
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