"use client";

import { useState } from "react";
import { LuMapPin, LuChevronRight, LuCheck } from "react-icons/lu";
import { formatRupiah } from "@/lib/utils";
import Image from "next/image";
import { Address } from "@/lib/generated/prisma";
import { CartItemProps } from "@/types/types";
import Link from "next/link";
import MidtransBtn from "./MidtransBtn";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface CheckoutClientProps {
  initialAddresses: Address[];
  items: CartItemProps[];
  subtotal: number;
}

export default function CheckoutClient({ initialAddresses, items, subtotal }: CheckoutClientProps) {
  const [selectedAddress, setSelectedAddress] = useState(
    initialAddresses.find((addr) => addr.isDefault) || initialAddresses[0],
  );

  return (
    <div className="flex flex-col gap-6">
      <section className="bg-white border-b pb-4">
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <LuMapPin size={18} />
          <h2 className="font-semibold text-sm uppercase tracking-wide">Alamat Pengiriman</h2>
        </div>

        {selectedAddress ? (
          <Sheet>
            <SheetTrigger asChild>
              <div className="flex items-center justify-between cursor-pointer group">
                <div className="space-y-1">
                  <p className="font-bold">
                    {selectedAddress.recipient} <span className="text-gray-400 font-normal">|</span>{" "}
                    {selectedAddress.phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedAddress.street}, {selectedAddress.village}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedAddress.district}, {selectedAddress.regency}, {selectedAddress.province}
                  </p>
                </div>
                <LuChevronRight className="text-gray-400 group-hover:translate-x-1 transition" />
              </div>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Pilih Alamat</SheetTitle>
                <SheetDescription></SheetDescription>
              </SheetHeader>
              <div className="p-4 flex flex-col h-full max-w-xl mx-auto">
                <Button asChild className="mb-4">
                  <Link href="/user/address">Tambah Alamat</Link>
                </Button>
                <div className="flex-1 overflow-y-auto space-y-4">
                  {initialAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                        selectedAddress.id === addr.id ? "border-primary bg-primary/5" : "border-gray-100"
                      }`}
                    >
                      <div className="flex justify-between">
                        <div className="text-sm">
                          <p className="font-bold">
                            {addr.recipient} ({addr.label})
                          </p>
                          <p>{addr.phone}</p>
                          <p className="text-gray-500">{addr.street}</p>
                        </div>
                        {selectedAddress.id === addr.id && <LuCheck size={18} className="text-primary" />}
                      </div>
                    </div>
                  ))}
                </div>

                <SheetFooter className="p-0">
                  <SheetClose asChild>
                    <Button>Selesai</Button>
                  </SheetClose>
                </SheetFooter>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <p className="text-sm text-red-500 italic">Belum ada alamat pengiriman.</p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-lg border-b pb-2">Rincian Pesanan</h2>
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 items-start">
            <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden shrink-0 border">
              {item.Product.imageUrl ? (
                <Image src={item.Product.imageUrl} alt={item.Product.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No Img</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{item.Product.name}</h3>
              <p className="text-gray-500 text-xs mt-1 italic">Jumlah: {item.quantity}</p>
              <p className="font-bold mt-1 text-sm">Rp{formatRupiah(item.Product.price)}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="pt-6 border-t mt-4">
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-600 italic">Subtotal Produk:</span>
          <span className="font-bold text-lg">Rp{formatRupiah(subtotal)}</span>
        </div>
        <div>
          <MidtransBtn addressId={selectedAddress.id} />
        </div>
      </div>
    </div>
  );
}
