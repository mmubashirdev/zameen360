export interface FooterLink {
  label: string;
  path: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export const footerColumnsData: FooterColumn[] = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", path: "/" },
      { label: "About Us", path: "/about-us" },
      { label: "Contact", path: "/contact-us" },
      { label: "Support", path: "/support" },
      { label: "Blog", path: "/blog" },
      { label: "FAQ", path: "/faq" }
    ]
  },
  {
    title: "Buy",
    links: [
      { label: "Houses for Sale", path: "/buy/houses" },
      { label: "Apartments for Sale", path: "/buy/apartments" },
      { label: "Plots for Sale", path: "/buy/plots" },
      { label: "Commercial Properties", path: "/buy/commercial" }
    ]
  },
  {
    title: "Rent",
    links: [
      { label: "Houses for Rent", path: "/rent/houses" },
      { label: "Apartments for Rent", path: "/rent/apartments" },
      { label: "Commercial for Rent", path: "/rent/commercial" }
    ]
  }
];

export const contactInfoData = {
  phone: "+92 300 1234567",
  email: "info@zameen360.com",
  address: "123 Main Boulevard, DHA Lahore, Pakistan"
};