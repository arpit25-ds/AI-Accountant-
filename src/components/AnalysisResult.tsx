import React from 'react';
import { ReceiptAnalysis } from '../types';
import { FileText, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { cn } from '../lib/utils';

interface AnalysisResultProps {
  analysis: ReceiptAnalysis;
}

export function AnalysisResult({ analysis }: AnalysisResultProps) {
  const isPhysical = analysis.category === 'Physical Books';
  const isDigital = analysis.category === 'Digital Licenses';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-serif italic text-zinc-100">{analysis.vendorName}</h2>
          <p className="text-zinc-500 text-sm font-mono uppercase tracking-wider mt-1">
            Audit ID: {analysis.id.slice(0, 8)} • {new Date(analysis.timestamp).toLocaleString()}
          </p>
        </div>
        <div className={cn(
          "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border",
          isPhysical ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
          isDigital ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
          "bg-amber-500/10 text-amber-400 border-amber-500/20"
        )}>
          {analysis.category}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <p className="text-zinc-500 text-xs uppercase font-mono mb-1">Total Amount</p>
          <p className="text-2xl font-mono text-zinc-100">
            {analysis.currency} {analysis.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <p className="text-zinc-500 text-xs uppercase font-mono mb-1">Line Items</p>
          <p className="text-2xl font-mono text-zinc-100">{analysis.items.length}</p>
        </div>
        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <p className="text-zinc-500 text-xs uppercase font-mono mb-1">Confidence</p>
          <p className="text-2xl font-mono text-zinc-100">{(analysis.confidence * 100).toFixed(0)}%</p>
        </div>
      </div>

      <div className="border border-zinc-800 rounded-xl overflow-hidden">
        <div className="bg-zinc-900/80 px-4 py-2 border-bottom border-zinc-800 grid grid-cols-[1fr_80px_100px] text-[10px] uppercase font-mono text-zinc-500 tracking-widest">
          <span>Description</span>
          <span className="text-center">Qty</span>
          <span className="text-right">Amount</span>
        </div>
        <div className="divide-y divide-zinc-800">
          {analysis.items.map((item, idx) => (
            <div key={idx} className="px-4 py-3 grid grid-cols-[1fr_80px_100px] items-center hover:bg-zinc-900/30 transition-colors">
              <span className="text-zinc-300 text-sm">{item.description}</span>
              <span className="text-center text-zinc-500 font-mono text-sm">{item.quantity}</span>
              <span className="text-right text-zinc-100 font-mono text-sm">
                {analysis.currency} {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
        <div className="bg-zinc-900/50 px-4 py-4 border-t border-zinc-800 flex justify-between items-center">
          <span className="text-zinc-400 font-serif italic text-sm">Grand Total</span>
          <span className="text-xl font-mono text-zinc-100">
            {analysis.currency} {analysis.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl flex gap-3 items-start">
        <Info className="w-5 h-5 text-zinc-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-zinc-500 text-xs uppercase font-mono mb-1">Auditor Summary</p>
          <p className="text-zinc-300 text-sm leading-relaxed">{analysis.summary}</p>
        </div>
      </div>
    </div>
  );
}
