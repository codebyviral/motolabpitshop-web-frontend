import React from 'react';
import { MessageSquare, Mail, Phone, Ticket, MessageCircle } from 'lucide-react';
import { Footer, Header } from '../components';
const contactMethods = [
  {
    icon: <MessageSquare className="h-8 w-8 text-indigo-600" />,
    title: 'Live Chat',
    description: 'Available 24/7 for instant support',
    action: 'Start Chat',
    link: 'https://wa.me/919025194684',
  },
  {
    icon: <Mail className="h-8 w-8 text-indigo-600" />,
    title: 'Email Support',
    description: 'Response within 24-48 hours',
    action: 'Send Email',
    link: 'mailto:motolabpitshop@gmail.com',
  },
  {
    icon: <Phone className="h-8 w-8 text-indigo-600" />,
    title: 'Phone Support',
    description: '9 AM – 6 PM',
    action: 'Call Now',
    link: 'tel:9025194684',
  },
  {
    icon: <MessageCircle className="h-8 w-8 text-indigo-600" />,
    title: 'Social Media',
    description: 'Connect on social platforms',
    action: 'Follow Us',
    link: 'https://www.instagram.com/thameen_pvt?igsh=MXI4MmV1YXJ0bWxpeQ==',
  },
];

export function ContactMethods() {
  return (
    <div className="">
       <Header />
      <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
        Get in Touch
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {contactMethods.map((method, index) => (
          <a
            key={index}
            href={method.link}
            className="group block bg-white p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-gradient-to-br from-indigo-50 to-blue-50"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-indigo-100 rounded-full text-indigo-600 transform transition-transform duration-300 group-hover:scale-110">
                {method.icon}
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-gray-900">{method.title}</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">{method.description}</p>
              <button
                className="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-full font-medium transform transition-all duration-300 hover:from-indigo-600 hover:to-blue-600 hover:scale-105"
              >
                {method.action}
              </button>
            </div>
            
          </a>
        ))}
      </div>
      <Footer/>
    </div>
    
  );
}

export default ContactMethods;