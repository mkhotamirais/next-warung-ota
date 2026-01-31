export const routes = {
  //  publicRoutes = ["/", "/about", "/contact", "/blog", "/product"],
  authRoutes: ["/signin", "/signup", "/reset-password-request", "/reset-password"],
  adminRoutes: ["/dashboard/admin"],
  // const userRoutes = ["/dashboard/user"],
  userRoutes: ["/cart", "/checkout", "/dashboard/user"],
  verifyRoutes: ["/verify-email"],
  verifyPendingRotes: ["/verify-email-request"],
};

export const menu = {
  mainMenu: [
    { label: "Home", url: "/" },
    { label: "Tentang", url: "/about" },
    { label: "Kontak", url: "/contact" },
    { label: "Blog", url: "/blog" },
    { label: "Produk", url: "/product" },
  ],
  footerMenu: [
    { label: "Home", url: "/" },
    { label: "About", url: "/about" },
    { label: "Contact", url: "/contact" },
  ],
  allRoleMenu: [
    { label: "Dashboard", url: "/dashboard" },
    { label: "Profile", url: "/dashboard/profile" },
  ],
  userMenu: [
    { label: "Address", url: "/dashboard/user/address" },
    //
  ],
  adminMenu: [
    { label: "Product", url: "/dashboard/admin/product" },
    { label: "Create Product", url: "/dashboard/admin/product/create-product" },
    { label: "Product Category", url: "/dashboard/admin/product-category" },
    { label: "Blog", url: "/dashboard/admin/blog" },
    { label: "Create Blog", url: "/dashboard/admin/blog/create-blog" },
    { label: "Blog Category", url: "/dashboard/admin/blog-category" },
  ],
};

export const mainMenu = [
  { label: "Home", url: "/" },
  { label: "About", url: "/about" },
  { label: "Contact", url: "/contact" },
  { label: "Blog", url: "/blog" },
  { label: "Product", url: "/product" },
];

export const userMenu = [
  { label: "Profile", url: "/user/profile" },
  { label: "Address", url: "/user/address" },
  { label: "My Orders", url: "/user/my-orders" },
];

export const adminMenu = [
  { label: "Product", url: "/admin/product" },
  { label: "Create Product", url: "/admin/product/create-product" },
  { label: "Product Category", url: "/admin/product-category" },
  { label: "Blog", url: "/admin/blog" },
  { label: "Create Blog", url: "/admin/blog/create-blog" },
  { label: "Blog Category", url: "/admin/blog-category" },
];

export const superAdminMenu = [
  { label: "Super Admin Dashboard", url: "/super-admin/dashboard" },
  { label: "User Management", url: "/super-admin/users" },
  //
];

export const publicRoutes = ["/", "/about"];
export const authRoutes = ["/signin", "/signup"];
export const transactionRoutes = ["/user/cart", "/user/checkout", "/user/my-orders", "/user/payment"];
export const userRoute = "/user";
export const userWhiteListRoutes = ["/user", "/user/profile"];
export const adminRoute = "/admin";
export const verifyRoute = "/verify-email";
export const verifyPendingRoute = "/verify-email-request";

export const content = {
  home: {
    hero: {
      title: "WarungOta - Belanja dan Fotokopi dalam Satu Tempat",
      description:
        "WarungOta menyediakan sembako, ATK, serta layanan fotokopi, cetak dokumen dan foto, laminating, transfer, tarik tunai, isi saldo, pulsa, dan token listrik.",
    },
  },
  about: {
    title: "Tentang Kami",
    description: "Tentang Warungota, sejarah dan lokasi",
  },
  contact: {
    title: "Kontak Kami",
    description: "Hubungi Warungota melalui alamat atau kontak yang tersedia.",
  },
  blog: {
    title: "Blog",
    description: "Artikel terkait produk dan layanan WarungOta",
  },
  product: {
    title: "Produk",
    description: "Produk dan layanan WarungOta",
  },
};

export const EXPIRY_DURATION = 2;
export const EXPIRY_UNIT = "minutes";
