import { Target, Eye, Users, Star } from "lucide-react";

function Aboutus() {
  return (
    <div className="bg-gray-50 py-16 px-6 md:px-20 text-gray-800">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-6 text-center text-gray-800 tracking-tight">
          About <span className="text-gray-800">quickConnect</span>
        </h1>
        <p className="text-lg text-center text-gray-600 mb-14 max-w-2xl mx-auto">
          Empowering learners worldwide through <span className="font-semibold text-gray-800">accessible</span>,
          <span className="font-semibold text-gray-800"> flexible</span>, and <span className="font-semibold text-gray-800">engaging</span> education.
        </p>

        {/* Who We Are */}
        <div className="flex flex-col md:flex-row items-center gap-10 mb-20">
          <img
            src="https://img.freepik.com/free-vector/online-tutorials-concept_52683-37480.jpg?t=st=1744133635~exp=1744137235~hmac=08e2aa07e14ed02dba88b936080c740d82df2eb251c0d3547ada6be3dc85200b&w=1380"
            alt="Teamwork"
            className="w-full md:w-1/2 rounded-xl shadow-md"
          />
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Who We Are</h2>
            <p className="text-gray-700">
              <span className="font-semibold text-gray-800">quickConnect</span> is a dynamic team of educators,
              developers, and designers committed to transforming learning. Whether you're a student or a lifelong learner,
              we bring <span className="font-semibold">high-quality education</span> directly to your screen.
            </p>
          </div>
        </div>

        {/* Our Mission */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-10 mb-20">
          <img
            src="https://img.freepik.com/premium-photo/concept-mission-with-network-business-symbols_220873-12779.jpg?w=1380"
            alt="Mission"
            className="w-full md:w-1/2 rounded-xl shadow-md"
          />
          <div className="md:w-1/2">
            <div className="flex items-center gap-3 text-gray-800 mb-2">
              <Target className="w-6 h-6" />
              <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
            </div>
            <p className="text-gray-700">
              To make <span className="font-semibold">quality education accessible</span> to everyone, anywhere.
              Our mission is to provide engaging and personalized learning experiences backed by technology.
            </p>
          </div>
        </div>

        {/* Our Vision */}
        <div className="flex flex-col md:flex-row items-center gap-10 mb-20">
          <img
            src="https://img.freepik.com/free-vector/gradient-our-mission-concept-illustrated_23-2149081668.jpg?t=st=1744133415~exp=1744137015~hmac=7fee92d508cad774e6f334cee77c3331cc702eba9a916c9ccd80f8c03676a78e&w=1380"
            alt="Vision"
            className="w-full md:w-1/2 rounded-xl shadow-md"
          />
          <div className="md:w-1/2">
            <div className="flex items-center gap-3 text-gray-800 mb-2">
              <Eye className="w-6 h-6" />
              <h2 className="text-3xl font-bold text-gray-800">Our Vision</h2>
            </div>
            <p className="text-gray-700">
              A world where <span className="font-semibold text-gray-800">education knows no boundaries</span>.
              We’re driven to empower learners globally with affordable, inclusive, and industry-relevant skills.
            </p>
          </div>
        </div>

        {/* What Makes Us Different */}
        <div className="bg-white p-10 rounded-2xl shadow-xl mb-20">
          <div className="flex items-center gap-3 text-gray-800 mb-4">
            <Star className="w-6 h-6" />
            <h2 className="text-3xl font-bold text-gray-800">What Makes Us Different</h2>
          </div>
          <ul className="list-disc list-inside text-gray-700 space-y-3 text-lg pl-2">
            <li className="hover:text-gray-800 hover:font-bold transition-all duration-200">🎥 Interactive live classes with expert mentors</li>
            <li className="hover:text-gray-800 hover:font-bold transition-all duration-200">💬 Real-time engagement via chat & video</li>
            <li className="hover:text-gray-800 hover:font-bold transition-all duration-200">📚 Lifetime access to all your purchased courses</li>
            <li className="hover:text-gray-800 hover:font-bold transition-all duration-200">🧪 Hands-on projects & real-world scenarios</li>
            <li className="hover:text-gray-800 hover:font-bold transition-all duration-200">📞 Fast, friendly support & tech help</li>
            <li className="hover:text-gray-800 hover:font-bold transition-all duration-200">📱 Fully responsive for mobile learning</li>
          </ul>
        </div>

        {/* Thank You */}
        <div className="text-center mt-10">
          <div className="flex justify-center mb-4 text-gray-800">
            <Users className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Thank You!</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Thank you for choosing <span className="font-semibold text-gray-800">quickConnect</span>.
            We are honored to support your learning journey and committed to helping you reach your full potential.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Aboutus;
