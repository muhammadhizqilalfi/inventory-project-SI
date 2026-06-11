"use client";

import Link from "next/link";
import { useState } from "react";

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

  return (
    <>
      {message && (
        <div
          className={`p-3 rounded-lg border-l-4 ${
            isSuccess
              ? "bg-green-50 border-green-500 text-green-700"
              : "bg-red-50 border-red-500 text-red-700"
          }`}
        >
          <p className="text-xs font-medium">{message}</p>
        </div>
      )}

      <form
        action={async () => {
          const result = await deleteAction();

          setMessage(result.message);
          setIsSuccess(result.success);
        }}
      >
        <Link
          href={`/users/outbound/${id}`}
          className="text-blue-600"
        >
          Detail
        </Link>

        <button
          type="submit"
          className="text-red-600"
        >
          Delete
        </button>
      </form>
    </>
  );
}