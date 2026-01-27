"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateAddress } from "@/actions/account";
// import { useAddress } from "@/hooks/tanstack-hooks/useAddress";
import useFetchAddress from "@/hooks/useFetchAddress";
import { Address } from "@/lib/generated/prisma";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { AddressSchema } from "@/lib/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";

type inferSchema = z.infer<typeof AddressSchema>;

export default function EditAddressForm({ address }: { address: Address }) {
  const form = useForm<inferSchema>({
    resolver: zodResolver(AddressSchema),
    defaultValues: {
      label: address?.label || "",
      recipient: address?.recipient || "",
      phone: address?.phone || "",
      street: address?.street || "",
      province: address?.province || "",
      regency: address?.regency || "",
      district: address?.district || "",
      village: address?.village || "",
      postalCode: address?.postalCode || "",
      isDefault: address?.isDefault || false,
    },
  });

  const pending = form.formState.isSubmitting;
  const watchedValues = useWatch({
    control: form.control,
  });

  const province = watchedValues.province || "";
  const regency = watchedValues.regency || "";
  const district = watchedValues.district || "";

  const [provinces, regencies, districts, villages, pendingProvince, pendingRegency, pendingDistrict] = useFetchAddress(
    {
      province,
      regency,
      district,
    },
  );
  // const [pending, setPending] = useState(false);
  // const { updateAddress, isUpdating: pending } = useAddress();

  const router = useRouter();

  const onSubmit = async (data: inferSchema) => {
    // const res = await fetch(`/api/account/address/${address.id}`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: formData,
    // });
    // const result = await res.json();
    const result = await updateAddress(address.id, data);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    // setPending(false);
    toast.success(result.message);
    router.replace("/user/address");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input placeholder="Label" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recipient"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Penerima</FormLabel>
              <FormControl>
                <Input placeholder="Nama penerima" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Telepon</FormLabel>
              <FormControl>
                <Input placeholder="Nomor telepon" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat Jalan</FormLabel>
              <FormControl>
                <Input placeholder="Alamat kampung atau jalan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="province"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provinsi</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih provinsi" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province.value} value={province.value}>
                      {province.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="regency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kota / Kabupaten</FormLabel>
              <Select value={field.value} onValueChange={field.onChange} disabled={!province || pendingProvince}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih kota / kabupaten" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {regencies.map((regency) => (
                    <SelectItem key={regency.value} value={regency.value}>
                      {regency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="district"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kecamatan</FormLabel>
              <Select value={field.value} onValueChange={field.onChange} disabled={!regency || pendingRegency}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih kecamatan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district.value} value={district.value}>
                      {district.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="village"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kelurahan</FormLabel>
              <Select value={field.value} onValueChange={field.onChange} disabled={!district || pendingDistrict}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih kelurahan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {villages.map((village) => (
                    <SelectItem key={village.value} value={village.value}>
                      {village.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* postal code */}
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kode Pos</FormLabel>
              <FormControl>
                <Input placeholder="Kode pos" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* isDefault */}
        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-1 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="text-sm leading-none font-normal">Jadikan sebagai alamat utama</FormLabel>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pendingProvince || pendingRegency || pendingDistrict}>
          {pending || pendingProvince || pendingRegency || (pendingDistrict && <Spinner />)} Simpan
        </Button>
      </form>
    </Form>
  );
}
