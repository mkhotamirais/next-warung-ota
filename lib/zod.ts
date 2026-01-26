import { z } from "zod";

export const ResetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password baru harus memiliki minimal 8 karakter"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Konfirmasi password baru tidak cocok",
    path: ["confirmNewPassword"],
  });

export const AddressSchema = z.object({
  label: z.string().min(1, "Label alamat wajib diisi."),
  recipient: z.string().min(3, "Nama penerima wajib diisi."),
  phone: z.string().regex(/^\+?[0-9\s-]{7,20}$/, "Format nomor telepon tidak valid."),
  street: z.string().min(10, "Alamat jalan harus cukup detail."),
  province: z.string().min(1, "Provinsi wajib diisi."),
  regency: z.string().min(1, "Kabupaten/Kota wajib diisi."),
  district: z.string().min(1, "Kecamatan wajib diisi."),
  village: z.string().min(1, "Desa/Kelurahan wajib diisi."),
  postalCode: z.string().min(3, "Kode pos tidak valid."),
  isDefault: z.boolean().optional(),
});

export const DeleteAccountSchema = z.object({
  text: z.string().min(1, "Text wajib diisi."),
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, "Password lama harus memiliki minimal 8 karakter"),
    newPassword: z.string().min(8, "Password baru harus memiliki minimal 8 karakter"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Konfirmasi password baru tidak cocok",
    path: ["confirmNewPassword"],
  });

export const ProfileDataSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email({ message: "Invalid email address" }),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        // 1. Hapus semua karakter non-digit (termasuk spasi, tanda kurung, strip, dll.)
        const cleaned = val.replace(/\D/g, "");
        // 2. Cek apakah panjangnya berada dalam rentang yang wajar (misalnya, 8 hingga 15 digit)
        return cleaned.length >= 8 && cleaned.length <= 15;
      },
      {
        message: "Nomor telepon harus antara 8 sampai 15 digit.",
      },
    ),
});

export const BlogCategorySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Blog category name is required" })
    .transform((val) => val.trim()),
});

export const BlogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(255, "Title is too long"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  image: z
    .any()
    .refine((file): file is File | null => file === null || file instanceof File, "Invalid file")
    .refine((file) => !file || file.size <= 2 * 1024 * 1024, "Max file size is 2MB")
    .refine(
      (file) => !file || ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
      "Only JPG/JPEG/PNG allowed",
    )
    .nullable()
    .optional(),
  categoryId: z.cuid("Invalid category ID"),
});

export const ProductSchema = z.object({
  name: z.string().min(1, { message: "Nama produk tidak boleh kosong." }),
  description: z.string().optional(),
  price: z
    .string()
    .min(1, "Harga tidak boleh kosong")
    .refine((val) => !isNaN(Number(val)), "Harga harus berupa angka")
    .refine((val) => Number(val) >= 0, "Harga harus angka positif"),
  stock: z
    .string()
    .min(1, "Stok tidak boleh kosong")
    .refine((val) => !isNaN(Number(val)), "Stok harus berupa angka")
    .refine((val) => Number(val) >= 0, "Stok harus angka positif"), //   .string()
  tags: z.array(z.string()),
  // categoryId: z.cuid("Invalid category ID"),
  categoryId: z.cuid("Invalid category ID"),
  image: z
    .any()
    .refine((file): file is File | null => file === null || file instanceof File, "Invalid file")
    .refine((file) => !file || file.size <= 2 * 1024 * 1024, "Max file size is 2MB")
    .refine((file) => !file || file.type.startsWith("image/"), {
      message: "Tipe file tidak valid. Hanya format gambar yang diizinkan.",
    })
    .nullable()
    .optional(),
});

export const ProductCategorySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Product category name is required" })
    .transform((val) => val.trim()),
});

export const SignupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email({ message: "Invalid email address" }),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const SigninSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
