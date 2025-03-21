import React from 'react';
import { Users, Award, Globe, Wrench } from 'lucide-react';
import { Footer, Header } from '../components';

const stats = [
  { icon: <Users className="h-8 w-8" />, value: '50,000+', label: 'Happy Customers' },
  { icon: <Award className="h-8 w-8" />, value: '15+', label: 'Years Experience' },
  { icon: <Globe className="h-8 w-8" />, value: '100+', label: 'Countries Served' },
  { icon: <Wrench className="h-8 w-8" />, value: '10,000+', label: 'Parts Sold Monthly' },
];

const teamMembers = [
  {
    name: 'M Thameen',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300',
    bio: 'With 5 years in the cycling industry, Sarah founded MOTOLAB with a vision to make quality bike parts accessible worldwide.'
  },
  {
    name: 'Yusuf',
    role: 'Supporter',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300&h=300',
    bio: 'Marcus brings 2 years of mechanical  expertise, ensuring our parts meet the highest quality standards.'
  },
  {
    name: 'VIRAL GOAT',
    role: 'Customer Success Director',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300&h=300',
    bio: 'Emma leads our customer support team, dedicated to providing exceptional service to cyclists worldwide.'
  }
];

export function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50">
      <Header />
      

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Our Story */}
        <section className="mb-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Our Story</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Founded in 2020, MOTOLAB PIT SHOP emerged from a simple vision: to provide cyclists with access to high-quality bike parts without the hassle. What started as a small local shop has grown into a global platform serving cycling enthusiasts in over 100 countries.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our commitment to quality, expertise in cycling technology, and dedication to customer satisfaction has made us a trusted name in the cycling community. We're not just selling parts; we're building lasting relationships with cyclists worldwide.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center transform transition-all duration-300 hover:-translate-y-2"
              >
                <div className="inline-flex p-4 bg-indigo-100 text-indigo-600 rounded-full mb-4 shadow-md">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-20 bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-4xl font-bold mb-8 text-center text-gray-900">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {['Quality First', 'Customer Success', 'Innovation'].map((title, index) => (
              <div 
                key={index} 
                className="text-center transform transition-all duration-300 hover:scale-105"
              >
                <h3 className="text-xl font-semibold mb-4 text-indigo-600">{title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {index === 0 
                    ? 'We never compromise on quality. Every part we sell meets rigorous standards for durability and performance.'
                    : index === 1 
                    ? 'Your success is our success. We provide expert support to ensure you get the most from your purchases.'
                    : 'We continuously evolve our product line to bring you the latest advancements in cycling technology.'}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-10 text-center text-gray-900">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-6 shadow-md transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover transform transition-transform duration-300 hover:scale-105"
                />
                <h3 className="text-xl font-semibold text-center mb-2 text-gray-800">{member.name}</h3>
                <p className="text-indigo-600 text-center mb-4 font-medium">{member.role}</p>
                <p className="text-gray-600 text-center leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission Statement */}
        <section className="mb-20 bg-indigo-50 rounded-2xl p-8 shadow-md">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Our Mission</h2>
            <p className="text-gray-700 text-lg italic leading-relaxed">
              "To empower cyclists worldwide by providing access to premium bike parts, expert knowledge, and exceptional service, making every ride better than the last."
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default AboutUs;