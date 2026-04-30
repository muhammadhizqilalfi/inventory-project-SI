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
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg disabled:opacity-50 transition-all"
    >
      {loading ? "Menyiapkan..." : "+ Mulai Opname Baru"}
    </button>
  );
}