import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:3000/users");

      if (!res.ok) {
        const errData = await res.json();
        console.log("❌ GET error:", errData);
        throw new Error(errData.error || "Failed to fetch users");
      }

      const data = await res.json();
      console.log("✅ Users fetched successfully:", data);

      setUsers(data);
    } catch (err) {
      console.log("🔥 GET Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      setDeletingId(id);
      setError("");

      const res = await fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        console.log("❌ DELETE error:", errData);
        throw new Error(errData.error || "Failed to delete user");
      }

      const data = await res.json();
      console.log("✅ User deleted successfully:", data);

      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.log("🔥 DELETE Error:", err.message);
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <h2 className="page-container">Loading users...</h2>;

  return (
    <div className="page-container">
      <h2>User List</h2>

      {error && <p className="error-msg">{error}</p>}

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user?.id || "-"}</td>
                <td>{user?.name || "-"}</td>
                <td>{user?.email || "-"}</td>
                <td>{user?.age || "-"}</td>
                <td>
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(user.id)}
                    disabled={deletingId === user.id}
                  >
                    {deletingId === user.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
