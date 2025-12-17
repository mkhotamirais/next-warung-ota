import { z } from "zod";

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
  // text harus 'delete my account' (case sensitive)
  text: z.literal("delete my account"),
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
      }
    ),
});

export const BlogCategorySchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Blog category name is required" })
      .transform((val) => val.trim()),
  })
  .transform((data) => ({
    ...data,
    slug: data.name
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-")
      .trim(),
  }));

export const BlogSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters").max(255, "Title is too long"),
    content: z.string().min(10, "Content must be at least 10 characters"),
    image: z
      .any()
      .refine((file): file is File | null => file === null || file instanceof File, "Invalid file")
      .refine((file) => !file || file.size <= 2 * 1024 * 1024, "Max file size is 2MB")
      .refine(
        (file) => !file || ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
        "Only JPG/JPEG/PNG allowed"
      ),
    // .nullable()
    // .optional(),
    categoryId: z.cuid("Invalid category ID"),
  })
  .transform((data) => ({
    ...data,
    slug: data.title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-")
      .trim(),
  }));

export const ProductSchema = z
  .object({
    name: z.string().min(1, { message: "Nama produk tidak boleh kosong." }),
    description: z.string().optional(),
    price: z
      .string()
      .min(1, { message: "Harga tidak boleh kosong." })
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val), {
        message: "Harga harus berupa angka.",
      })
      .refine((val) => val >= 0, {
        message: "Harga harus angka positif.",
      }),
    stock: z.coerce.number().min(0, { message: "Stock harus angka positif." }),
    tags: z.array(z.string()).optional(),
    categoryId: z.cuid("Invalid category ID"),
    image: z
      .any()
      .refine((file): file is File | null => file === null || file instanceof File, "Invalid file")
      .refine((file) => !file || file.size <= 2 * 1024 * 1024, "Max file size is 2MB")
      .refine((file) => !file || file.type.startsWith("image/"), {
        message: "Tipe file tidak valid. Hanya format gambar yang diizinkan.",
      })
      .optional(),
  })
  .transform((data) => ({
    ...data,
    slug: data.name
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-")
      .trim(),
  }));

export const ProductCategorySchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Product category name is required" })
      .transform((val) => val.trim()),
  })
  .transform((data) => ({
    ...data,
    slug: data.name
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-")
      .trim(),
  }));

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
