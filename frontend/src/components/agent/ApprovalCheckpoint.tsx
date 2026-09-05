import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, Edit3, ArrowRight, DollarSign, Truck, AlertTriangle } from 'lucide-react';
import { AgentSession } from '../../types/agent';

interface ApprovalCheckpointProps {
  session: AgentSession;
  onApprove: (feedback?: string) => void;
  onReject: (feedback?: string) => void;
  onModify: (feedback: string) => void;
  isLoading: boolean;
}

export const ApprovalCheckpoint: React.FC<ApprovalCheckpointProps> = ({
  session,
  onApprove,
  onReject,
  onModify,
  isLoading,
}) => {
  const [showModifyInput, setShowModifyInput] = useState(false);
  const [modifyNotes, setModifyNotes] = useState('');
  const [rejectNotes, setRejectNotes] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const cart = session.cart_item;
  const product = session.recommended_product;

  if (!cart) return null;

  const isUnderBudget = cart.price <= session.budget_limit;
  const savings = session.budget_limit - cart.price;

  const handleModifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modifyNotes.trim()) return;
    onModify(modifyNotes.trim());
    setShowModifyInput(false);
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReject(rejectNotes.trim());
    setShowRejectInput(false);
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-amber-950/40 via-background-panel to-background-dark border-2 border-amber-500/60 p-5 md:p-6 shadow-2xl shadow-amber-500/10 space-y-5 animate-pulse-subtle">
      
      {/* Checkpoint Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-500/30">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950">
                Human-in-the-Loop Required
              </span>
              <span className="text-xs text-amber-400/90 font-mono">Trust & Safety Policy #AC-401</span>
            </div>
            <h3 className="text-base font-extrabold text-white mt-1">
              Autonomous Checkout Staged — Action Paused for Human Approval
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              The agent has selected the optimal match, but cannot execute financial transactions without explicit user authorization.
            </p>
          </div>
        </div>

        {/* Budget Status Pill */}
        <div className="px-3 py-2 rounded-xl bg-background-card border border-amber-500/30 shrink-0 text-right">
          <span className="text-[10px] text-slate-400 block font-mono">Budget Verification</span>
          <span className={`text-xs font-bold font-mono ${isUnderBudget ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isUnderBudget ? `✓ $${savings.toFixed(2)} Headroom` : `⚠️ Over Budget`}
          </span>
        </div>
      </div>

      {/* Staged Order Summary Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-background-card/90 border border-background-border">
        
        {/* Left: Product preview */}
        <div className="md:col-span-2 flex items-start gap-3">
          {product?.image_url && (
            <img
              src={product.image_url}
              alt={product.title}
              className="w-20 h-20 rounded-xl object-cover border border-background-border shrink-0"
            />
          )}
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
              {product?.brand || 'Verified Item'}
            </span>
            <h4 className="text-sm font-bold text-white leading-snug">
              {cart.title}
            </h4>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-slate-400" />
                <span>{cart.delivery_days}-Day Fast Shipping</span>
              </span>
              <span>•</span>
              <span className="text-slate-300">Qty: {cart.quantity}</span>
            </div>
          </div>
        </div>

        {/* Right: Price & Wallet deduction */}
        <div className="p-3 rounded-lg bg-background-panel border border-background-border/80 flex flex-col justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">Total Simulated Charge</span>
            <div className="text-xl font-extrabold text-emerald-400 font-mono">
              ${cart.price.toFixed(2)}
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-2 pt-2 border-t border-slate-800">
            Source: <span className="text-slate-200">Simulated Agent Corporate Wallet</span>
          </div>
        </div>

      </div>

      {/* Decision Action Buttons */}
      {!showModifyInput && !showRejectInput && (
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          
          <button
            type="button"
            onClick={() => setShowRejectInput(true)}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 hover:border-rose-500/60 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>Reject Purchase</span>
          </button>

          <button
            type="button"
            onClick={() => setShowModifyInput(true)}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 hover:border-amber-500/60 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Edit3 className="w-4 h-4 text-amber-400" />
            <span>Modify Criteria</span>
          </button>

          <button
            type="button"
            onClick={() => onApprove()}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-emerald-400 via-emerald-300 to-cyan-300 hover:from-emerald-300 hover:to-cyan-200 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-950" />
            <span>Authorize & Complete Purchase</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

        </div>
      )}

      {/* Modify Feedback Drawer */}
      {showModifyInput && (
        <form onSubmit={handleModifySubmit} className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs text-amber-300 font-semibold">
            <span>Provide Correction / Additional Requirements:</span>
            <button
              type="button"
              onClick={() => setShowModifyInput(false)}
              className="text-slate-400 hover:text-slate-200 text-xs"
            >
              Cancel
            </button>
          </div>
          <input
            type="text"
            value={modifyNotes}
            onChange={(e) => setModifyNotes(e.target.value)}
            placeholder="e.g. 'I actually need at least 32GB RAM' or 'Prefer Apple or Lenovo over Acer'"
            className="w-full p-3 rounded-xl bg-background-dark border border-amber-500/40 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              disabled={!modifyNotes.trim() || isLoading}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all cursor-pointer"
            >
              Re-Plan with Feedback
            </button>
          </div>
        </form>
      )}

      {/* Reject Feedback Drawer */}
      {showRejectInput && (
        <form onSubmit={handleRejectSubmit} className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs text-rose-300 font-semibold">
            <span>Reason for Declining (Optional):</span>
            <button
              type="button"
              onClick={() => setShowRejectInput(false)}
              className="text-slate-400 hover:text-slate-200 text-xs"
            >
              Cancel
            </button>
          </div>
          <input
            type="text"
            value={rejectNotes}
            onChange={(e) => setRejectNotes(e.target.value)}
            placeholder="e.g. 'No longer needed' or 'Budget is postponed'"
            className="w-full p-3 rounded-xl bg-background-dark border border-rose-500/40 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-all cursor-pointer"
            >
              Confirm Abort
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
