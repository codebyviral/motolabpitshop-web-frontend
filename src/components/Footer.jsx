import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container px-6 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <h2 className="max-w-lg text-xl font-bold tracking-tight xl:text-2xl">
              Join our newsletter
            </h2>
            <p className="mt-2 text-gray-300">
              Get updates on new gear and exclusive offers
            </p>

            <div className="flex flex-col mx-auto mt-6 space-y-3 md:space-y-0 md:flex-row">
              <input
                id="email"
                type="text"
                className="px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-yellow-400 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-yellow-300"
                placeholder="Email Address"
              />

              <button className="w-full px-6 py-2.5 text-sm font-medium tracking-wider text-gray-900 transition-colors duration-300 transform md:w-auto md:mx-4 focus:outline-none bg-yellow-400 rounded-md hover:bg-yellow-500 focus:ring focus:ring-yellow-300 focus:ring-opacity-80">
                Subscribe
              </button>
            </div>
          </div>

          <div>
            <p className="font-bold text-white">Quick Links</p>

            <div className="flex flex-col items-start mt-5 space-y-2">
              <a
                href="#"
                className="text-gray-300 transition-colors duration-300 hover:text-yellow-400 hover:underline"
              >
                Home
              </a>
              <a
                href="#"
                className="text-gray-300 transition-colors duration-300 hover:text-yellow-400 hover:underline"
              >
                Shop
              </a>
              <a
                href="#"
                className="text-gray-300 transition-colors duration-300 hover:text-yellow-400 hover:underline"
              >
                About Us
              </a>
              <a
                href="#"
                className="text-gray-300 transition-colors duration-300 hover:text-yellow-400 hover:underline"
              >
                Blog
              </a>
              <a
                href="#"
                className="text-gray-300 transition-colors duration-300 hover:text-yellow-400 hover:underline"
              >
                Contact
              </a>
            </div>
          </div>

          <div>
            <p className="font-bold text-white">Categories</p>

            <div className="flex flex-col items-start mt-5 space-y-2">
              <a
                href="#"
                className="text-gray-300 transition-colors duration-300 hover:text-yellow-400 hover:underline"
              >
                Helmets
              </a>
              <a
                href="#"
                className="text-gray-300 transition-colors duration-300 hover:text-yellow-400 hover:underline"
              >
                Jackets
              </a>
              <a
                href="#"
                className="text-gray-300 transition-colors duration-300 hover:text-yellow-400 hover:underline"
              >
                Gloves
              </a>
              <a
                href="#"
                className="text-gray-300 transition-colors duration-300 hover:text-yellow-400 hover:underline"
              >
                Boots
              </a>
              <a
                href="#"
                className="text-gray-300 transition-colors duration-300 hover:text-yellow-400 hover:underline"
              >
                Accessories
              </a>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-700 md:my-8" />

        <div className="flex flex-col items-center justify-between md:flex-row">
          <a href="#" className="mb-4 md:mb-0">
            <span className="text-2xl font-bold text-white">MotoLab</span>
          </a>

          <div className="flex items-center space-x-4">
            <a
              href="#"
              className="text-gray-300 transition-colors duration-300 hover:text-yellow-400"
              aria-label="Facebook"
            >
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2.00195 12.002C2.00312 16.9214 5.58036 21.1101 10.439 21.881V14.892H7.90195V12.002H10.442V9.80204C10.3284 8.75958 10.6845 7.72064 11.4136 6.96698C12.1427 6.21332 13.1693 5.82306 14.215 5.90204C14.9655 5.91417 15.7141 5.98101 16.455 6.10205V8.56104H15.191C14.7558 8.50405 14.3183 8.64777 14.0017 8.95171C13.6851 9.25566 13.5237 9.68693 13.563 10.124V12.002H16.334L15.891 14.893H13.563V21.881C18.8174 21.0506 22.502 16.2518 21.9475 10.9611C21.3929 5.67041 16.7932 1.73997 11.4808 2.01722C6.16831 2.29447 2.0028 6.68235 2.00195 12.002Z" />
              </svg>
            </a>

            <a
              href="#"
              className="text-gray-300 transition-colors duration-300 hover:text-yellow-400"
              aria-label="Instagram"
            >
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
              </svg>
            </a>

            <a
              href="#"
              className="text-gray-300 transition-colors duration-300 hover:text-yellow-400"
              aria-label="Twitter"
            >
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>© 2025 MotoLab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
