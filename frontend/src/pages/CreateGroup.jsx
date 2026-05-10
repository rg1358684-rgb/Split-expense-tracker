import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Plus, ArrowLeft } from "lucide-react";

function CreateGroup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    groupName: "",
    currency: "INR - Indian Rupee",
    members: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.groupName.trim()) {
      setError("Please enter group name");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const activeProfile = JSON.parse(localStorage.getItem("activeProfile"));

    if (!user?._id) {
    setError("User not found, please login again");
    return;
   }

    try {
      setLoading(true);

      const membersArray = formData.members
        .split(",")
        .map((m) => m.trim())
        .filter((m) => m !== "")
        .map((member) => ({
          name: member,
        }));

      const res = await fetch("http://localhost:5000/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        userId: user._id,
        profileId: activeProfile?.profileId || null,
        groupName: formData.groupName,
        currency: formData.currency,
        members: membersArray,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      navigate("/");
    } catch (err) {
      console.log(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-group-page">
      <div className="create-group-card">
        <button className="back-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="page-header">
          <div className="icon-box">
            <Users size={28} />
          </div>
          <h1>Create Group</h1>
          <p>Create a new expense group and add members</p>
        </div>

        <form onSubmit={handleSubmit} className="group-form">
          <div className="input-group">
            <label>Group Name</label>
            <input
              type="text"
              name="groupName"
              placeholder="Enter group name"
              value={formData.groupName}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Currency</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
            >
              <option value="INR - Indian Rupee">INR - Indian Rupee</option>
              <option value="USD - US Dollar">USD - US Dollar</option>
              <option value="EUR - Euro">EUR - Euro</option>
              <option value="GBP - British Pound">GBP - British Pound</option>
            </select>
          </div>

          <div className="input-group">
            <label>Members</label>
            <input
              type="text"
              name="members"
              placeholder="Enter members separated by comma"
              value={formData.members}
              onChange={handleChange}
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button
            type="submit"
            className="primary-btn full-width"
            disabled={loading}
          >
            <Plus size={18} />
            {loading ? "Creating..." : "Create Group"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateGroup;