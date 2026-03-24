import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

function EditUser() {
  const navigate = useNavigate();
  let param = useParams();

  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    async function fetchINIT() {
      setLoading(true);
      let user = await fetch(`http://localhost:3000/users/${param.EditID}`);
      if (!user.ok) {
        setError("User not found");
        throw new Error("User not found");
      }
      let data = await user.json();
      setForm(data);
      setLoading(false);
    }

    fetchINIT();
  }, [param.EditID]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const payload = {
        ...form,
        age: Number(form.age),
      };

      console.log("🚀 Sending POST request:", payload);

      const res = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        console.log("❌ Server error:", errData);
        throw new Error(errData.error || "Failed to add user");
      }

      const data = await res.json();
      console.log("✅ User created successfully:", data);

      // ✅ Reset form before navigation (optional but clean)
      setForm({ name: "", email: "", age: "", role: "" });

      window.alert("User added successfully");
    } catch (err) {
      console.log("🔥 Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>Add New User</h2>

      {error && <p className="error-msg">{error}</p>}

      <form className="user-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Enter name"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Enter email"
          />
        </div>

        <div className="form-group">
          <label>Age</label>
          <input
            name="age"
            type="number"
            value={form.age}
            onChange={handleChange}
            required
            placeholder="Enter age"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Editing..." : "Edit User"}
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditUser;
