"use client";

import React, { useState } from 'react';
import { databases, ID } from '@/lib/appwrite';
import { Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsSubmitting(true);

    try {
      const feedbackData = {
        name,
        email,
        message,
      };

      await databases.createDocument(
        process.env.NEXT_PUBLIC_DB_ID as string, // Replace with your database ID
        process.env.NEXT_PUBLIC_FEEDBACK_COLLECTION_ID as string, // Replace with your collection ID
        ID.unique(),
        feedbackData
      );

      toast.success('Your message has been sent successfully!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error: any) {
      console.error('Failed to submit feedback:', error);
      toast.error('Failed to send your message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#313638] text-gray-200 antialiased min-h-screen">
      {/* Header */}
      <header className="py-6">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-semibold text-center">Contact Us</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <section className="p-6 bg-[#42474a] rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-100">Get in Touch</h2>
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Mail className="h-6 w-6 text-yellow-500 mr-4" />
              <span className="text-lg text-gray-300">[Your Email Address]</span>
            </div>
            <div className="flex items-center mb-4">
              <Phone className="h-6 w-6 text-yellow-500 mr-4" />
              <span className="text-lg text-gray-300">7558757963</span>
            </div>
          </div>
          <div className="text-gray-400">
            We&apos;re here to help and answer any question you might have. We look forward to hearing from you!
          </div>
        </section>

        {/* Contact Form */}
        <section className="p-6 bg-[#42474a] rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-100">Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-4 py-2 bg-[#313638] border border-gray-600 rounded-md text-gray-200 focus:border-yellow-500 focus:ring-yellow-500"
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 bg-[#313638] border border-gray-600 rounded-md text-gray-200 focus:border-yellow-500 focus:ring-yellow-500"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-300">Message</label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="mt-1 block w-full px-4 py-2 bg-[#313638] border border-gray-600 rounded-md text-gray-200 focus:border-yellow-500 focus:ring-yellow-500"
                placeholder="Enter your message"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 bg-blue-400 text-gray-800 font-semibold rounded-md shadow-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default ContactUs;
