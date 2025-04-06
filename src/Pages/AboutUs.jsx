import React from 'react';
import { Users, Award, Globe, Wrench } from 'lucide-react';
import { Footer, Header } from '../components';
import thameen from '../assets/thameen.jpeg';

const stats = [
  {
    icon: <Users className='h-8 w-8' />,
    value: '50,000+',
    label: 'Happy Customers',
  },
  {
    icon: <Award className='h-8 w-8' />,
    value: '15+',
    label: 'Years Experience',
  },
  {
    icon: <Globe className='h-8 w-8' />,
    value: '100+',
    label: 'Nationwide Served',
  },
  {
    icon: <Wrench className='h-8 w-8' />,
    value: '10,000+',
    label: 'Parts Sold Monthly',
  },
];

const teamMembers = [
  {
    name: 'M Thameen',
    role: 'CEO & Founder',
    image: thameen,
    bio: 'With 5 years in the industry, Thameen founded MOTOLAB to bring quality bike parts to riders all across the country.',
  },
];

export function AboutUs() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-yellow-50'>
      <Header />

      {/* Main Content */}
      <div className='container mx-auto px-4 py-16'>
        {/* Hero Section */}
        <section className='mb-20 text-center'>
          <h1 className='text-5xl font-bold mb-6 text-gray-900'>
            About MOTOLAB
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Passion for cycling. Commitment to quality. Dedication to our
            riders.
          </p>
        </section>

        {/* Our Story */}
        <section className='mb-20'>
          <div className='max-w-4xl mx-auto text-center bg-white rounded-3xl p-12 shadow-lg'>
            <h2 className='text-4xl font-bold mb-6 text-gray-900'>Our Story</h2>
            <div className='space-y-6 text-gray-600 leading-relaxed'>
              <p>
                Founded in 2020, MOTOLAB PIT SHOP emerged from a simple vision:
                to provide cyclists with access to high-quality bike parts
                without the hassle. What started as a small local shop has grown
                into a global platform serving cycling enthusiasts in over 100
                countries.
              </p>
              <p>
                Our commitment to quality, expertise in cycling technology, and
                dedication to customer satisfaction has made us a trusted name
                in the cycling community. We're not just selling parts; we're
                building lasting relationships with cyclists worldwide.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className='mb-20'>
          <div className='max-w-6xl mx-auto'>
            <h2 className='text-4xl font-bold mb-16 text-center text-gray-900'>
              By The Numbers
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className='bg-white rounded-2xl p-8 text-center shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl'
                >
                  <div className='inline-flex p-4 bg-yellow-100 text-yellow-600 rounded-full mb-6'>
                    {stat.icon}
                  </div>
                  <div className='text-5xl font-bold text-gray-900 mb-3'>
                    {stat.value}
                  </div>
                  <div className='text-gray-600 font-medium text-lg'>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Commitment */}
        <section className='mb-20'>
          <div className='max-w-4xl mx-auto bg-yellow-600 rounded-3xl p-12 text-center text-white'>
            <h2 className='text-4xl font-bold mb-8'>
              Our Commitment to Riders
            </h2>
            <p className='text-xl mb-10 leading-relaxed'>
              At MOTOLAB, we believe that a great ride comes down to the perfect
              balance of performance, safety, and comfort.
            </p>
            <div className='grid md:grid-cols-2 gap-8'>
              {[
                {
                  title: 'Heavy-Duty Bike Lights',
                  description:
                    'Stay visible and safe on the road with our high-performance motorcycle lights—built for durability and dependable illumination in all conditions.',
                },
                {
                  title: 'Comfort-Fit Seats',
                  description:
                    'Ride longer with our ergonomically designed motorcycle seats, offering superior comfort and support for both short commutes and long journeys.',
                },
                {
                  title: 'Precision Foot Pegs',
                  description:
                    'Engineered for grip and control, our foot pegs give you the stability and comfort needed for every type of ride—from city cruising to off-road adventures.',
                },
                {
                  title: 'Performance Handle Grips',
                  description:
                    'Enhance your handling with our vibration-dampening grips, designed for all-day comfort and confident control on any terrain.',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className='bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.02]'
                >
                  <h3 className='text-2xl font-semibold mb-4'>{item.title}</h3>
                  <p className='text-yellow-100 leading-relaxed'>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className='mb-20'>
          <div className='max-w-4xl mx-auto text-center'>
            <h2 className='text-4xl font-bold mb-16 text-gray-900'>
              Our Values
            </h2>
            <div className='grid md:grid-cols-3 gap-8'>
              {[
                {
                  title: 'Quality First',
                  description:
                    'We never compromise on quality. Every part we sell meets rigorous standards for durability and performance.',
                },
                {
                  title: 'Customer Success',
                  description:
                    'Your success is our success. We provide expert support to ensure you get the most from your purchases.',
                },
                {
                  title: 'Innovation',
                  description:
                    'We continuously evolve our product line to bring you the latest advancements in cycling technology.',
                },
              ].map((value, index) => (
                <div
                  key={index}
                  className='bg-white rounded-2xl p-8 shadow-lg transform transition-all duration-300 hover:scale-[1.02]'
                >
                  <div className='h-24 w-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                    <div className='text-3xl font-bold text-yellow-600'>
                      {index + 1}
                    </div>
                  </div>
                  <h3 className='text-2xl font-semibold mb-4 text-gray-800'>
                    {value.title}
                  </h3>
                  <p className='text-gray-600 leading-relaxed'>
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className='mb-20'>
          <div className='max-w-4xl mx-auto text-center'>
            <h2 className='text-4xl font-bold mb-16 text-gray-900'>
              Meet Our Team
            </h2>
            <div className='flex flex-wrap justify-center gap-8'>
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className='bg-white rounded-2xl p-8 shadow-lg w-full sm:w-96 transform transition-all duration-300 hover:-translate-y-2'
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className='w-40 h-40 rounded-full mx-auto mb-6 object-cover border-4 border-yellow-100'
                  />
                  <h3 className='text-2xl font-semibold mb-2 text-gray-800'>
                    {member.name}
                  </h3>
                  <p className='text-yellow-600 text-lg mb-6 font-medium'>
                    {member.role}
                  </p>
                  <p className='text-gray-600 leading-relaxed'>{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className='mb-20'>
          <div className='max-w-4xl mx-auto bg-gradient-to-r from-yellow-500 to-yellow-700 rounded-3xl p-12 text-center text-white shadow-xl'>
            <h2 className='text-4xl font-bold mb-6'>Our Mission</h2>
            <blockquote className='text-2xl italic leading-relaxed'>
              "To empower riders across the nation by providing access to
              premium motorcycle accessories, expert knowledge, and exceptional
              service—making every ride better than the last."
            </blockquote>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default AboutUs;
