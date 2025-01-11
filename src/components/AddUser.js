import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function AddUser({ add }) {
    const navigate = useNavigate()
    const close = (e) => {
        e.preventDefault()
        navigate('/')
    }

    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')

    const submit = (e) => {
        e.preventDefault()
        add(name, phone)
        navigate('/')
    }

    return (
        <form className="add" onSubmit={submit}>
            <input type="text" placeholder="User Name" name="add" value={name} onChange={(e) => setName(e.target.value)}></input>
            <input type="text" placeholder="Phone Number" name="add" value={phone} onChange={(e) => setPhone(e.target.value)}></input>
            <div className="addButton">
                <button className="btn2" type="submit" >save</button>
                <button className="btn2" onClick={close}>cancel</button>
            </div>
        </form>
    )
}