import React, { useState, useEffect } from 'react';
import TaskForm from './Component/TaskForm';
import { fetchTasks, createTask, deleteTask } from './utils/api'; // Adjust path as necessary
import { MdDeleteOutline } from "react-icons/md";
import './App.css';
const App = () => {
  const [tasks, setTasks] = useState([]);
  const [isFormVisible, setFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All'); // Default filter is 'All'
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [expiredTasksCount, setExpiredTasksCount] = useState(0);
  const [activeTasksCount, setActiveTasksCount] = useState(0);

  const handleAddTask = async (newTask) => {
    try {
      const response = await createTask(newTask);
      setTasks([...tasks, response.data]); // Add the new task from the backend response to the tasks array
      setFormVisible(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    // Filter and count completed tasks
    const completedTasks = tasks.filter(task => task.status === 'Done');
    setCompletedTasksCount(completedTasks.length);

    // Filter and count expired tasks (deadline < today's date)
    const expiredTasks = tasks.filter(task => task.deadline < today);
    setExpiredTasksCount(expiredTasks.length);

    // Filter and count active tasks (status 'ToDo' or 'InProgress')
    const activeTasks = tasks.filter(task => task.status === 'ToDo' || task.status === 'InProgress');
    setActiveTasksCount(activeTasks.length);
  }, [tasks]); // Run effect whenever tasks array changes

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredTasks = tasks.filter((task) => {
    // Search filter
    if (
      (searchTerm && !task.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase()))
    ) {
      return false;
    }

    // Preference filter
    if (filter !== 'All' && task.preference !== filter) {
      return false;
    }

    return true;
  });

  const statusCounts = tasks.reduce((counts, task) => {
    counts[task.status] = (counts[task.status] || 0) + 1;
    return counts;
  }, {});

  const handleDelete = async (keyid) => {
    try {
      const deleted = await deleteTask(keyid); // Wait for deletion to complete
      fetchData();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  const fetchData = async () => {
    try {
      const response = await fetchTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []); // Run only once on component mount

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between bg-gray-200 mb-4 p-2 shadow-xl rounded-2xl">
        <input
          type="text"
          placeholder="Search Project"
          className="border rounded-2xl p-2 w-[20vw]"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        <select className="border rounded-2xl p-2" value={filter} onChange={handleFilterChange}>
          <option value="All">Filter</option>
          <option value="Low">Low</option>
          <option value="High">High</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className=" main flex gap-2 justify-around h-[80vh] pt-6">
        <div className=" main-top flex flex-col gap-y-8 w-[15vw]">
          {/* Expired Tasks */}
          <div className="bg-gray-200 shadow-xl rounded-2xl p-4 h-[20vh]">
            <div className="flex items-center mb-2">
              <span className="text-red-500 mr-2">{/* Expired Icon */}</span>
              Expired Tasks
            </div>
            <div className="text-2xl font-bold">{expiredTasksCount}</div>
          </div>

          {/* All Active Tasks */}
          <div className="bg-gray-200 shadow-xl rounded-2xl p-4 h-[20vh]">
            <div className="flex items-center mb-2">
              <span className="text-orange-500 mr-2">{/* Active Icon */}</span>
              All Active Tasks
            </div>
            <div className="text-2xl font-bold">{activeTasksCount}</div>
          </div>

          {/* Completed Tasks */}
          <div className="bg-gray-200 shadow-xl rounded-2xl p-4 h-[20vh]">
            <div className="flex items-center mb-2">
              <span className="text-blue-500 mr-2">{/* Completed Icon */}</span>
              Completed Tasks
            </div>
            <div className="text-2xl font-bold">{completedTasksCount}/{tasks.length}</div>
          </div>

          {/* Add Task Button */}
          <button onClick={() => setFormVisible(true)} className="bg-blue-500 text-white p-2 rounded">
            + Add Task
          </button>

          {isFormVisible && (
            <TaskForm onSave={handleAddTask} onCancel={() => setFormVisible(false)} />
          )}
        </div>

        {/* To Do */}
        <div style={{ scrollbarWidth: 'none' }} className="main-2 bg-gray-200 shadow-xl rounded-2xl p-4 col-span-1 w-[25vw] overflow-scroll">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-blue-500">• To Do</span>
            <span className="rounded-[50px] w-[25px] bg-gray-400 flex justify-center">
              {statusCounts.ToDo || 0}
            </span>
          </div>
          <hr className="p-[1.5px] bg-blue-400 mb-[10px]" />

          {filteredTasks
            .filter((task) => task.status === 'ToDo')
            .map((task) => (
              <div
                style={{ scrollbarWidth: 'none' }}
                key={task._id}
                className="bg-white rounded-2xl overflow-scroll flex flex-col relative mb-2 shadow-sm min-h-[20vh] p-[12px]"
              >
                <div className="flex justify-between">
                  <div className="font-bold">{task.title}</div>
                  <div
                    className={`text-xs font-bold uppercase ${task.preference === 'Low' ? 'text-yellow-500' : (task.preference === 'Completed' ? 'text-green-500' : 'text-red-500')} mb-1`}
                  >
                    {task.preference}
                  </div>
                </div>

                <div className="text-sm text-gray-600">{task.description}</div>
                <div className="text-xs font-semibold pt-2 text-black-500">Deadline: {task.deadline}</div>
                <MdDeleteOutline onClick={() => handleDelete(task._id)} className="absolute right-2 bottom-2" />
              </div>
            ))}
        </div>

        {/* On Progress */}
        <div style={{ scrollbarWidth: 'none' }} className="main-2 bg-gray-200 shadow-xl rounded-2xl p-4 w-[25vw] col-span-1 overflow-scroll">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-orange-500">• On Progress</span>
            <span className="rounded-[50px] w-[25px] bg-gray-400 flex justify-center">
              {statusCounts.InProgress || 0}
            </span>
          </div>
          <hr className="p-[1.5px] bg-orange-400 mb-[10px]" />

          {filteredTasks
            .filter((task) => task.status === 'InProgress')
            .map((task) => (
              <div
                style={{ scrollbarWidth: 'none' }}
                key={task._id}
                className="bg-white rounded-2xl overflow-scroll flex flex-col relative mb-2 shadow-sm min-h-[20vh] p-[12px]"
              >
                <div className="flex justify-between">
                  <div className="font-bold">{task.title}</div>
                  <div
                    className={`text-xs font-bold uppercase ${task.preference === 'Low' ? 'text-yellow-500' : (task.preference === 'Completed' ? 'text-green-500' : 'text-red-500')} mb-1`}
                  >
                    {task.preference}
                  </div>
                </div>

                <div className="text-sm text-gray-600">{task.description}</div>
                <div className="text-xs font-semibold pt-2 text-black-500">Deadline: {task.deadline}</div>
                <MdDeleteOutline onClick={() => handleDelete(task._id)} className="absolute right-2 bottom-2" />
              </div>
            ))}
        </div>

        {/* Completed */}
        <div style={{ scrollbarWidth: 'none' }} className="main-2 bg-gray-200 shadow-xl rounded-2xl p-4 w-[25vw] col-span-1 overflow-scroll">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-green-500">• Completed</span>
            <span className="rounded-[50px] w-[25px] bg-gray-400 flex justify-center">
              {statusCounts.Completed || 0}
            </span>
          </div>
          <hr className="p-[1.5px] bg-green-400 mb-[10px]" />

          {filteredTasks
            .filter((task) => task.status === 'Done')
            .map((task) => (
              <div
                style={{ scrollbarWidth: 'none' }}
                key={task._id}
                className="bg-white rounded-2xl overflow-scroll flex flex-col relative mb-2 shadow-sm min-h-[20vh] p-[12px]"
              >
                <div className="flex justify-between">
                  <div className="font-bold">{task.title}</div>
                  <div
                    className={`text-xs font-bold uppercase ${task.preference === 'Low' ? 'text-yellow-500' : (task.preference === 'Completed' ? 'text-green-500' : 'text-red-500')} mb-1`}
                  >
                    {task.preference}
                  </div>
                </div>

                <div className="text-sm text-gray-600">{task.description}</div>
                <div className="text-xs font-semibold pt-2 text-black-500">Deadline: {task.deadline}</div>
                <MdDeleteOutline onClick={() => handleDelete(task._id)} className="absolute right-2 bottom-2" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default App;
