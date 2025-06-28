import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
      <div className="sm:flex sm:gap-8 sm:flex-row w-full flex flex-col gap-12 min-h-[30vh] bg-black text-white px-6 py-10">
        {/* Info */}
        <div className="flex items-start sm:w-[30%] flex-col gap-6">
          <h1 className="text-4xl font-bold font-mono text-[#B0B0B0]">
            quickConnect
          </h1>
          <p className="text-sm">
            Unlock your potential with our expertly curated courses and hands-on projects. Learn, grow, and build your future — one lesson at a time.
          </p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-6 sm:w-[20%]">
          <h1 className="text-xl font-bold font-mono">Get in Touch</h1>
          <div className="flex flex-col gap-2">
            <Link
              to="https://www.instagram.com/subarnaad "
              target="_blank"

              className="hover:text-[#999999]"
            >
              Instagram
            </Link>
            <Link
              to="https://github.com/subarnaad"
              target="_blank"
              className="hover:text-[#999999]"
            >
              Github
            </Link>
            <Link
              to="https://www.linkedin.com/in/subarna-adikari-672401174/"
              target="_blank"
              className="hover:text-[#999999]"
            >
              LinkedIn
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-6 sm:w-[20%]">
          <h1 className="text-xl font-bold font-mono">Quick Links</h1>
          <div className="flex flex-col gap-2">
            <Link to="/home" className="hover:text-[#999999]">Home</Link>
            <Link to="/courses" className="hover:text-[#999999]">Courses</Link>
            <Link to="/about" className="hover:text-[#999999]">About Us</Link>
            <Link to="/contact" className="hover:text-[#999999]">Contact</Link>
          </div>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-6 sm:w-[30%]">
          <h1 className="text-xl font-bold font-mono">Subscribe</h1>
          <p className="text-sm">Join our newsletter to get the latest updates.</p>
          <div className="flex items-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 rounded-l-md text-black w-full focus:outline-none"
            />
            <button className="px-4 py-2 bg-[#B0B0B0] text-black font-bold rounded-r-md hover:bg-[#999999]">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="w-full h-[1px] bg-gray-700" />

      {/* Bottom note */}
      <div className="py-4 text-center w-full bg-black text-white text-sm">
        © 2025 <span className="text-[#B0B0B0]">quickConnect</span> | All Rights Reserved.
      </div>
    </>
  );
}

export default Footer;
