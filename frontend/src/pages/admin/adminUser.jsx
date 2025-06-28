import { fetchAllUsersService } from "@/services";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function Adminuser() {
  const [userData, setUserData] = useState([]);
  const [role, setRole] = useState("instructor");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetchAllUsersService({ role });
        setUserData(response?.data?.users || []); // Extract users array from response
      } catch (error) {
        console.error("Error fetching users:", error);
        setUserData([]); // Fallback to an empty array on error
      }
    };
    fetchUsers();
  }, [role]);

  return (
    <Tabs defaultValue={role} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger
          onClick={() => setRole("instructor")}
          value="instructor"
          className="text-sm md:text-base"
        >
          Instructor
        </TabsTrigger>
        <TabsTrigger
          onClick={() => setRole("user")}
          value="user"
          className="text-sm md:text-base"
        >
          User
        </TabsTrigger>
      </TabsList>

      {/* Instructor Tab */}
      <TabsContent value="instructor">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Instructors</CardTitle>
            <CardDescription className="text-sm md:text-base">
              List of all instructors.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-2 md:px-4 py-2">
                      SN
                    </th>
                    <th className="border border-gray-300 px-2 md:px-4 py-2">
                      Name
                    </th>
                    <th className="border border-gray-300 px-2 md:px-4 py-2">
                      Email
                    </th>
                    <th className="border border-gray-300 px-2 md:px-4 py-2">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userData.length > 0 ? (
                    userData.map((user, index) => (
                      <tr key={user._id}>
                        <td className="border border-gray-300 px-2 md:px-4 py-2">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 px-2 md:px-4 py-2">
                          {user.userName}
                        </td>
                        <td className="border border-gray-300 px-2 md:px-4 py-2">
                          {user.userEmail}
                        </td>
                        <td className="border border-gray-300 px-2 md:px-4 py-2">
                          {user.role}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="border border-gray-300 px-2 md:px-4 py-2 text-center"
                      >
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* User Tab */}
      <TabsContent value="user">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Users</CardTitle>
            <CardDescription className="text-sm md:text-base">
              List of all users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-2 md:px-4 py-2">
                      SN
                    </th>
                    <th className="border border-gray-300 px-2 md:px-4 py-2">
                      Name
                    </th>
                    <th className="border border-gray-300 px-2 md:px-4 py-2">
                      Email
                    </th>
                    <th className="border border-gray-300 px-2 md:px-4 py-2">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userData.length > 0 ? (
                    userData.map((user, index) => (
                      <tr key={user._id}>
                        <td className="border border-gray-300 px-2 md:px-4 py-2">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 px-2 md:px-4 py-2">
                          {user.userName}
                        </td>
                        <td className="border border-gray-300 px-2 md:px-4 py-2">
                          {user.userEmail}
                        </td>
                        <td className="border border-gray-300 px-2 md:px-4 py-2">
                          {user.role}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="border border-gray-300 px-2 md:px-4 py-2 text-center"
                      >
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default Adminuser;
