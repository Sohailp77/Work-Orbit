import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  SearchOutlined,
  ApiOutlined,
  NotificationOutlined,
  UpCircleOutlined,
  SettingOutlined,
  PoundCircleOutlined,
  ToTopOutlined,
} from "@ant-design/icons";
import { Dropdown, Menu, Avatar, Badge } from "antd";
import InvitationsModal from "./modal/teams/invitationModal";
import { getUserIdFromToken } from "../api/auth";

const Navbar = () => {
  const userId = getUserIdFromToken(); // Make sure this function is working properly
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    console.log("User logged out");
    navigate("/login");
  };

  const userMenu = (
    <Menu className="shadow-lg rounded-lg w-48">
      <Menu.Item
        key="profile"
        className="flex items-center px-4 py-2 hover:bg-gray-100"
        onClick={() => navigate("/profile")}
      >
        <PoundCircleOutlined className="mr-3" />
        <span>My Profile</span>
      </Menu.Item>
      <Menu.Item
        key="settings"
        className="flex items-center px-4 py-2 hover:bg-gray-100"
        onClick={() => navigate("/settings")}
      >
        <SettingOutlined className="mr-3" />
        <span>Settings</span>
      </Menu.Item>
      <Menu.Divider className="my-1" />
      <Menu.Item
        key="logout"
        className="flex items-center px-4 py-2 text-red-500 hover:bg-gray-100"
        onClick={handleLogout}
      >
        <ToTopOutlined className="mr-3" />
        <span>Logout</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left Section - Logo */}
        <div className="flex items-center flex-1 max-w-2xl">
          <div className="relative w-full">
            <div className="p-5 pb-5">
              <div className="text-xl font-medium text-gray-800 flex items-center">
                <span className="text-blue-500 mr-2">W</span>
                <span className="text-red-500 mr-2">O</span>
                <span className="text-yellow-500 mr-2">R</span>
                <span className="text-blue-500 mr-2">K</span>
                <span className="text-gray-500 mr-2">-</span>
                <span className="text-blue-500 mr-2">O</span>
                <span className="text-red-500 mr-2">R</span>
                <span className="text-yellow-500 mr-2">B</span>
                <span className="text-blue-500 mr-2">I</span>
                <span className="text-red-500 mr-2">T</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Icons and User Menu */}
        <div className="flex items-center space-x-4">


          {/* Notification Button */}
          <button onClick={showModal} className="p-2 text-gray-600 rounded-full hover:bg-gray-100">
            <Badge dot>
              <NotificationOutlined className="text-xl" />
            </Badge>
          </button>

          {/* Invitations Modal */}
          <InvitationsModal
            isVisible={isModalVisible}
            onClose={handleModalClose}
            userId={userId}
          />



          {/* User Menu */}
          <Dropdown
            overlay={userMenu}
            trigger={["click"]}
            visible={userMenuVisible}
            onVisibleChange={(visible) => setUserMenuVisible(visible)}
          >
            <button className="flex items-center space-x p-1 rounded-full hover:bg-gray-100">
              <Avatar
                size={42}
                src="https://as1.ftcdn.net/v2/jpg/07/24/59/76/1000_F_724597608_pmo5BsVumFcFyHJKlASG2Y2KpkkfiYUU.jpg"
                className="border border-gray-300"
              />
            </button>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
