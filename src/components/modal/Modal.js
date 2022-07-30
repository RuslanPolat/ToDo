import React, { useEffect, useState } from 'react'
import  ReactModal from 'react-modal'
import { myAxios } from '../../service/axios';

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        width: "40%",
        minHeight: "120px",
    },
};

export default function Modal({modal, onClose, todo, getAllTodos}) {
    
    const [name, setName] = useState()
    const [color, setColor] = useState()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        ReactModal.setAppElement("body")
    }, []);

    useEffect(() => {
        if (!todo) return;
        setName(todo.name);
        setColor(todo.color);
    }, [todo])


    async function onEdit() {
        setLoading(true)
        try {
            const res = await myAxios.put("/api/todo", {name, color, id: todo._id})
            onClose()
            setLoading(false)
            getAllTodos();
            res;
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

  return (
    <ReactModal 
     isOpen={modal}
     style={customStyles}
     contentLabel="Example Modal" 
     ariaHideApp={false}>
        <h1 className='text-center mb-3'>Edit To Do</h1>
        <div className='pb-3 '>
            <input type="text" className='form-control'
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
        </div>
        <div className='mt-4'>
            <label>Color</label>
            <br />
            <input type="color" 

            value={color}
            onChange={(e) => setColor(e.target.value)}
            />
        </div>
        <div className='d-flex gap-2 justify-content-end'>
        <button type='button' className='btn btn-danger'
        onClick={onEdit}
        disabled={loading}
        >Edit</button>
        <button type='button' className='btn btn-warning' onClick={onClose}>Close</button>
        </div>
    </ReactModal>
  )
}