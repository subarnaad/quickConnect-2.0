import { Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ menuItems, isOpen, toggleSidebar }) => {
  const [activelink, setActiveLink] = useState("admin");
  const location = useLocation();

  return (
    <aside
      className={`${
        isOpen ? "block" : "hidden"
      } md:block w-64 bg-white shadow-md fixed md:relative z-50`}
    >
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
        <nav>
          {menuItems.map((menuItem) => (
            <Button
              className={`w-full justify-start mb-2 border-l-4 ${
                activelink === menuItem.value
                  ? "border-gray-400 font-bold"
                  : "border-transparent"
              } hover:border-gray-400 hover:font-bold`}
              key={menuItem.value}
              variant="ghost"
              onClick={() => {
                setActiveLink(menuItem.value);
                menuItem.onClick();
                toggleSidebar(false); // Close sidebar on mobile after clicking
              }}
            >
              {menuItem.label}
            </Button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

function AdminLayout() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { resetCredentials } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
    navigate("/auth");
  }

  const menuItems = [
    {
      label: "Dashboard",
      value: "admin",
      onClick: () => navigate("/admin/"),
    },
    {
      label: "Courses",
      value: "courses",
      onClick: () => navigate("/admin/courses"),
    },
    {
      label: "Users",
      value: "users",
      onClick: () => navigate("/admin/users"),
    },
    {
      label: "Feedbacks",
      value: "feedbacks",
      onClick: () => navigate("/admin/feedbacks"),
    },
    {
      label: "Logout",
      value: "logout",
      onClick: handleLogout,
    },
  ];

  return (
    <div className="flex h-full min-h-screen bg-gray-100">
      {/* Hamburger Menu */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2"
        >
          <span className="sr-only">Toggle Sidebar</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </Button>
      </div>

      {/* Sidebar */}
      <Sidebar
        menuItems={menuItems}
        isOpen={isSidebarOpen}
        toggleSidebar={setIsSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <header className="absolute top-4 right-4">
            <span className="text-lg font-medium text-gray-700">
              Welcome, {auth.user.userName}!
            </span>
          </header>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
