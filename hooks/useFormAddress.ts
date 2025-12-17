import { create } from "zustand";

interface FormAddressState {
  province: string;
  setProvince: (province: string) => void;
  regency: string;
  setRegency: (regency: string) => void;
  district: string;
  setDistrict: (district: string) => void;
  village: string;
  setVillage: (village: string) => void;
}

export const useFormAddress = create<FormAddressState>((set) => ({
  province: "",
  setProvince: (province: string) => set({ province }),
  regency: "",
  setRegency: (regency: string) => set({ regency }),
  district: "",
  setDistrict: (district: string) => set({ district }),
  village: "",
  setVillage: (village: string) => set({ village }),
}));
