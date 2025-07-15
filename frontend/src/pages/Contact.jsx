import React from 'react';
import Layout from '../components/Layout';
import { EnvelopeIcon, UserIcon, PencilIcon } from '@heroicons/react/24/outline';
import ButtonCrossArrow from "../ui/Contact-btn";

export default function Contact() {
  return (
    <Layout>
      <section className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 py-16 px-4 flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-10 md:p-16 transition-all">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">Get in Touch</h2>

          <form className="space-y-6">
            {/* Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <UserIcon className="w-5 h-5 text-gray-400 absolute top-3 left-3" />
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="relative">
                <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute top-3 left-3" />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="relative">
              <PencilIcon className="w-5 h-5 text-gray-400 absolute top-3 left-3" />
              <input
                type="text"
                placeholder="Subject"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Message */}
            <div>
              <textarea
                placeholder="Your message..."
                rows="5"
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="text-center">
               {/* <Link className="text-gray-700 hover:text-blue-600" to="" ><ButtonCrossArrow /></Link> */}
               <ButtonCrossArrow />

            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
}
