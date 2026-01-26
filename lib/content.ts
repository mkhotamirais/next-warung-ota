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
    { label: "About", url: "/about" },
    { label: "Contact", url: "/contact" },
    { label: "Blog", url: "/blog" },
    { label: "Product", url: "/product" },
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
export const transactionRoutes = ["/user/cart", "/user/checkout"];
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
    title: "About Us",
    description: "About use description",
  },
  contact: {
    title: "Contact Us",
    description: "Contact us description",
  },
  blog: {
    title: "Blog",
    description: "Blog description",
  },
  product: {
    title: "Product",
    description: "Product description",
  },
};
