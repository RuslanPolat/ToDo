import React, { useEffect } from "react";
import { useState } from "react";


import Modal from "./components/modal/Modal";
import {myAxios} from './service/axios'

function App() {

  const [modal, setModal] = useState(false);
  const [todos, setTodos] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [addload, setAddLoad] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null)

  useEffect(() => {
    getAllTodos();
  }, [])

  async function onAddTodo() {
    setAddLoad(true)
    try {
      const res = await myAxios.post("/api/todo", {name, color: genColor()})
      setAddLoad(false)
      setName("")
      getAllTodos()
    } catch (error) {
      setAddLoad(false)
    }
  }

  function randNumber(min, max) {
    return Math.floor(Math.random()* (max - min + 1) + min)
  }

  function genColor() {
      let color ="#";
      for (let i=0; i<6; i++) {
        let rn = randNumber(0,15);
        color += rn.toString(16)
      }
      return color;
  }

  async function onDelete(id) {
    setLoading(true)
    try {
      const res = await myAxios.delete("/api/todo/" + id)
      getAllTodos();
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  }

  async function getAllTodos() {
    setLoading(true)
    try{
      const res = await myAxios("/api/todo");
      setTodos(res.data.data);
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
      setError("Server bilan muammo bor")
    }
  }

  async function onChecked(id) {
   try {
      const res = await myAxios("/api/todo/toggleComplete/" + id)
      getAllTodos()
    } catch (error) {
      console.log(error);
    }
  }


  return (
      <div className="container py-5">
       <main>
        <div className="row">
            <div className="col-10">
              <input type="text"
               className="form-control"
               placeholder="name.."
               value={name}
               onChange={e => setName(e.target.value)}
               />
            </div>
            <div className="col-2">
              <button type="button" className="btn btn-primary w-100"
              onClick={onAddTodo}
              disabled={addload}
              >Add</button>
            </div>
        </div>
       </main>
       <section className="mt-5">
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border text-info text-center" style={{ zoom: "5"}}>
                <span className="sr-only"></span>
             </div>
            </div>) : (
            error ? <p className="text-center text-danger">{error}</p> :  <ul className="list-unstyled">
            {todos.map((i) => (
               <li key={i._id} style={{backgroundColor : i.color}} className="shadow p-3 mb-2  rounded d-flex align-items-center justify-content-between">
               <div className="form-check">
                 <input className="form-check-input" type="checkbox" checked={i.isCompleted} 
                 onClick={() => onChecked(i._id)}/>
               </div>
               <p className="m-0">{i.name}</p>
               <div className="d-flex gap-3">
                 <button type="button" className="btn btn-warning btn-sm"
                 onClick={() => 
                  {
                    setCurrentTodo(i)
                    setModal(true)
                  }}
                 >Edit</button>
                 <button type="button" className="btn btn-danger btn-sm"
                 onClick={() => onDelete(i._id)}>Delete</button>
               </div>
             </li>
            )) }
           </ul>
         )}
       </section>
       <Modal modal={modal} onClose={() => setModal(false)} todo={currentTodo} getAllTodos={getAllTodos}/>
      </div>
    );
  }


export default App;
