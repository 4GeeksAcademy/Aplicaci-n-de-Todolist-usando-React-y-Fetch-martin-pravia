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
        console.log(data.todos);
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
      console.log(newTask);
      try {
        const response = await fetch(`${api}/todos/martopravia`, {
          method: "POST",
          body: JSON.stringify(newTask),
          headers: { "Content-Type": "application/json" },
        });
        console.log(response);
        if (!response.ok) throw new Error("Ocurrió un error al llevar data");
        const addedTask = await response.json();
        setTasks((tasks) => tasks.concat(addedTask));
        e.target.value = "";
        console.log(addedTask);
      } catch (error) {
        console.log("Fatalidad :", error);
      }
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
                className="list-group-item d-flex justify-content-between"
                key={index}
              >
                {task.label}
                <i className="bi bi-trash trash"></i>
              </li>
            ))}

            <li className="list-group-item">
              {tasks.length !== 0
                ? `To do's to go: ${tasks.length}`
                : "There's nothing to do :)"}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Home;
