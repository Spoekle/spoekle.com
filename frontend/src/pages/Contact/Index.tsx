import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaUser, FaPaperPlane, FaTag } from 'react-icons/fa';
import { useNotification } from '../../context/NotificationContext';
import DefaultLayout from '../../layouts/DefaultLayout';
import contactImage from '../../assets/spoekle.webp';

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

// Helper function to ensure animations always display
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

const ContactPage: React.FC = () => {
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
            const response = await fetch('/api/contact/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showSuccess(data.message || 'Your message has been sent successfully!');
                setForm({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            } else {
                if (data.details && Array.isArray(data.details)) {
                    data.details.forEach((error: string) => showError(error));
                } else {
                    showError(data.error || 'Failed to send message. Please try again.');
                }
            }
        } catch (error) {
            console.error('Contact form error:', error);
            showError('Failed to send message. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DefaultLayout
            title="Contact Me"
            subtitle="Let's get in touch!"
            backgroundImage={contactImage}
            metaDescription="Get in touch with Spoekle - reach out for collaborations, questions, or just to say hello!"
        >
            {/* Contact Introduction */}
            <section className="py-16 bg-neutral-100 dark:bg-neutral-900/50 rounded-xl overflow-hidden shadow-lg mb-12">
                <div className="container mx-auto px-4 md:px-8">
                    <motion.div
                        className="max-w-4xl mx-auto text-center"
                        {...useAlwaysInView}
                        variants={staggerContainer}
                    >
                        <motion.h2
                            className="text-3xl font-bold text-neutral-800 dark:text-white mb-8 inline-block border-b-4 border-purple-500 pb-2"
                            variants={fadeIn}
                        >
                            Get In Touch
                        </motion.h2>

                        <motion.div className="prose prose-lg dark:prose-invert mx-auto" variants={fadeIn}>
                            <p className="text-neutral-700 dark:text-gray-300 text-lg mb-6">
                                Have a question, want to collaborate, or just want to say hello? I'd love to hear from you! 
                                Whether it's about web development, photography, gaming, or anything else, feel free to reach out.
                            </p>
                            <p className="text-neutral-700 dark:text-gray-300 text-base">
                                I typically respond within 24-48 hours, so don't worry if you don't hear back immediately!
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="py-16 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-xl shadow-lg mb-12">
                <div className="container mx-auto px-4 md:px-8">
                    <motion.div
                        className="max-w-2xl mx-auto"
                        {...useAlwaysInView}
                        variants={staggerContainer}
                    >
                        <motion.h2
                            className="text-3xl font-bold text-neutral-800 dark:text-white mb-8 text-center inline-block border-b-4 border-indigo-500 pb-2"
                            variants={fadeIn}
                        >
                            Send Me a Message
                        </motion.h2>

                        <motion.form
                            onSubmit={handleSubmit}
                            className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/50"
                            variants={fadeIn}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Name Field */}
                                <motion.div variants={fadeIn}>
                                    <label htmlFor="name" className="flex items-center text-sm font-medium text-neutral-700 dark:text-gray-300 mb-2">
                                        <FaUser className="mr-2 text-purple-500" />
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={form.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 dark:bg-neutral-700/80 text-neutral-800 dark:text-white placeholder-neutral-500 dark:placeholder-gray-400 transition duration-200"
                                        placeholder="Your full name"
                                        disabled={isSubmitting}
                                    />
                                </motion.div>

                                {/* Email Field */}
                                <motion.div variants={fadeIn}>
                                    <label htmlFor="email" className="flex items-center text-sm font-medium text-neutral-700 dark:text-gray-300 mb-2">
                                        <FaEnvelope className="mr-2 text-purple-500" />
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 dark:bg-neutral-700/80 text-neutral-800 dark:text-white placeholder-neutral-500 dark:placeholder-gray-400 transition duration-200"
                                        placeholder="your.email@example.com"
                                        disabled={isSubmitting}
                                    />
                                </motion.div>
                            </div>

                            {/* Subject Field */}
                            <motion.div className="mb-6" variants={fadeIn}>
                                <label htmlFor="subject" className="flex items-center text-sm font-medium text-neutral-700 dark:text-gray-300 mb-2">
                                    <FaTag className="mr-2 text-purple-500" />
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={form.subject}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 dark:bg-neutral-700/80 text-neutral-800 dark:text-white placeholder-neutral-500 dark:placeholder-gray-400 transition duration-200"
                                    placeholder="What's this about?"
                                    disabled={isSubmitting}
                                />
                            </motion.div>

                            {/* Message Field */}
                            <motion.div className="mb-8" variants={fadeIn}>
                                <label htmlFor="message" className="flex items-center text-sm font-medium text-neutral-700 dark:text-gray-300 mb-2">
                                    <FaPaperPlane className="mr-2 text-purple-500" />
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={form.message}
                                    onChange={handleInputChange}
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 dark:bg-neutral-700/80 text-neutral-800 dark:text-white placeholder-neutral-500 dark:placeholder-gray-400 resize-vertical transition duration-200"
                                    placeholder="Tell me about your project, question, or just say hello!"
                                    disabled={isSubmitting}
                                />
                            </motion.div>

                            {/* Submit Button */}
                            <motion.div className="text-center" variants={fadeIn}>
                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <FaPaperPlane className="mr-2" />
                                            Send Message
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>
                        </motion.form>
                    </motion.div>
                </div>
            </section>

            {/* Contact Information */}
            <section className="py-16 bg-neutral-100 dark:bg-neutral-900/50 rounded-xl shadow-lg">
                <div className="container mx-auto px-4 md:px-8">
                    <motion.div
                        className="max-w-4xl mx-auto text-center"
                        {...useAlwaysInView}
                        variants={staggerContainer}
                    >
                        <motion.h2
                            className="text-3xl font-bold text-neutral-800 dark:text-white mb-8 inline-block border-b-4 border-cyan-500 pb-2"
                            variants={fadeIn}
                        >
                            Other Ways to Connect
                        </motion.h2>

                        <motion.div className="prose prose-lg dark:prose-invert mx-auto" variants={fadeIn}>
                            <p className="text-neutral-700 dark:text-gray-300 mb-6">
                                You can also find me on various platforms around the web. Feel free to connect with me 
                                on social media, check out my work, or join the communities I'm part of!
                            </p>
                            <p className="text-neutral-700 dark:text-gray-300 text-base">
                                I'm most active on Discord, where I share updates about my projects and interact with the community.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </DefaultLayout>
    );
};

export default ContactPage;
