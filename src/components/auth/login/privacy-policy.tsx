"use client";

import { X, ShieldCheck, Mail } from "lucide-react";

interface PrivacyModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ open, onClose }: PrivacyModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[420px] max-w-[90vw] rounded-xl shadow-xl border border-slate-200 p-6 relative">

        {/* close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck size={20} className="text-slate-900" />
          <h2 className="text-lg font-semibold text-slate-900">
            Privacy Policy
          </h2>
        </div>

        <div className="text-sm text-slate-700 space-y-3">

          <p>
            When signing in with Google, we only receive your{" "}
            <strong>username and email address</strong>. We do not collect or request any additional access.
          </p>

          <p>
            Everything you create inside DURIO — tasks, notes, journal entries,
            calendar items, habit logs, etc — stays securely stored in our database.
          </p>

          <p>
            No one besides you can access your data without proper authentication.
          </p>

          <p>
            If you ever want your data deleted, exported, or if you have a concern,
            you can contact us anytime at:
          </p>

          <p className="flex items-center gap-2 text-slate-600">
            <Mail size={16} /> 
            <span>zemdevwork@gmail.com</span>
          </p>

          <p>
            By using DURIO, you agree to common privacy practices found in most modern applications.
          </p>
        </div>
      </div>
    </div>
  );
}
