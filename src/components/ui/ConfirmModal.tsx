"use client";

import React from "react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel
}: ConfirmModalProps) {

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-[999]">
      <div className="bg-white border border-slate-200 rounded-lg shadow-xl p-5 w-80">
        
        <p className="text-sm font-semibold text-slate-900 mb-2">
          {title}
        </p>

        {description && (
          <p className="text-xs text-slate-600 mb-4">
            {description}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-xs cursor-pointer rounded-md border border-slate-300 hover:bg-slate-100"
          >
            {cancelLabel}
          </button>

          <button
            onClick={onConfirm}
            className="px-3 py-1.5 text-xs cursor-pointer rounded-md bg-red-500 text-white hover:bg-red-600"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
