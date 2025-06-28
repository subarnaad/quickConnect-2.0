import { Linkedin, Instagram, Github, Phone, Mail,  } from "lucide-react";
import { Button } from "@/components/ui/button";

function Contact() {
  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen bg-[#F9F9F9] p-6">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-[#333]">Contact Us</h1>
        <p className="mt-4 text-lg text-[#666]">
          We would love to hear from you! Please fill out the form below.
        </p>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <form className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                type="text"
                placeholder="First Name"
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <input
                type="text"
                placeholder="Last Name"
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                type="email"
                placeholder="Email Address"
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <input
                type="tel"
                placeholder="Phone Number"
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
            </div>
            <textarea
                placeholder="Enter your queries"
                rows={5}
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <Button
                type="submit"
                className="bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition"
            >
                Send Message
            </Button>
            </form>
        </div>



        {/* Contact Details & Map */}
        <div className="flex flex-col gap-6">
          {/* Phone and Email */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Reach Us At</h2>
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <Phone /> <span>+977-9800000098</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <Mail /> <span>info@quickConnect.com</span>
            </div>
          </div>


          {/* Social Links */}
            {/* Social Links */}
            <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
            <div className="flex gap-6 text-2xl text-gray-700 cursor-pointer">
                <Linkedin
                className="hover:text-black transition"
                onClick={() =>
                    window.open("https://www.linkedin.com/in/subarna-adikari-672401174/", "_blank")
                }
                />
                <Instagram
                className="hover:text-black transition"
                onClick={() =>
                    window.open("https://www.instagram.com/subarnaad/", "_blank")
                }
                />
                <Github
                className="hover:text-black transition"
                onClick={() => window.open("https://github.com/subarnaad", "_blank")}
                />
            </div>
            </div>


          {/* Location Map */}
          <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.1681541846797!2d85.32819117532394!3d27.712093976179858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb196de5da5741%3A0x652792640c70ede9!2z4KS54KWH4KSw4KS-4KSy4KWN4KShIOCkleCksuClh-CknA!5e0!3m2!1sne!2snp!4v1744131937090!5m2!1sne!2snp"
              width="100%"
              height="200"
              allowFullScreen=""
              loading="lazy"
              className="border-0 w-full h-[200px]"
            >You Can Visit Us</iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
