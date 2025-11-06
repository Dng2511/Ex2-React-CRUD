import React from 'react';

function ResultTable({ keyword, user, onAdded }) {
    const [users, setUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [editing, setEditing] = React.useState(null);

    function editUser(user) {
        setEditing({ ...user, address: { ...user.address } });
    }

    // Tải dữ liệu 1 lần khi component mount 
    React.useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/users")
            .then(res => res.json())
            .then(data => { setUsers(data); setLoading(false); });
    }, []);

    React.useEffect(() => {
        if (user) {
            setUsers((prev) => [...prev, { ...user, id: prev.length + 1 }]);
            onAdded();
        }
    }, [user]);

    const filteredUsers = users.filter(
        (u) =>
            u.name.toLowerCase().includes(keyword.toLowerCase()) ||
            u.username.toLowerCase().includes(keyword.toLowerCase())
    );

    function handleEditChange(id, value) {
        if (id == "name") {
            setEditing(prev => ({ ...prev, name: value }));
        } else if (id == "username") {
            setEditing(prev => ({ ...prev, username: value }));
        } else if (id == "email") {
            setEditing(prev => ({ ...prev, email: value }));
        } else if (id == "address.city") {
            setEditing(prev => ({ ...prev, address: { ...prev.address, city: value } }));
        }
    }

    function saveUser() {
        setUsers(prev => prev.map(u => u.id === editing.id ? editing : u));
        setEditing(null);
    }


    function removeUser(id) {
        // Giữ lại tất cả người dùng có id khác với id cần xóa 
        setUsers((prev) => prev.filter((u) => u.id != id));
    }

    return (
        <>
            {editing && (<>
                <label htmlFor="name"> Name </label>
                <input id="name" type="text" value={editing.name}
                    onChange={(e) => handleEditChange("name", e.target.value)} />
                <input type="text" value={editing.username}
                    onChange={(e) => handleEditChange("username", e.target.value)} />
                <input type="text" value={editing.email}
                    onChange={(e) => handleEditChange("email", e.target.value)} />
                <input type="text" value={editing.address.city}
                    onChange={(e) => handleEditChange("address.city", e.target.value)} />
                <button onClick={() => saveUser()}> Lưu</button>
            </>)}

            <tbody >
                {
                    filteredUsers.map((u) => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.name}</td>
                            <td>{u.username}</td>
                            <td>{u.email}</td>
                            <td>{u.address.city}</td>
                            <td>
                                <button onClick={() => editUser(u)}>Sửa</button>
                                <button onClick={() => removeUser(u.id)}>Xóa</button>
                            </td>
                        </tr>
                    ))
                }
            </tbody >
        </>
    )


}

export default ResultTable;