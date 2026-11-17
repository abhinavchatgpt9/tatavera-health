'use client';

import EnquiryForm from '@/components/EnquiryForm';

/** The contact page uses the same enquiry form as the rest of the site, so every request reaches the team the same way. */
export default function ContactForm() {
  return <EnquiryForm idPrefix="contact" />;
}
