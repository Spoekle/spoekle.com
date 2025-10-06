'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyStatementPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[250px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-indigo-600/30 to-blue-600/30 dark:from-purple-900/50 dark:via-indigo-900/50 dark:to-blue-900/50" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-center text-white drop-shadow-lg"
          >
            Privacy Statement
          </motion.h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-neutral-700/50 p-8 md:p-12"
        >
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8">
              Last Updated: October 5, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Introduction</h2>
              <p className="text-neutral-700 dark:text-neutral-300">
                This privacy statement explains how spoekle.com ("we", "us", or "our") collects, uses, and protects your personal information when you visit our website or use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
              <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                When you register for an account or contact us, we may collect:
              </p>
              <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300 mb-4">
                <li>Username</li>
                <li>Email address</li>
                <li>Profile picture (optional)</li>
                <li>Any information you provide in contact forms or messages</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Authentication Data</h3>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                If you choose to authenticate using Discord OAuth, we collect:
              </p>
              <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300 mb-4">
                <li>Discord user ID</li>
                <li>Discord username</li>
                <li>Discord avatar</li>
                <li>Email address (if shared)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Usage Data</h3>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                We automatically collect certain information when you visit our website:
              </p>
              <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent</li>
                <li>Referral source</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                We use the collected information for:
              </p>
              <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                <li>Providing and maintaining our services</li>
                <li>Authenticating users and managing accounts</li>
                <li>Responding to inquiries and support requests</li>
                <li>Improving our website and user experience</li>
                <li>Sending important updates and notifications</li>
                <li>Detecting and preventing fraud or abuse</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Data Storage and Security</h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                We take reasonable measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                <li>Passwords are encrypted using industry-standard bcrypt hashing</li>
                <li>Data is stored securely in MongoDB databases</li>
                <li>Access to personal data is restricted to authorized personnel only</li>
                <li>We use HTTPS encryption for all data transmission</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Cookies and Local Storage</h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                Our website uses localStorage to:
              </p>
              <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                <li>Store authentication tokens for logged-in users</li>
                <li>Remember user preferences (e.g., dark mode)</li>
                <li>Improve user experience across sessions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                We use the following third-party services:
              </p>
              <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                <li><strong>Discord OAuth:</strong> For authentication purposes. Please review Discord's privacy policy for more information.</li>
                <li><strong>Email Services:</strong> For sending notifications and password resets.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to data processing</li>
                <li>Export your data</li>
              </ul>
              <p className="text-neutral-700 dark:text-neutral-300 mt-4">
                To exercise these rights, please contact us through our contact form or email.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
              <p className="text-neutral-700 dark:text-neutral-300">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this privacy statement, unless a longer retention period is required by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
              <p className="text-neutral-700 dark:text-neutral-300">
                Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Changes to This Privacy Statement</h2>
              <p className="text-neutral-700 dark:text-neutral-300">
                We may update this privacy statement from time to time. We will notify you of any significant changes by posting the new statement on this page and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-neutral-700 dark:text-neutral-300">
                If you have any questions about this privacy statement or our data practices, please contact us through our contact form.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
