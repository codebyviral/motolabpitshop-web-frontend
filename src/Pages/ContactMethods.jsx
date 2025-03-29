import React from 'react';
import { MessageSquare, Mail, Phone, MessageCircle } from 'lucide-react';
import { Footer, Header } from '../components';

const contactMethods = [
  {
    icon: <MessageSquare className="h-8 w-8 text-black" />,  
    title: 'Live Chat',
    description: 'Available 24/7 for instant support',
    action: 'Start Chat',
    link: 'https://wa.me/919025194684',
  },
  {
    icon: <Mail className="h-8 w-8 text-black" />,  
    title: 'Email Support',
    description: 'Response within 24-48 hours',
    action: 'Send Email',
    link: 'mailto:motolabpitshop@gmail.com',
  },
  {
    icon: <Phone className="h-8 w-8 text-black" />,  
    title: 'Phone Support',
    description: '9 AM – 6 PM',
    action: 'Call Now',
    link: 'tel:9025194684',
  },
  {
    icon: <MessageCircle className="h-8 w-8 text-black" />,  
    title: 'Social Media',
    description: 'Connect on social platforms',
    action: 'Follow Us',
    link: 'https://www.instagram.com/thameen_pvt?igsh=MXI4MmV1YXJ0bWxpeQ==',
  },
];

export function ContactMethods() {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <h2 className="text-4xl font-bold text-black text-center mb-12 py-6 bg-yellow-300">
        Get in Touch
      </h2>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactMethods.map((method, index) => (
            <a
              key={index}
              href={method.link}
              className="group block bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-yellow-50 border border-yellow-200"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-yellow-100 rounded-full text-black transition-transform duration-300 group-hover:scale-110 group-hover:bg-yellow-300">
                  {method.icon}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-black">{method.title}</h3>
                <p className="mt-2 text-gray-700 leading-relaxed">{method.description}</p>
                <button className="mt-4 px-5 py-2 bg-black text-white rounded-full font-medium transition-all duration-300 hover:bg-yellow-400 hover:text-black hover:scale-105">
                  {method.action}
                </button>
              </div>
            </a>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ContactMethods;