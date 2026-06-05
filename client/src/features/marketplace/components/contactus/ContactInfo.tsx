const contactDetails = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'Office Address',
    value: 'DHA Phase 6, Lahore',
    subValue: 'Punjab, Pakistan',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: 'Phone Number',
    value: '+92 300 1234567',
    href: 'tel:+923001234567',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Email Address',
    value: 'info@zameen360.com',
    href: 'mailto:info@zameen360.com',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Working Hours',
    value: 'Mon – Sat: 9:00 AM – 6:00 PM',
    subValue: 'Sunday: Closed',
  },
];

function ContactInfo() {
  return (
    <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-8 md:p-10 shadow-sm">
      <div className="mb-8">
        <span className="text-[#0D6EFD] text-sm font-semibold uppercase tracking-widest">
          Get In Touch
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-[#061A57] tracking-tight mt-2">
          Contact Information
        </h2>
        <p className="text-[#64748B] mt-2 text-sm leading-relaxed">
          Reach out through any channel — we're here to help you find your perfect property.
        </p>
      </div>

      <div className="space-y-4">
        {contactDetails.map((detail, index) => (
          <div
            key={index}
            className="group flex items-start gap-4 p-4 rounded-xl border border-[#E2E8F0] hover:border-[#0D6EFD]/30 bg-[#F9FBFF] hover:bg-[#EAF2FF] transition-all duration-300"
          >
            <div className="shrink-0 w-10 h-10 rounded-lg bg-[#F1F5F9] text-[#0D6EFD] flex items-center justify-center group-hover:bg-[#0D6EFD] group-hover:text-white transition-all duration-300">
              {detail.icon}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[#64748B] mb-1 font-semibold">
                {detail.label}
              </p>
              {detail.href ? (
                <a
                  href={detail.href}
                  className="text-[#061A57] text-sm font-medium hover:text-[#0D6EFD] transition-colors duration-200"
                >
                  {detail.value}
                </a>
              ) : (
                <p className="text-[#061A57] text-sm font-medium">{detail.value}</p>
              )}
              {detail.subValue && (
                <p className="text-[#64748B] text-xs mt-0.5">{detail.subValue}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 mt-6 border-t border-[#E5EAF2]">
        <p className="text-xs uppercase tracking-wider text-[#64748B] mb-3 font-semibold">
          Follow Us
        </p>
        <div className="flex gap-3">
          <a
            href="https://www.facebook.com/zameen360"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#0D6EFD] hover:bg-[#0D6EFD] hover:text-white border border-[#E2E8F0] hover:border-[#0D6EFD] transition-all duration-300"
            aria-label="Facebook"
          >
            <i className="fa-brands fa-facebook-f"></i>
          </a>
          <a
            href="https://www.twitter.com/zameen360"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#0D6EFD] hover:bg-[#0D6EFD] hover:text-white border border-[#E2E8F0] hover:border-[#0D6EFD] transition-all duration-300"
            aria-label="Twitter"
          >
            <i className="fa-brands fa-x-twitter"></i>
          </a>
          <a
            href="https://www.instagram.com/zameen360"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#0D6EFD] hover:bg-[#0D6EFD] hover:text-white border border-[#E2E8F0] hover:border-[#0D6EFD] transition-all duration-300"
            aria-label="Instagram"
          >
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a
            href="https://www.linkedin.com/company/zameen360"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#0D6EFD] hover:bg-[#0D6EFD] hover:text-white border border-[#E2E8F0] hover:border-[#0D6EFD] transition-all duration-300"
            aria-label="LinkedIn"
          >
            <i className="fa-brands fa-linkedin-in"></i>
          </a>
        </div>
      </div>
    </div>
  );
}

export default ContactInfo;