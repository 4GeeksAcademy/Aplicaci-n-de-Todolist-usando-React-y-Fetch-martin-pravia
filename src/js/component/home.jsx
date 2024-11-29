import React, { useEffect, useState } from "react";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const api = "https://playground.4geeks.com/todo";
  const lastApi = "/users/martopravia";
  const myApi = `${api}${lastApi}`;

  useEffect(() => {
    const fetchApi = async () => {
      try {
        let response = await fetch(myApi);
        if (!response.ok) {
          throw new Error("Error, no cargó");
        }
        const data = await response.json();
        setTasks(data.todos);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchApi();
  }, []);

  const addTask = async (e) => {
    if (e.key === "Enter" && e.target.value !== "") {
      const newTask = { label: e.target.value, done: false };

      try {
        const response = await fetch(`${api}/todos/martopravia`, {
          method: "POST", 
          body: JSON.stringify(newTask),
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Error al agregar tarea");

        const addedTask = await response.json();
        setTasks((tasks) => [...tasks, addedTask]); 
        e.target.value = ""; 
      } catch (error) {
        console.error("Fatalidad :", error);
      }
    }
  };

  const deleteTaskIndiv = async (taskId) => {
    try {
      const response = await fetch(`${api}/todos/${taskId}`, {
        method: "DELETE", 
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Error al eliminar la tarea");

      setTasks((tasks) => tasks.filter((task) => task.id !== taskId)); 
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateTask = async (taskId, newLabel) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, label: newLabel } : task
    );

    try {
      const response = await fetch(`${api}/todos/${taskId}`, {
        method: "PUT", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLabel, done: false }),
      });
      if (!response.ok) throw new Error("Error al actualizar la tarea");
      
      setTasks(updatedTasks); 
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
    }
  };

  
  const deleteAllTasks = async () => {
    try {
     
      for (const task of tasks) {
        const response = await fetch(`${api}/todos/${task.id}`, {
          method: "DELETE", 
          headers: { "Content-Type": "application/json" },
        });
  
        if (!response.ok) throw new Error(`Error al eliminar la tarea con id ${task.id}`);
      }
  
     
      setTasks([]);
    } catch (error) {
      console.error("Error al eliminar todas las tareas:", error);
    }
  };
  return (
    <>
      <div className="row d-flex justify-content-center">
        <div className="col-8">
          <label className="form-label d-flex justify-content-center align-items-center">
            <h1 className="display-3 title"> To Do List</h1>
          </label>
          <input
            type="text"
            className="form-control"
            id="inputText"
            aria-describedby="InputText"
            placeholder="Insert here your item to the list"
            onKeyDown={addTask}
          />
          
          <ul className="list-group">
            {tasks.map((task, index) => (
              <li
                className="list-group-item d-flex justify-content-between align-items-center"
                key={task.id} 
              >
                {task.isEditing ? (
                  <input
                    type="text"
                    defaultValue={task.label}
                    onBlur={(e) => updateTask(task.id, e.target.value)} 
                    onKeyDown={(e) => {
                      if (e.key === "Enter") updateTask(task.id, e.target.value);
                    }}
                    autoFocus
                    className="form-control"
                  />
                ) : (
                  <span>{task.label}</span>
                )}
                <i
                  className="bi bi-trash trash"
                  onClick={() => deleteTaskIndiv(task.id)} 
                  style={{ cursor: "pointer" }}
                ></i>
              </li>
            ))}

            <li className="list-group-item">
              {tasks.length !== 0
                ? `To do's to go: ${tasks.length}`
                : "There's nothing to do :)"}
            </li>
          </ul>

          
          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn btn-danger"
              onClick={deleteAllTasks}
            >
             Evadir todo, limpiar!
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
