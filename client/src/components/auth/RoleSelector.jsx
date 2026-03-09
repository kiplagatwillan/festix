import React from "react";
import { User, Briefcase } from "lucide-react";

const RoleSelector = ({ selectedRole, setRole }) => {
  const roles = [
    {
      id: "USER",
      title: "Attendee",
      description: "I want to find and attend amazing events.",
      icon: <User className="w-6 h-6" />,
    },
    {
      id: "ORGANIZER",
      title: "Organizer",
      description: "I want to create and manage my own events.",
      icon: <Briefcase className="w-6 h-6" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {roles.map((role) => (
        <div
          key={role.id}
          onClick={() => setRole(role.id)}
          className={`cursor-pointer p-4 border-2 rounded-xl transition-all duration-200 ${
            selectedRole === role.id
              ? "border-indigo-600 bg-indigo-50 shadow-md"
              : "border-gray-200 hover:border-gray-300 bg-white"
          }`}
        >
          <div
            className={`mb-2 ${selectedRole === role.id ? "text-indigo-600" : "text-gray-500"}`}
          >
            {role.icon}
          </div>
          <h3 className="font-bold text-gray-900">{role.title}</h3>
          <p className="text-sm text-gray-500">{role.description}</p>
        </div>
      ))}
    </div>
  );
};

export default RoleSelector;
