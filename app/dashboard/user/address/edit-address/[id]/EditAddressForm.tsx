"use client";

// import { updateAddress } from "@/actions/account";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useAddress } from "@/hooks/tanstack-hooks/useAddress";
import useFetchAddress from "@/hooks/useFetchAddress";
import { useFormAddress } from "@/hooks/useFormAddress";
import { Address } from "@/lib/generated/prisma";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditAddressForm({ address }: { address: Address }) {
  const [label, setLabel] = useState(address.label || "");
  const [recipient, setRecipient] = useState(address.recipient);
  const [phone, setPhone] = useState(address.phone);
  const [street, setStreet] = useState(address.street);
  const [postalCode, setPostalCode] = useState(address.postalCode);
  const [isDefault, setIsDefault] = useState(address.isDefault);
  const { province, setProvince, regency, setRegency, district, setDistrict, village, setVillage } = useFormAddress();
  const [provinces, regencies, districts, villages, pendingProvince, pendingRegency, pendingDistrict] =
    useFetchAddress();
  // const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, { errors: string[] }> | undefined>({});
  const { updateAddress, isUpdating: pending } = useAddress();

  useEffect(() => {
    setProvince(address.province);
    setRegency(address.regency);
    setDistrict(address.district);
    setVillage(address.village);
  }, [address, setProvince, setRegency, setDistrict, setVillage]);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setPending(true)

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

    // const res = await fetch(`/api/account/address/${address.id}`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: formData,
    // });
    // const result = await res.json();
    const result = await updateAddress({ id: address.id, formData });

    if (result?.errors) {
      setErrors(result.errors);
      // setPending(false);
      return;
    }

    if (result?.error) {
      toast.error(result.error);
      // setPending(false);
      return;
    }

    // setPending(false);
    toast.success(result.message);
    setErrors(undefined);
    router.replace("/dashboard/user/address");
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
        Simpan
      </Button>
    </form>
  );
}
