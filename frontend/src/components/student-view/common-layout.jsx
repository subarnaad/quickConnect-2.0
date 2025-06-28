import { Outlet, useLocation } from "react-router-dom";
import StudentViewCommonHeader from "./header";
import Footer from "./footer";

function StudentViewCommonLayout() {
  const location = useLocation();
  const hideHeaderAndFooter = location.pathname.includes("course-progress");

  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeaderAndFooter && <StudentViewCommonHeader />}

      <main className="flex-grow">
        <Outlet />
      </main>

      {!hideHeaderAndFooter && <Footer />}
    </div>
  );
}

export default StudentViewCommonLayout;
