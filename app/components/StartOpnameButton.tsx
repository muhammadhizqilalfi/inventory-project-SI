"use client";

import { createOpnameSession } from "@/app/admin/opname/actions";
import { useState } from "react";

export default function StartOpnameButton() {
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={async () => {
        setLoading(true);
        await createOpnameSession();
      }}
      disabled={loading}
      className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-50"
    >
      {loading ? "Menyiapkan..." : "+ Mulai Opname Baru"}
    </button>
  );
}
