import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </header>
    </div>
  );
}

export default AdminDashboard;
