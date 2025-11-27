import { ProductProps } from "@/types/types";

export const roles = ["admin", "editor", "user"];

export const smartTrim = (text: string, maxLength = 60) => {
  if (text.length <= maxLength) return text;

  const words = text.split(" ");
  let result = "";

  for (const word of words) {
    if ((result + " " + word).trim().length <= maxLength) {
      result = (result + " " + word).trim();
    } else {
      break;
    }
  }

  return result + "...";
};

export const formatTime = (datetime: string) => {
  const date = new Date(datetime);

  const hari = date.toLocaleDateString("id-ID", { weekday: "long" });
  const tanggal = date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const jam = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${hari}, ${tanggal} - Jam ${jam}`;
};

export const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    // style: "currency",
    // currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export const capitalize = (text: string) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const diffForHumans = (date: string | number | Date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} detik yang lalu`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} hari yang lalu`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} bulan yang lalu`;
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} tahun yang lalu`;
};

// export const stripHtml = (html: string) => {
//   const div = document.createElement("div");
//   div.innerHTML = html;
//   return div.textContent || div.innerText || "";
// };

export const stripHtml = (html: string) => {
  // Regex yang cocok dengan semua tag HTML
  return html.replace(/<[^>]+>/g, "");
};

export const sortProductsImageFirst = (products: ProductProps[]) => {
  const orderedProducts = products.sort((a, b) => {
    const aHasUrl = typeof a.imageUrl === "string" && a.imageUrl.startsWith("http");
    const bHasUrl = typeof b.imageUrl === "string" && b.imageUrl.startsWith("http");

    // Logika Penyusunan (Mengutamakan yang memiliki URL):

    // 1. Jika A punya URL dan B tidak punya: A diutamakan (A sebelum B)
    if (aHasUrl && !bHasUrl) {
      return -1;
    }

    // 2. Jika B punya URL dan A tidak punya: B diutamakan (B sebelum A)
    if (!aHasUrl && bHasUrl) {
      return 1;
    }

    // 3. Jika keduanya punya URL atau keduanya tidak punya: Pertahankan urutan relatif (atau susun berdasarkan ID/Name jika perlu)
    return 0;
  });
  return orderedProducts;
};
