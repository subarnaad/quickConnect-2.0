import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { courseCategories } from "@/config";
import { StudentContext } from "@/context/student-contex";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService();
    console.log(response, "courselist_in_student");
    if (response?.success) setStudentViewCoursesList(response?.data);
  }

  // Function to handle navigation to the courses page with filters
  function handleNavigateToCoursesPage(getCurrentId) {
    console.log(getCurrentId);
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    navigate("/courses");
  }

  // Function to handle navigation to the courses page
  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );

    if (response?.success) {
      if (response?.data) {
        navigate(`/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/course/details/${getCurrentCourseId}`);
      }
    }
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8">
        <div className="lg:w-1/2 lg:pr-12">
          <h1 className="text-4xl font-bold mb-4">Learning that gets you</h1>
          <p className="text-xl">
            Skills for your present and your future. Get started with us.
          </p>
        </div>
        <div className="lg:w-full mb-8 lg:mb-0">
          <img
            src="/bannerimg.jpg"
            alt="Banner"
            className="w-full h-auto rounded-lg shadow-lg object-cover"
          />
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-8 px-4 lg:px-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {courseCategories.map((categoryItem) => (
            <Button
              className="justify-start"
              variant="outline"
              key={categoryItem.id}
              onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
            >
              {categoryItem.label}
            </Button>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-12 px-4 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Courses</h2>
          <Button
            className="px-4 py-2 text-sm font-semibold bg-black text-white hover:bg-white hover:text-black transition-colors duration-200"
            variant="outline"
            onClick={() => navigate("/courses")}
          >
            View More
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            studentViewCoursesList
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 4)
              .map((courseItem) => (
                <div
                  onClick={() => handleCourseNavigate(courseItem?._id)}
                  className="border rounded-lg overflow-hidden shadow cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow-xl hover:border-blue-500"
                  key={courseItem.id}
                >
                  <img
                    src={courseItem?.image}
                    alt={courseItem.title}
                    className="w-full h-40 object-contain p-2 bg-white"
                  />
                  <div className="p-4">
                    <h3 className="font-bold mb-2">{courseItem?.title}</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      {courseItem?.instructorName}
                    </p>
                    <p className="font-bold text-[16px]">
                      ${courseItem?.pricing}
                    </p>
                  </div>
                </div>
              ))
          ) : (
            <h1>No Courses Found</h1>
          )}
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;
