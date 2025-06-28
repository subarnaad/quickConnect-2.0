import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import MeetingAction from "@/components/liveclass/MeetingAction";
import MeetingFeature from "@/components/liveclass/MeetingFeature";

function LiveClassPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to="/instructor" className="flex items-center justify-center">
          <GraduationCap className="h-8 w-8 mr-4" />
          <span className="font-extrabold text-xl">quickConnect</span>
        </Link>
      </header>

      <main className="flex-grow p-8 pt-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                Video calls and meetings for everyone
              </h1>
              <p className="text-3xl text-gray-600 dark:text-gray-300 mb-12">
                Learn from anywhere with live video class in quickConnect
              </p>
              <MeetingAction />
            </div>
            <div className="md:w-1/2">
              <MeetingFeature />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LiveClassPage;
