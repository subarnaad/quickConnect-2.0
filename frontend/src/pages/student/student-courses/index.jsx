import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-contex";
import {
  fetchStudentBoughtCoursesService,
  getCurrentCourseProgressService,
} from "@/services";
import { Watch } from "lucide-react";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function StudentCoursesPage() {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext);
  const navigate = useNavigate();

  async function fetchStudentBoughtCourses() {
    const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
    if (response?.success) {
      setStudentBoughtCoursesList(response?.data);
    }
    console.log(response);
    // Call getCurrentCourseProgressService for each course and log response
    // if (response?.success && response?.data && Array.isArray(response.data)) {
    //   for (const course of response.data) {
    //     const progressResp = await getCurrentCourseProgressService(
    //       auth?.user?._id,
    //       course._id
    //     );
    //     console.log(progressResp, "resp");
    //   }
    // }
  }

  async function handleStartWatching(courseId) {
    // const response = await getCurrentCourseProgressService(
    //   auth?.user?._id,
    //   courseId
    // );
    // console.log(response, "resp");
    navigate(`/course-progress/${courseId}`);
  }

  useEffect(() => {
    fetchStudentBoughtCourses();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
          studentBoughtCoursesList.map((course) => (
            <Card
              key={course.id}
              className="border rounded-lg overflow-hidden shadow cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow-xl hover:border-blue-500 flex flex-col"
            >
              <CardContent className="p-4 flex-grow">
                <img
                  src={course?.image}
                  alt={course?.title}
                  className="w-full aspect-video object-contain rounded-md mb-4"
                />
                <h3 className="font-bold mb-1 flex items-center">
                  {course?.title}
                  <span
                    className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold
                    ${
                      course?.progress?.completed
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {course?.progress?.completed ? "Completed" : "Running"}
                  </span>
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  {course?.instructorName}
                </p>
              </CardContent>
              <CardFooter className="justify-between">
                <Button onClick={() => handleStartWatching(course?._id)}>
                  <Watch className="mr-2 h-4 w-4" />
                  Start Watching
                </Button>
                {/*join live class */}
                <Button
                  onClick={() => navigate(`${course?.courseLink}`)}
                  disabled={!course.isClassActive}
                >
                  <Watch className="mr-2 h-4 w-4" />
                  Join Class
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <h1 className="text-3xl font-bold">No Courses found</h1>
        )}
      </div>
    </div>
  );
}

export default StudentCoursesPage;
