"use client";

import { useState } from "react";
import { createSalesOrder } from "@/app/users/outbound/actions";

type Product = {
  id: string;
  name: string;
};

type Props = {
  products: Product[];
};

export default function SalesOrderForm({
  products,
}: Props) {
  const [rows, setRows] = useState([
    {
      productId: "",
      quantity: 1,
    },
  ]);

  function addRow() {
    setRows([
      ...rows,
      {
        productId: "",
        quantity: 1,
      },
    ]);
  }

  function removeRow(index: number) {
    setRows(rows.filter((_, i) => i !== index));
  }

  return (
    <form action={createSalesOrder}>
      <input
        name="customerName"
        placeholder="Customer Name"
        className="mb-4 w-full rounded border p-2"
      />

      {rows.map((row, index) => (
        <div
          key={index}
          className="mb-4 rounded border p-4"
        >
          <select
            name={`productId-${index}`}
            className="mb-2 w-full rounded border p-2"
          >
            <option value="">
              Select Product
            </option>

            {products.map((product) => (
              <option
                key={product.id}
                value={product.id}
              >
                {product.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            min={1}
            name={`quantity-${index}`}
            defaultValue={1}
            className="w-full rounded border p-2"
          />

          {rows.length > 1 && (
            <button
              type="button"
              onClick={() =>
                removeRow(index)
              }
              className="mt-2 text-red-500"
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <input
        type="hidden"
        name="itemCount"
        value={rows.length}
      />

      <button
        type="button"
        onClick={addRow}
        className="mr-2 rounded bg-gray-500 px-4 py-2 text-white"
      >
        + Add Product
      </button>

      <button
        type="submit"
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        Save
      </button>
    </form>
  );
}