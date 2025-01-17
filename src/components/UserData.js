import { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Link } from 'react-router-dom';

export default function UserData({ user, remove, edit }) {

    const [isEdit, setIsEdit] = useState(false)
    const [recentData, setRecentData] = useState({ id: user.id, name: user.name, phone: user.phone })

    const saveUser = (e) => {
        edit(recentData.id, recentData.name, recentData.phone)
        setIsEdit(false)
    }

    const confirm = (user) => {
        confirmAlert({
            title: 'CONFIRM TO DELETE',
            message: `Are you sure to delete this?`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => remove(user.id)
                },
                {
                    label: 'No',
                }
            ]
        })
    }

    if (isEdit) {
        return (
            <div className="userCard cardPosition">
                <div>
                    <img src={user?.avatar ? `http://localhost:3000/images/${user.avatar}` : `http://localhost:3000/images/default.jpg`} alt='no source'></img>
                </div>
                <div className="list2">
                    <p><input id='name' value={recentData.name} onChange={(e) => setRecentData({ ...recentData, name: e.target.value })}></input></p>
                    <p><input id='phone' value={recentData.phone} onChange={(e) => setRecentData({ ...recentData, phone: e.target.value })}></input></p>
                    <div className="btn3">
                        <i className="fa-solid fa-floppy-disk" onClick={saveUser}></i>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="userCard cardPosition">
                <Link to='/avatar' state={user} >
                <img src={user?.avatar ? `http://localhost:3000/images/${user.avatar}` : `http://localhost:3000/images/default.jpg`} alt='no source'></img>
                </Link>
                <div className="list">
                    <p>{user.name}</p>
                    <p>{user.phone}</p>
                    <div className="btn3">
                        <i className="fa-regular fa-pen-to-square" style={{ marginRight: '10px' }} onClick={() => setIsEdit(true)}></i>
                        <i className="fa-solid fa-trash-can" onClick={confirm}></i>
                    </div>
                </div>
            </div >
        )
    }
}