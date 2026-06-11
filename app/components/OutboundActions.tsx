"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, Loader2, Trash2 } from "lucide-react";

export default function OutboundActions({
  id,
  deleteAction,
}: {
  id: string;
  deleteAction: () => Promise<{
    success: boolean;
    message: string;
  }>;
}) {
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="flex flex-col items-end gap-2">
      {message && (
        <div
          className={`max-w-64 rounded-xl border px-3 py-2 text-left text-xs font-medium ${
            isSuccess
              ? "border-emerald-100 bg-emerald-50 text-emerald-700"
              : "border-red-100 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <form
        className="flex items-center justify-end gap-2"
        action={async () => {
          setIsDeleting(true);
          const result = await deleteAction();

          setMessage(
            result.message ||
              (result.success
                ? "Sales order berhasil dihapus"
                : "Sales order gagal dihapus"),
          );
          setIsSuccess(result.success);
          setIsDeleting(false);
        }}
        onSubmit={(event) => {
          if (
            !confirm(
              "Hapus sales order ini? Tindakan ini tidak dapat dibatalkan.",
            )
          ) {
            event.preventDefault();
          }
        }}
      >
        <Link
          href={`/users/outbound/${id}`}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-sky-700"
        >
          <Eye size={14} />
          Detail
        </Link>

        <button
          type="submit"
          disabled={isDeleting}
          className="inline-flex items-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Trash2 size={14} />
          )}
          Delete
        </button>
      </form>
    </div>
  );
}
