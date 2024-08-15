import React, { useState, useEffect } from 'react';
const TaskForm = ({ onSave, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [preference, setPreference] = useState('Low');
    const [status, setStatus] = useState('ToDo');
    const handleSubmit = (e) => {
      e.preventDefault();
      onSave({
        title,
        description,
        deadline,
        preference,
        status
      });
    };
  
    return (
      <div className="fixed z-10 inset-0 bg-gray-100 bg-opacity-75 flex justify-center items-center">
        <form className="bg-white p-4 rounded-lg" onSubmit={handleSubmit}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="border p-2 rounded w-full mb-2"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="border p-2 rounded w-full mb-2"
            required
          />
          <select
            value={preference}
            onChange={(e) => setPreference(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          >
            <option value="Low">Low</option>
            <option value="High">High</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 rounded w-full mb-4"
          >
            <option value="ToDo">ToDo</option>
            <option value="InProgress">InProgress</option>
            <option value="Done">Done</option>
          </select>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded mr-2">Save Task</button>
          <button type="button" onClick={onCancel} className="bg-red-500 text-white p-2 rounded">Cancel</button>
        </form>
      </div>
    );
  };
  export default TaskForm;