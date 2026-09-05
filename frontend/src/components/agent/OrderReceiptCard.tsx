import React from 'react';
import { CheckCircle2, Package, Truck, ShieldCheck, ExternalLink, ArrowRight } from 'lucide-react';
import { Order } from '../../types/agent';

interface OrderReceiptCardProps {
  order: Order;
  onViewAudit: () => void;
  onNewSession: () => void;
}

export const OrderReceiptCard: React.FC<OrderReceiptCardProps> = ({ order, onViewAudit, onNewSession }) => {
  return (
    <div className="rounded-2xl bg-gradient-to-b from-emerald-950/30 via-background-panel to-background-card border-2 border-emerald-500/50 p-6 shadow-2xl shadow-emerald-500/10 space-y-5">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
              Transaction Confirmed
            </span>
            <h3 className="text-base font-extrabold text-white">
              Autonomous Purchase Successfully Executed
            </h3>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-right">
          <span className="text-[10px] text-slate-400 block font-mono">Order ID</span>
          <span className="text-xs font-mono font-bold text-emerald-300">{order.id}</span>
        </div>
      </div>

      {/* Item & Fulfillment Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-background-dark/80 border border-background-border text-xs">
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Purchased Item</span>
          <p className="font-bold text-slate-100 text-sm leading-snug">{order.product_title}</p>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Qty: {order.quantity}</span>
            <span>•</span>
            <span className="font-mono text-emerald-400 font-bold">${order.total_amount.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-2 md:border-l md:border-slate-800 md:pl-4">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Fulfillment & Audit</span>
          <p className="text-slate-300">{order.shipping_address}</p>
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] text-slate-300 font-mono">Payment: {order.payment_method}</span>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onViewAudit}
          className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>View Verifiable Audit Ledger Entry</span>
        </button>

        <button
          type="button"
          onClick={onNewSession}
          className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>Start New Shopping Goal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
