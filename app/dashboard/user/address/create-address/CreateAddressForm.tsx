"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import useAddresses from "@/hooks/useFetchAddress";
import { useFormAddress } from "@/hooks/useFormAddress";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
// import { useAddress } from "@/hooks/tanstack-hooks/useAddress";
import { createAddress } from "@/actions/account";

export default function CreateAddressForm() {
  const [label, setLabel] = useState("");
  const [recipient, setRecipient] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const { province, setProvince, regency, setRegency, district, setDistrict, village, setVillage } = useFormAddress();
  const [provinces, regencies, districts, villages, pendingProvince, pendingRegency, pendingDistrict] = useAddresses();
  const [postalCode, setPostalCode] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, { errors: string[] }> | undefined>({});
  // const { createAddress, isCreating: pending } = useAddress();

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);

    const formData = new FormData(e.currentTarget);
    formData.append("label", label);
    formData.append("recipient", recipient);
    formData.append("phone", phone);
    formData.append("street", street);
    formData.append("province", province);
    formData.append("regency", regency);
    formData.append("district", district);
    formData.append("village", village);
    formData.append("postalCode", postalCode);
    formData.append("isDefault", String(isDefault));

    // const res = await fetch("/api/account/address", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(formData),
    // });
    // const result = await res.json();
    const result = await createAddress(formData);

    if (result?.errors) {
      setErrors(result.errors.properties);
      setPending(false);
      return;
    }

    if (result?.error) {
      toast.error(result.error);
      setPending(false);
      return;
    }

    setPending(false);
    setErrors(undefined);
    toast.success(result.message);
    setLabel("");
    setRecipient("");
    setPhone("");
    setStreet("");
    setProvince("");
    setRegency("");
    setDistrict("");
    setVillage("");
    setPostalCode("");
    setIsDefault(false);
    router.push("/dashboard/user/address");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        id="Label"
        label="Label"
        placeholder="Misal: Rumah, Kantor"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />
      <Input
        id="Nama Penerima"
        label="Nama Penerima"
        placeholder="Nama penerima"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        error={errors?.recipient?.errors}
      />
      <Input
        id="Nomor Telepon"
        label="Nomor Telepon"
        placeholder="Nomor telepon"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        error={errors?.phone?.errors}
      />
      <Input
        id="Alamat Jalan"
        label="Kampung / Jalan"
        placeholder="Alamat kampung atau jalan"
        value={street}
        onChange={(e) => setStreet(e.target.value)}
        error={errors?.street?.errors}
      />
      <Select
        id="Provinsi"
        label="Provinsi"
        value={province}
        options={provinces}
        onChange={(e) => setProvince(e.target.value)}
        placeholder="--Select Province"
        error={errors?.province?.errors}
      />
      <Select
        id="kabupaten-kota"
        label="Kabupaten/Kota"
        value={regency}
        options={regencies}
        onChange={(e) => setRegency(e.target.value)}
        disabled={pendingProvince || !province}
        placeholder="--Select Regency"
        error={errors?.regency?.errors}
      />
      <Select
        id="kecamatan"
        label="Kecamatan"
        value={district}
        options={districts}
        onChange={(e) => setDistrict(e.target.value)}
        disabled={pendingRegency || !regency}
        placeholder="--Select District"
        error={errors?.district?.errors}
      />
      <Select
        id="desa-kelurahan"
        label="Desa/Kelurahan"
        value={village}
        options={villages}
        onChange={(e) => setVillage(e.target.value)}
        disabled={pendingDistrict || !district}
        placeholder="--Select Village"
        error={errors?.village?.errors}
      />
      <Input
        id="Kode Pos"
        label="Kode Pos"
        placeholder="Kode pos"
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
        error={errors?.postalCode?.errors}
      />
      <label htmlFor="isDefault" className="flex gap-2 items-center mb-3">
        <input id="isDefault" type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
        <span>Set sebagai alamat utama</span>
      </label>
      <Button type="submit" disabled={pending} pending={pending} className="w-fit">
        Create Address
      </Button>
    </form>
  );
}
