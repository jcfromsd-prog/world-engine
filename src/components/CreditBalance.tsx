interface CreditBalanceProps {
    balance: number;
    onClick: () => void;
}

const CreditBalance: React.FC<CreditBalanceProps> = ({ balance, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="group flex items-center gap-3 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg hover:border-blue-500 transition-all shadow-lg"
        >
            <div className="text-blue-400 font-bold text-lg leading-none group-hover:scale-110 transition-transform">
                $
            </div>
            <div className="flex flex-col items-start leading-none">
                <span className="text-[9px] text-slate-500 font-black tracking-widest group-hover:text-blue-400 transition-colors">AVAILABLE CAPITAL</span>
                <span className="font-mono font-bold text-white text-base">
                    {balance.toLocaleString()}
                </span>
            </div>
        </button>
    );
};

export default CreditBalance;
