'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaEnvelope, FaUser, FaTag } from 'react-icons/fa';
import { MdMessage } from 'react-icons/md';
import { useNotification } from '@/context/NotificationContext';
import DefaultLayout from '@/components/DefaultLayout';

// Animation variants
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const useAlwaysInView = {
  initial: "hidden",
  animate: "visible", 
  whileInView: "visible",
  viewport: { once: true, amount: 0.1 }
};

interface ContactForm {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useNotification();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
        ...prev,
        [name]: value
    }));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!form.name.trim() || form.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.push('Please provide a valid email address');
    }
    
    if (!form.subject.trim() || form.subject.trim().length < 5) {
        errors.push('Subject must be at least 5 characters long');
    }
    
    if (!form.message.trim() || form.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
        validationErrors.forEach(error => showError(error));
        return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      showSuccess('Thank you for your message! I\'ll get back to you as soon as possible.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      showError('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DefaultLayout
      title="Contact Me"
      subtitle="Let's work together"
      backgroundImage="/assets/spoekle.webp"
    >
      {/* Intro Section */}
      <section className="py-32 bg-neutral-100/80 dark:bg-neutral-950/40 backdrop-blur-sm rounded-2xl mb-16">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            {...useAlwaysInView}
            variants={staggerContainer}
          >
            <motion.h2
              className="text-5xl md:text-6xl font-black text-neutral-900 dark:text-white mb-12"
              variants={fadeIn}
            >
              Get In Touch
            </motion.h2>

            <motion.div className="prose prose-lg dark:prose-invert max-w-none" variants={fadeIn}>
              <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
                Whether you have a project in mind, a question, or just want to say hello, I'd love to hear from you!
                Fill out the form below and I'll get back to you as soon as possible.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-32 bg-neutral-50 dark:bg-neutral-950/70 backdrop-blur-sm rounded-2xl mb-16">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            {...useAlwaysInView}
            variants={staggerContainer}
          >
            <motion.h2
              className="text-5xl md:text-6xl font-black text-neutral-900 dark:text-white mb-12"
              variants={fadeIn}
            >
              Send Me a Message
            </motion.h2>

            <motion.div
              className="bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl rounded-2xl border border-neutral-200 dark:border-white/10 shadow-lg dark:shadow-none p-10"
              variants={fadeIn}
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label htmlFor="name" className="block text-base font-semibold text-neutral-900 dark:text-white mb-3">
                    Your Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 pl-12 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent text-neutral-900 dark:text-white transition-all duration-300"
                      placeholder="John Doe"
                    />
                    <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-base font-semibold text-neutral-900 dark:text-white mb-3">
                    Your Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 pl-12 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent text-neutral-900 dark:text-white transition-all duration-300"
                      placeholder="john@example.com"
                    />
                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-base font-semibold text-neutral-900 dark:text-white mb-3">
                    Subject
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 pl-12 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent text-neutral-900 dark:text-white transition-all duration-300"
                      placeholder="What's this about?"
                    />
                    <FaTag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-base font-semibold text-neutral-900 dark:text-white mb-3">
                    Your Message
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-4 pl-12 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent text-neutral-900 dark:text-white resize-none transition-all duration-300"
                      placeholder="Tell me about your project or question..."
                    />
                    <MdMessage className="absolute left-4 top-5 text-neutral-400" />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02, y: isSubmitting ? 0 : -2 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                  className="w-full flex items-center justify-center px-8 py-5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-lg font-bold rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="mr-3" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Other Ways to Connect Section */}
      <section className="py-32 bg-neutral-100/80 dark:bg-neutral-950/40 backdrop-blur-sm rounded-2xl">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            {...useAlwaysInView}
            variants={staggerContainer}
          >
            <motion.h2
              className="text-5xl md:text-6xl font-black text-neutral-900 dark:text-white mb-12"
              variants={fadeIn}
            >
              Other Ways to Connect
            </motion.h2>

            <motion.div className="prose prose-lg dark:prose-invert max-w-none" variants={fadeIn}>
              <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
                Prefer to connect on social media? You can find me on various platforms where I share updates,
                content, and interact with the community. Feel free to reach out through any of these channels!
              </p>

              <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                I'm most active on Discord, TikTok, and GitHub, so those are your best bets for a quicker response!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </DefaultLayout>
  );
}
