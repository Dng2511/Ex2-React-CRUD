import React from 'react';
import { Api } from "../services/Api";

function AddUser({ onAdd }) {
    const [adding, setAdding] = React.useState(false);
    const [user, setUser] = React.useState({
        name: "", username: "", email: "",
        address: { street: "", suite: "", city: "" },
        phone: "", website: ""
    });
    const handleChange = (e) => {
        const { id, value } = e.target;
        if (["street", "suite", "city"].includes(id)) {
            setUser({ ...user, address: { ...user.address, [id]: value } });
        } else {
            setUser({ ...user, [id]: value });
        }
    };
    const [saving, setSaving] = React.useState(false);
    const handleAdd = async () => {
        if (user.name === "" || user.username === "") {
            alert("Vui lòng nhập Name và Username!");
            return;
        }
        setSaving(true);
        try {
            const created = await Api.createUser(user);
            // jsonplaceholder returns created resource with id
            onAdd(created);
            setUser({
                name: "", username: "", email: "", address: {
                    street: "",
                    suite: "", city: ""
                }, phone: "", website: ""
            });
            setAdding(false);
        } catch (err) {
            console.error(err);
            alert("Lỗi khi thêm người dùng. Kiểm tra console.");
        } finally {
            setSaving(false);
        }
    };
    return (
    <div>
        <button onClick={() => setAdding(!adding)}>Thêm</button>
        {adding && (
            <div>
                <h4>Thêm người dùng</h4>
                <label>Name: </label>
                <input id="name" type="text" value={user.name} onChange={handleChange} /><br />
                <label>Username: </label>
                <input id="username" type="text" value={user.username} onChange={handleChange} /><br />
                <label>Email: </label>
                <input id="email" type="text" value={user.email} onChange={handleChange} /><br />
                <label>Street: </label>
                <input id="street" type="text" value={user.address.street} onChange={handleChange} /><br />
                <label>Suite: </label>
                <input id="suite" type="text" value={user.address.suite} onChange={handleChange} /><br />
                <label>City: </label>
                <input id="city" type="text" value={user.address.city} onChange={handleChange} /><br />
                <label>Phone: </label>
                <input id="phone" type="text" value={user.phone} onChange={handleChange} /><br />
                <label>Website: </label>
                <input id="website" type="text" value={user.website} onChange={handleChange} /><br />
                <button onClick={handleAdd} disabled={saving}>{saving ? "Đang lưu..." : "Lưu"}</button>
            </div>
        )}
    </div>
    )
}
export default AddUser;