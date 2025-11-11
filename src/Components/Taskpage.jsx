import React, { useState, useEffect } from "react";
import { BsCheckCircle, BsStar } from "react-icons/bs";
import { IoAdd } from "react-icons/io5";


import AOS from 'aos';
import 'aos/dist/aos.css';

const TaskPage = () => {
  const [editIndex, setEditIndex] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [view, setView] = useState("all");

  // form data (all grouped)
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    starred: false,
  });

  // Load saved tasks from localStorage when app starts
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks"));
    if (saved) setTasks(saved);
  }, []);

  // Save tasks to localStorage every time tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add or update task
  const handleAddTask = (e) => {
    e.preventDefault();

    let updatedTasks;
    if (editIndex !== null) {
      updatedTasks = [...tasks];
      updatedTasks[editIndex] = newTask;
      setEditIndex(null);
    } else {
      updatedTasks = [...tasks, newTask];
    }

    setTasks(updatedTasks);
    setNewTask({ name: "", description: "", startDate: "", endDate: "", starred: false });
    setShowModal(false);
  };

  // Edit a task
  const handleEditTask = (index) => {
    setNewTask(tasks[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  // Delete a task
  const handleDeleteTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  // Toggle star
  // const toggleStar = (index) => {
  //   const updated = [...tasks];
  //   updated[index].starred = !updated[index].starred;
  //   setTasks(updated);
  // };
  const toggleStar = (index) => {
  const updated = [...tasks];
  updated[index].starred = !updated[index].starred;
  setTasks(updated);
  localStorage.setItem("tasks", JSON.stringify(updated)); // save change
};
useEffect(() => {
    AOS.init({ duration: 1200 });
  }, []);

  return (
    <div className="task-app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <BsCheckCircle className="logo-icon" />
          <h2>Tasks</h2>
        </div>

        <button className="create-btn" onClick={() => setShowModal(true)}>
          <IoAdd /> Create
        </button><br></br>
        

        {/* <div className="menu">
          <div className="menu-item active">
            <BsCheckCircle className="menu-icon" /> All tasks
          </div>
          <div className="menu-item">
            <BsStar className="menu-icon" /> Starred
          </div>
        </div> */}
        <div
          className={`menu-item ${view === "all" ? "active" : ""}`}
          onClick={() => setView("all")}
        >
          <BsCheckCircle className="menu-icon" /> All Tasks
        </div>

        <div
          className={`menu-item ${view === "starred" ? "active" : ""}`}
          onClick={() => setView("starred")}
        >
          <BsStar className="menu-icon" /> Starred
        </div>
      </aside>

      {/* Main Section */}
      <main className="task-main">
        <div className="task-card"data-aos="fade-right">
          <h3>My Tasks</h3>
          <p className="add-task" onClick={() => setShowModal(true)}>
            <BsCheckCircle className="add-icon" /> Add a task
          </p>

          {tasks.length === 0 && <p className="no-task">No tasks yet</p>}

          {tasks
            .filter((task) => (view === "all" ? true : task.starred))
            .map((task, index) => (
              <div className="task-item" key={index}>
                <div className="task-info">
                  <input type="checkbox" />
                  <div>
                    <p className="task-name">{task.name}</p>
                    <p className="task-desc">{task.description}</p>
                    <small>
                      {task.startDate && `Start: ${task.startDate}`}{" "}
                      {task.endDate && `| End: ${task.endDate}`}
                    </small>
                  </div>
                </div>

                <div className="task-actions">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEditTask(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteTask(index)}
                  >
                    Delete
                  </button>
                  <BsStar
                    className={`star-icon ${task.starred ? "starred" : ""}`}
                    onClick={() => toggleStar(index)}
                  />
                </div>
              </div>
            ))}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h4>{editIndex !== null ? "Edit Task" : "Add New Task"}</h4>
            <form onSubmit={handleAddTask}>
              <input
                type="text"
                placeholder="Task name"
                value={newTask.name}
                onChange={(e) =>
                  setNewTask({ ...newTask, name: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
              <label>Start Date:</label>
              <input
                type="date"
                value={newTask.startDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, startDate: e.target.value })
                }
              />
              <label>End Date:</label>
              <input
                type="date"
                value={newTask.endDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, endDate: e.target.value })
                }
              />
              <div className="modal-btns">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskPage;
