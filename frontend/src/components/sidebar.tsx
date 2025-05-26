import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  SearchOutlined,
  MailOutlined,
  CalendarOutlined,
  ContactsOutlined,
  FileTextOutlined,
  FolderOutlined,
  StarOutlined,
  DeleteOutlined,
  SettingOutlined,
  UpCircleOutlined,
} from "@ant-design/icons";

const Sidebar = () => {
  const location = useLocation();
  const activeTab = location.pathname.split("/")[1] || "home";

  // Sidebar items data
  const sidebarItems = [
    { key: "dashboard", icon: <HomeOutlined />, label: "Home" },
    { key: "mail", icon: <MailOutlined />, label: "Mail" },
    { key: "calendar", icon: <CalendarOutlined />, label: "Calendar" },
    { key: "starred", icon: <StarOutlined />, label: "Starred" },
  ];

  const bottomItems = [
    { key: "settings", icon: <SettingOutlined />, label: "Settings" },
    { key: "help", icon: <UpCircleOutlined />, label: "Help" },
  ];

  return (
    <div className="w-54 flex flex-col border-r border-gray-200 bg-white">


      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        {sidebarItems.map((item) => (
          <Link
            to={`/${item.key}`}
            key={item.key}
            className={`flex items-center px-4 py-3 rounded-lg mx-2 transition-colors ${
              activeTab === item.key
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="text-sm mr-4">{item.icon}</span>
            <span>{item.label}</span>
            {activeTab === item.key && (
              <div className="ml-auto h-1 w-1 bg-blue-500 rounded-full"></div>
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="px-2 pb-6">
        {bottomItems.map((item) => (
          <Link
            to={`/${item.key}`}
            key={item.key}
            className={`flex items-center px-4 py-3 rounded-lg mx-2 transition-colors ${
              activeTab === item.key
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="text-sm mr-4">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;