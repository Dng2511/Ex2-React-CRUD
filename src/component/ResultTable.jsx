import React from 'react';
import { Api } from "../services/Api";

function ResultTable({ keyword, user, onAdded }) {
    const [users, setUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [editing, setEditing] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [page, setPage] = React.useState(1);
    const pageSize = 10;

    function editUser(u) {
        setEditing({ ...u, address: { ...(u.address || {}) } });
    }

    React.useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await Api.getUsers();
                setUsers(data || []);
            } catch (err) {
                console.error(err);
                setError('Không thể tải dữ liệu người dùng');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    React.useEffect(() => {
        if (user) {
            // append to local list and notify parent reset
            setUsers((prev) => [user, ...prev]);
            onAdded && onAdded();
            setPage(1);
        }
    }, [user]);

    const filtered = users.filter((u) => {
        const kw = (keyword || "").toLowerCase();
        return (
            u.name?.toLowerCase().includes(kw) ||
            u.username?.toLowerCase().includes(kw)
        );
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const pageIndex = Math.min(Math.max(1, page), totalPages);
    const pageItems = filtered.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

    const handleEditChange = (field, value) => {
        if (!editing) return;
        if (field.startsWith('address.')) {
            const k = field.split('.')[1];
            setEditing(prev => ({ ...prev, address: { ...prev.address, [k]: value } }));
        } else {
            setEditing(prev => ({ ...prev, [field]: value }));
        }
    };

    const saveUser = async () => {
        if (!editing) return;
        try {
            const updated = await Api.updateUser(editing.id, editing);
            setUsers(prev => prev.map(u => (u.id === editing.id ? { ...u, ...updated } : u)));
            setEditing(null);
        } catch (err) {
            console.error(err);
            alert('Lỗi khi lưu thay đổi');
        }
    };

    const removeUser = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa người dùng này?')) return;
        try {
            await Api.deleteUser(id);
            setUsers(prev => prev.filter(u => u.id !== id));
            // adjust page if empty
            if ((pageItems.length === 1) && page > 1) setPage(page - 1);
        } catch (err) {
            console.error(err);
            alert('Lỗi khi xóa người dùng');
        }
    };

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div>
            {editing && (
                <div style={{ marginBottom: 12 }}>
                    <h4>Chỉnh sửa người dùng</h4>
                    <label>Name: </label>
                    <input id="name" value={editing.name || ''} onChange={(e) => handleEditChange('name', e.target.value)} />
                    <label> Username: </label>
                    <input value={editing.username || ''} onChange={(e) => handleEditChange('username', e.target.value)} />
                    <label> Email: </label>
                    <input value={editing.email || ''} onChange={(e) => handleEditChange('email', e.target.value)} />
                    <label> City: </label>
                    <input value={editing.address?.city || ''} onChange={(e) => handleEditChange('address.city', e.target.value)} />
                    <button onClick={saveUser}>Lưu</button>
                    <button onClick={() => setEditing(null)}>Hủy</button>
                </div>
            )}

            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>City</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pageItems.map((u) => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.name}</td>
                            <td>{u.username}</td>
                            <td>{u.email}</td>
                            <td>{u.address?.city}</td>
                            <td>
                                <button onClick={() => editUser(u)}>Sửa</button>
                                <button onClick={() => removeUser(u.id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: 8 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={pageIndex <= 1}>Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)} disabled={p === pageIndex}>{p}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={pageIndex >= totalPages}>Next</button>
            </div>
        </div>
    );
}

export default ResultTable;