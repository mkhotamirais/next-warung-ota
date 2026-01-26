"use client";

import { useCallback, useEffect, useState } from "react";

interface IFetchAddress {
  province: string;
  regency: string;
  district: string;
}

export default function useFetchAddress({ province, regency, district }: IFetchAddress) {
  const [provinces, setProvinces] = useState<{ value: string; label: string }[]>([]);
  const [regencies, setRegencies] = useState<{ value: string; label: string }[]>([]);
  const [districts, setDistricts] = useState<{ value: string; label: string }[]>([]);
  const [villages, setVillages] = useState<{ value: string; label: string }[]>([]);

  const [pendingProvinces, setPendingProvinces] = useState(false);
  const [pendingRegencies, setPendingRegencies] = useState(false);
  const [pendingDistricts, setPendingDistricts] = useState(false);
  const [pendingVillages, setPendingVillages] = useState(false);

  const provinceId = province.split("-")[0];
  const cityId = regency.split("-")[0];
  const districtId = district.split("-")[0];

  const fetchProvinces = useCallback(async () => {
    try {
      setPendingProvinces(true);
      const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal mengambil provinsi");
      const mapped = data.map((item: { id: string; name: string }) => ({
        value: `${item.id}-${item.name}`,
        label: item.name,
      })) as { value: string; label: string }[];

      const formattedProvinces = mapped.sort((a, b) => a.label.localeCompare(b.label));
      setProvinces(formattedProvinces);
    } catch (error) {
      console.error("Gagal mengambil provinsi", error);
    } finally {
      setPendingProvinces(false);
    }
  }, []);

  const fetchRegencies = useCallback(async (provinceId: string) => {
    try {
      setPendingRegencies(true);
      const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal mengambil kota/kabupaten");
      const mapped = data.map((item: { id: string; name: string }) => ({
        value: `${item.id}-${item.name}`,
        label: item.name,
      })) as { value: string; label: string }[];

      const formattedCities = mapped.sort((a, b) => a.label.localeCompare(b.label));
      setRegencies(formattedCities);
    } catch (error) {
      console.error("Gagal mengambil kota/kabupaten", error);
    } finally {
      setPendingRegencies(false);
    }
  }, []);

  const fetchDistict = useCallback(async (regencyId: string) => {
    try {
      setPendingDistricts(true);
      const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regencyId}.json`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal mengambil kecamatan");
      const mapped = data.map((item: { id: string; name: string }) => ({
        value: `${item.id}-${item.name}`,
        label: item.name,
      })) as { value: string; label: string }[];

      const formattedDistricts = mapped.sort((a, b) => a.label.localeCompare(b.label));
      setDistricts(formattedDistricts);
    } catch (error) {
      console.error("Gagal mengambil kecamatan", error);
    } finally {
      setPendingDistricts(false);
    }
  }, []);

  const fetchVillages = useCallback(async (districtId: string) => {
    try {
      setPendingVillages(true);
      const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${districtId}.json`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal mengambil kelurahan/desa");
      const mapped = data.map((item: { id: string; name: string }) => ({
        value: `${item.id}-${item.name}`,
        label: item.name,
      })) as { value: string; label: string }[];

      const formattedVillages = mapped.sort((a, b) => a.label.localeCompare(b.label));
      setVillages(formattedVillages);
    } catch (error) {
      console.error("Gagal mengambil kelurahan/desa", error);
    } finally {
      setPendingVillages(false);
    }
  }, []);

  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  useEffect(() => {
    if (provinceId) fetchRegencies(provinceId);
  }, [provinceId, fetchRegencies]);

  useEffect(() => {
    if (cityId) fetchDistict(cityId);
  }, [cityId, fetchDistict]);

  useEffect(() => {
    if (districtId) fetchVillages(districtId);
  }, [districtId, fetchVillages]);

  return [
    provinces,
    regencies,
    districts,
    villages,
    pendingProvinces,
    pendingRegencies,
    pendingDistricts,
    pendingVillages,
  ] as const;
}
