import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth/index.jsx";
import RouteGuard from "./components/route-guard";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context";
import InstructorDashboardpage from "./pages/instructor";
import StudentViewCommonLayout from "./components/student-view/common-layout.jsx";
import StudentHomePage from "./pages/student/home";
import NotFoundPage from "./pages/not-found/index.jsx";
import AddNewCoursePage from "./pages/instructor/add-new-course.jsx";
import StudentViewCoursesPage from "./pages/student/courses/index.jsx";
import LiveClassPage from "./pages/instructor/liveclass.jsx";
import StudentViewCourseDetailsPage from "./pages/student/course-details/index.jsx";
import { VideoMeeting } from "./video-meeting/roomId/MeetingPage.jsx";
import PaypalPaymentReturnPage from "./pages/student/payment-return/index.jsx";
import StudentCoursesPage from "./pages/student/student-courses/index.jsx";
import StudentViewCourseProgressPage from "./pages/student/course-progress/index.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Contact from "./pages/student/footer-page/Contact.jsx";
import Aboutus from "./pages/student/footer-page/About-us.jsx";
import AdminDashboard from "./pages/admin/dashboard.jsx";
import AdminCourses from "./pages/admin/adminCourses.jsx";
import Adminuser from "./pages/admin/adminUser.jsx";
import AdminLayout from "./components/admin-layout/Adminlayout.jsx";
import CurriculumList from "./pages/admin/CurriculumList.jsx";
import Feedbacks from "./pages/admin/Feedbacks.jsx";

function App() {
  const { auth } = useContext(AuthContext);

  return (
    <>
      <Routes>
        <Route
          path="/auth"
          element={
            <RouteGuard
              element={<AuthPage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor"
          element={
            <RouteGuard
              element={<InstructorDashboardpage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor/create-new-course"
          element={
            <RouteGuard
              element={<AddNewCoursePage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor/start-live-class"
          element={
            <RouteGuard
              element={<LiveClassPage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor/edit-course/:courseId"
          element={
            <RouteGuard
              element={<AddNewCoursePage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
        {/* <Route
        path="/class/start-live-class/video-meeting/:roomId"
        element={
          <RouteGuard
            element={<VideoMeeting />}
            authenticated={auth?.authenticate}
            user={auth?.user} 
          />
        }
      /> */}
        <Route
          path="/"
          element={
            <RouteGuard
              element={<StudentViewCommonLayout />}
              authenticated={auth.authenticate}
              user={auth.user}
            />
          }
        >
          <Route path="" element={<StudentHomePage />} />
          <Route path="home" element={<StudentHomePage />} />
          <Route path="courses" element={<StudentViewCoursesPage />} />
          <Route
            path="course/details/:id"
            element={<StudentViewCourseDetailsPage />}
          />
          <Route path="payment-return" element={<PaypalPaymentReturnPage />} />
          <Route path="student-courses" element={<StudentCoursesPage />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<Aboutus />} />
          <Route
            path="course-progress/:id"
            element={<StudentViewCourseProgressPage />}
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
        {auth.authenticate && (
          <Route
            path="/class/start-live-class/video-meeting/:roomId/:courseId"
            element={<VideoMeeting />}
          />
        )}

        <Route
          path="/admin/*"
          element={
            <RouteGuard
              element={<AdminLayout />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="users" element={<Adminuser />} />
          <Route path="courses/curriculum/:id" element={<CurriculumList />} />
          <Route path="feedbacks" element={<Feedbacks />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
