import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchTasks } from '../api/task/task';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import dayjs from 'dayjs';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import {
  WarningOutlined,
  InfoCircleOutlined,
  FlagOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UnorderedListOutlined,
  ThunderboltOutlined,
  ExclamationOutlined
} from '@ant-design/icons';
import { Skeleton } from 'antd';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  assignedToName: string;
  recurring: boolean;
  category: string;
  dueDate: string;
}


const TaskList = () => {
  const { teamId } = useParams();
  // const [tasksToShow, setTasksToShow] = useState([]);
  const [tasksToShow, setTasksToShow] = useState<{
    today: Task[];
    upcoming: Task[];
  }>({
    today: [],
    upcoming: []
  });

  const [activePriority, setActivePriority] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [bannerText, setBannerText] = useState('');

  const { data: todayTasks = [], isLoading: loadingToday } = useQuery({
    queryKey: ['tasks', teamId, 'today'],
    // queryFn: () => fetchTasks({ filterType: 'today', teamId }),
    queryFn: () => fetchTasks({ filterType: 'today', userId: null, teamId }),
    enabled: !!teamId,
    refetchInterval: 5000,
  });

  const { data: upcomingTasks = [], isLoading: loadingUpcoming } = useQuery({
    queryKey: ['tasks', teamId, 'upcoming'],
    queryFn: () => fetchTasks({ filterType: 'upcoming', userId: null, teamId }),
    enabled: !!teamId,
    refetchInterval: 5000,
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter tasks based on selected filters
  useEffect(() => {
    let filteredToday = [...todayTasks];
    let filteredUpcoming = [...upcomingTasks];

    if (activePriority !== 'all') {
      filteredToday = filteredToday.filter(task => task.priority === activePriority);
      filteredUpcoming = filteredUpcoming.filter(task => task.priority === activePriority);
    }

    setTasksToShow({
      today: filteredToday,
      upcoming: filteredUpcoming
    });
  }, [todayTasks, upcomingTasks, activePriority]);

  useEffect(() => {
    const urgentTasks = todayTasks.filter(task => task.priority === 'HIGH');
    const mediumTasks = todayTasks.filter(task => task.priority === 'MEDIUM');
    const lowTasks = todayTasks.filter(task => task.priority === 'LOW');

    const todaysTotal = todayTasks.length;
    const upcomingTotal = upcomingTasks.length;
    const totalTasks = todaysTotal + upcomingTotal;

    const names = [...new Set(urgentTasks.map(task => task.assignedToName))].join(', ');

    let banner = '';

    if (urgentTasks.length > 0) {
      banner += `🚨 ${urgentTasks.length} HIGH priority task${urgentTasks.length > 1 ? 's' : ''}`;
      if (names) banner += ` assigned to ${names}`;
      banner += `. `;
    }

    banner += `📅 Today: ${todaysTotal} task${todaysTotal !== 1 ? 's' : ''} `
      + `(🟠 Medium: ${mediumTasks.length}, 🟢 Low: ${lowTasks.length} , 🔴 High: ${urgentTasks.length} )`;
    banner += `. 🔜 Upcoming: ${upcomingTotal} task${upcomingTotal !== 1 ? 's' : ''}.`;

    banner += ` 💡 Stay focused and tackle the urgent ones first!`;

    setBannerText(banner);
  }, [todayTasks, upcomingTasks]);


  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'priority-high';
      case 'MEDIUM':
        return 'priority-medium';
      case 'LOW':
        return 'priority-low';
      default:
        return 'bg-gray-100';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'HIGH':
        return <WarningOutlined className="text-red-500 text-2xl" />;
      case 'MEDIUM':
        return <InfoCircleOutlined className="text-yellow-500 text-2xl" />;
      case 'LOW':
        return <ExclamationOutlined className="text-green-500 text-2xl" />;
      default:
        return <FlagOutlined className="text-gray-500 text-2xl" />;
    }
  };

  if (loadingToday || loadingUpcoming) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <Skeleton active />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen p-4 md:px-10">
      <div className="max-w-9xl mx-auto">
        {/* Header with Time */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center ">
          <div className="mb-6 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-600">Task Dashboard</h1>
            {/* <p className="text-gray-600">
              {activePriority !== 'all' ? `${activePriority} priority tasks` : 'All priority tasks'}
            </p> */}
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-mono text-gray-800">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-gray-600 text-sm">
                {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
              <ClockCircleOutlined className="text-blue-600 text-2xl" />
            </div>
          </div>
        </div>

        {/* {/* Filter Controls */}
        <div className="flex flex-wrap gap-2 mb-8 hidden md:flex xl:hidden">
          <button
            onClick={() => setActivePriority('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${activePriority === 'all' ? 'bg-gray-200 text-gray-800' : 'bg-white text-gray-700 border border-gray-300'
              }`}
          >
            All
          </button>
          <button
            onClick={() => setActivePriority('HIGH')}
            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${activePriority === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-white text-gray-700 border border-gray-300'
              }`}
          >
            <WarningOutlined className="mr-2" />
            High
          </button>
          <button
            onClick={() => setActivePriority('MEDIUM')}
            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${activePriority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-white text-gray-700 border border-gray-300'
              }`}
          >
            <InfoCircleOutlined className="mr-2" />
            Medium
          </button>
          <button
            onClick={() => setActivePriority('LOW')}
            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${activePriority === 'LOW' ? 'bg-green-100 text-green-800' : 'bg-white text-gray-700 border border-gray-300'
              }`}
          >
            <ExclamationOutlined className="mr-2" />
            Low
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 flex items-center border border-gray-200 shadow-sm">
            <div className="bg-red-100 p-3 rounded-full mr-4 text-red-500">
              <WarningOutlined className="text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">High Priority</p>
              <p className="text-2xl font-bold text-gray-800">
                {tasksToShow.today.filter(t => t.priority === 'HIGH').length +
                  tasksToShow.upcoming.filter(t => t.priority === 'HIGH').length}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 flex items-center border border-gray-200 shadow-sm">
            <div className="bg-yellow-100 p-3 rounded-full mr-4 text-yellow-500">
              <InfoCircleOutlined className="text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Medium Priority</p>
              <p className="text-2xl font-bold text-gray-800">
                {tasksToShow.today.filter(t => t.priority === 'MEDIUM').length +
                  tasksToShow.upcoming.filter(t => t.priority === 'MEDIUM').length}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 flex items-center border border-gray-200 shadow-sm">
            <div className="bg-green-100 p-3 rounded-full mr-4 text-green-500">
              <ExclamationOutlined className="text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Low Priority</p>
              <p className="text-2xl font-bold text-gray-800">
                {tasksToShow.today.filter(t => t.priority === 'LOW').length +
                  tasksToShow.upcoming.filter(t => t.priority === 'LOW').length}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 flex items-center border border-gray-200 shadow-sm">
            <div className="bg-blue-100 p-3 rounded-full mr-4 text-blue-500">
              <UnorderedListOutlined className="text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-800">
                {tasksToShow.today.length + tasksToShow.upcoming.length}
              </p>
            </div>
          </div>
        </div>

        {/* Today's Tasks Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <CalendarOutlined className="mr-2 text-blue-500" />
              Today's Tasks ({tasksToShow.today.length})
            </h2>
          </div>

          {tasksToShow.today.length === 0 ? (
            <div className="bg-white p-10 rounded-xl text-center text-2xl text-gray-500 border border-gray-200 shadow-sm">
              No tasks for today.
            </div>
          ) : (
            <div className="relative">
              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={3}
                pagination={{
                  clickable: true,
                  el: '.today-pagination',
                  bulletClass: 'task-bullet',
                  bulletActiveClass: 'task-bullet-active'
                }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop={true}
                className="rounded-xl overflow-hidden"
              >
                {tasksToShow.today.map((task) => (
                  <SwiperSlide key={task.id}>
                    <div className={`task-card ${getPriorityClass(task.priority)} rounded-lg p-6 shadow-md h-80 flex flex-col border border-gray-200`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                            task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                            {task.priority.toUpperCase()}
                          </span>
                          <br />
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                            task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                            Assigned To: {task.assignedToName}
                          </span>
                          <h3 className="text-3xl md:text-4xl font-bold mt-3 text-gray-800">
                            {task.recurring ? `Reminder: ${task.title}` : task.title}
                          </h3>
                        </div>

                        {getPriorityIcon(task.priority)}
                      </div>
                      <p className="text-lg md:text-xl text-gray-600 mb-6 flex-grow">{task.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <ClockCircleOutlined />
                          <span className="text-xl font-bold text-gray-900 ml-2">
                            {task.dueDate
                              ? `Due: ${dayjs(task.dueDate).format('DD MMM YYYY, h:mm A')}`
                              : 'No Due Time'}
                          </span>
                        </div>
                        {task.category && (
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded border border-gray-200">
                            {task.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="today-pagination flex justify-center space-x-2 mt-6"></div>
            </div>
          )}
        </div>

        {/* Upcoming Tasks Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <ClockCircleOutlined className="mr-2 text-blue-500" />
              Upcoming Tasks ({tasksToShow.upcoming.length})
            </h2>
          </div>

          {tasksToShow.upcoming.length === 0 ? (
            <div className="bg-white p-10 rounded-xl text-center text-2xl text-gray-500 border border-gray-200 shadow-sm">
              No upcoming tasks.
            </div>
          ) : (
            <div className="relative">
              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={3} // Fewer slides for upcoming tasks
                pagination={{
                  clickable: true,
                  el: '.upcoming-pagination',
                  bulletClass: 'task-bullet',
                  bulletActiveClass: 'task-bullet-active'
                }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop={true}
                className="rounded-xl overflow-hidden"
              >
                {tasksToShow.upcoming.map((task) => (
                  <SwiperSlide key={task.id}>
                    <div className={`task-card ${getPriorityClass(task.priority)} rounded-lg p-6 shadow-md h-70 flex flex-col border border-gray-200`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                            task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                            {task.priority.toUpperCase()}
                          </span>
                          <br />
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                            task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                            Assigned To: {task.assignedToName}
                          </span>
                          <h3 className="text-3xl md:text-4xl font-bold mt-3 text-gray-800">
                            {task.recurring ? `Reminder: ${task.title}` : task.title}
                          </h3>
                        </div>
                        {getPriorityIcon(task.priority)}
                      </div>
                      <p className="text-lg md:text-xl text-gray-600 mb-6 flex-grow">{task.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <CalendarOutlined />
                          <span className="text-xl font-bold text-gray-900 ml-2">
                            {task.dueDate
                              ? `Due: ${dayjs(task.dueDate).format('DD MMM YYYY, h:mm A')}`
                              : 'No Due Time'}
                          </span>
                        </div>
                        {task.category && (
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded border border-gray-200">
                            {task.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="upcoming-pagination flex justify-center space-x-2 mt-6"></div>
            </div>
          )}
        </div>

        {/* Running Banner */}
        <div className="fixed bottom-0 left-0 w-full bg-blue-600 text-white p-3 overflow-hidden z-50">
          <div className="animate-marquee whitespace-nowrap">
            <span className="text-lg font-medium mr-8">{bannerText}</span>
            <span className="text-lg font-medium mr-8">{bannerText}</span>
            <span className="text-lg font-medium">{bannerText}</span>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .priority-high {
          border-left: 6px solid #dc2626;
          background: linear-gradient(90deg, rgba(220, 38, 38, 0.08) 0%, rgba(220, 38, 38, 0.04) 100%);
        }
        
        .priority-medium {
          border-left: 6px solid #d97706;
          background: linear-gradient(90deg, rgba(217, 119, 6, 0.08) 0%, rgba(217, 119, 6, 0.04) 100%);
        }
        
        .priority-low {
          border-left: 6px solid #059669;
          background: linear-gradient(90deg, rgba(5, 150, 105, 0.08) 0%, rgba(5, 150, 105, 0.04) 100%);
        }
        
        .task-card {
          transition: all 0.3s ease;
        }
        .task-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .task-bullet {
          width: 12px;
          height: 12px;
          background-color: #d1d5db;
          border-radius: 50%;
          margin: 0 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .task-bullet-active {
          background-color: #3B82F6;
          width: 24px;
          border-radius: 6px;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TaskList;