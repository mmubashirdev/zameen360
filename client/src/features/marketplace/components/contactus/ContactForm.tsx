import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, type ContactFormData } from '../contactus/contactSchema';
import { submitContactForm } from './api/contactusApi';
import { useToast } from '@shared/hooks/useToast';

function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { success, error } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: '', email: '', phone: '', subject: '', message: '' },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      setSubmitError(null);
      const response = await submitContactForm(data);
      
      if (response.success) {
        setIsSubmitted(true);
        success('Message sent successfully! We\'ll respond within 24 hours.');
        reset();
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        setSubmitError(response.message || 'Failed to submit form');
        error(response.message || 'Failed to submit form');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to submit contact form. Please try again.';
      setSubmitError(errorMessage);
      error(errorMessage);
      console.error('Contact form submission error:', error);
    }
  };

  const inputBaseClass =
    'w-full bg-[#FFFFFF] border rounded-lg pl-10 pr-4 py-3 text-[#061A57] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200';
  const inputNormalClass = `${inputBaseClass} border-[#DCE4EE] focus:ring-[#0D6EFD]/50 focus:border-[#0D6EFD]`;
  const inputErrorClass = `${inputBaseClass} border-red-400 focus:ring-red-400/50`;

  const textareaBaseClass =
    'w-full bg-[#FFFFFF] border rounded-lg px-4 py-3 text-[#061A57] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 resize-none';
  const textareaNormalClass = `${textareaBaseClass} border-[#DCE4EE] focus:ring-[#0D6EFD]/50 focus:border-[#0D6EFD]`;
  const textareaErrorClass = `${textareaBaseClass} border-red-400 focus:ring-red-400/50`;

  return (
    <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-sm p-8 md:p-10">
      <div className="mb-8">
        <span className="text-[#0D6EFD] text-sm font-semibold uppercase tracking-widest">
          Send Us a Message
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-[#061A57] tracking-tight mt-2">
          We'd Love to Hear From You
        </h2>
        <p className="text-[#64748B] mt-2 text-sm leading-relaxed">
          Have a question or need assistance? Fill out the form below and our team will get back to you within 24 hours.
        </p>
      </div>

      {isSubmitted && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">Message sent successfully! We'll respond within 24 hours.</span>
        </div>
      )}

      {submitError && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name */}
          <div className="w-full">
            <label htmlFor="name" className="block text-sm font-medium text-[#475569] mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input id="name" placeholder="Muhammad Ali" className={errors.name ? inputErrorClass : inputNormalClass} {...register('name')} />
            </div>
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="w-full">
            <label htmlFor="email" className="block text-sm font-medium text-[#475569] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input id="email" type="email" placeholder="ali@example.com" className={errors.email ? inputErrorClass : inputNormalClass} {...register('email')} />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Phone */}
          <div className="w-full">
            <label htmlFor="phone" className="block text-sm font-medium text-[#475569] mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <input id="phone" type="tel" placeholder="+92 300 1234567" className={errors.phone ? inputErrorClass : inputNormalClass} {...register('phone')} />
            </div>
            {errors.phone && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Subject */}
          <div className="w-full">
            <label htmlFor="subject" className="block text-sm font-medium text-[#475569] mb-1.5">
              Subject
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <input id="subject" placeholder="Property inquiry in DHA" className={errors.subject ? inputErrorClass : inputNormalClass} {...register('subject')} />
            </div>
            {errors.subject && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {errors.subject.message}
              </p>
            )}
          </div>
        </div>

        {/* Message */}
        <div className="w-full">
          <label htmlFor="message" className="block text-sm font-medium text-[#475569] mb-1.5">
            Message
          </label>
          <textarea
            id="message"
            placeholder="Tell us about your requirements, preferred location, budget, or any questions you have..."
            rows={5}
            className={errors.message ? textareaErrorClass : textareaNormalClass}
            {...register('message')}
          />
          {errors.message && (
            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
              <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {errors.message.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-[#94A3B8] hidden sm:block">
            All fields are required · We respect your privacy
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 font-semibold rounded-lg px-8 py-3.5 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-linear-to-r from-[#2563EB] to-[#0D6EFD] hover:from-[#1D4ED8] hover:to-[#1D4ED8] text-white shadow-lg shadow-[#0D6EFD]/25 hover:shadow-[#1D4ED8]/40"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sending...
              </>
            ) : (
              <>
                <span>Send Message</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ContactForm;
