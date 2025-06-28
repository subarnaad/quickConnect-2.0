import { editCourseService, fetchAllCoursesService } from "@/services";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminCourses() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [courseData, setCourseData] = useState([]);
  const [courseId, setCourseId] = useState("6795c7e78d48c901eaeee07d"); // Example course ID
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetchAllCoursesService({ page, limit });
        // const editCourseResponse = await editCourseService({
        //   courseId,
        //   status: true,
        // });
        let courses = response?.data?.courses;
        // Sort courses by createdAt descending (latest first)
        if (Array.isArray(courses)) {
          courses = courses.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        }
        setCourseData(Array.isArray(courses) ? courses : []);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourseData([]);
      }
    };
    fetchCourses();
  }, [page, limit, courseId]);

  console.log("Course Data:", courseData);

  return (
    <div className="admin-courses p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Admin Courses
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                SN
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Course Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Instructor
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Level
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                Revenue
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {courseData.map((course, index) => (
              <tr key={course._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-center text-sm text-gray-600">
                  {(page - 1) * limit + index + 1}
                </td>
                <td
                  className="px-6 py-4 text-sm text-gray-700 font-medium"
                  onClick={() => {
                    setCourseId(course._id);
                    navigate(`/admin/courses/curriculum/${course._id}`);
                  }}
                >
                  {course.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {course.instructorName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                  {course.level}
                </td>
                <td className="px-6 py-4 text-sm text-right text-gray-700 font-semibold">
                  $
                  {course.students
                    .reduce(
                      (total, student) =>
                        total + parseFloat(student.paidAmount || 0),
                      0
                    )
                    .toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-gray-700">Page {page}</span>
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={courseData.length < limit}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AdminCourses;
