import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import NotesPanel from "../components/NotesPanel";
import GroupCard from "../components/GroupCard";

function Home() {
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [notesOpen, setNotesOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError("");

      const user = JSON.parse(localStorage.getItem("user"));
      const activeProfile = JSON.parse(localStorage.getItem("activeProfile"));
      const profileId = activeProfile?.profileId || null;

      if (!user?._id) {
        setError("User not logged in");
        return;
      }

      const url = profileId
        ? `http://localhost:5000/api/groups?userId=${user._id}&profileId=${profileId}`
        : `http://localhost:5000/api/groups?userId=${user._id}&profileId=null`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.error || "Failed to load groups");
        return;
      }

      setGroups(data);
    } catch (error) {
      console.log(error);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    fetchGroups();
  }, []);

  const handleOpenGroup = (groupId) => {
    setSelectedGroupId(groupId);
    navigate(`/all-expenses/${groupId}`);
  };

  const handleCreateGroup = () => {
    navigate("/create-group");
  };

  const handleOpenNotes = () => {
    setNotesOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("activeProfile");
    navigate("/login");
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="page-shell">
      <Navbar
        onOpenNotes={handleOpenNotes}
        onCreateGroup={handleCreateGroup}
        onLogout={handleLogout}
        userName={localStorage.getItem("userName") || user?.name || "User"}
        userEmail={localStorage.getItem("userEmail") || user?.email || ""}
      />

      <div className="page-content">
        <div className="hero-card">
          <p className="hero-badge">Smart expense sharing</p>
          <h1>Track groups, split bills and manage notes easily.</h1>
          <p className="hero-text">
            Create a group, add expenses, choose who paid, and keep everything saved.
          </p>
        </div>

        <div className="section-head">
          <h2>Your Groups</h2>
          <p>Select a group to add expenses.</p>
        </div>

        {loading && (
          <div className="empty-card">
            <h3>Loading...</h3>
            <p>Please wait while groups are loading.</p>
          </div>
        )}

        {error && (
          <div className="empty-card">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="group-grid">
            {groups.length === 0 ? (
              <div className="empty-card">
                <h3>No groups yet</h3>
                <p>Create your first group by clicking New Group.</p>
              </div>
            ) : (
              groups.map((group) => (
                <GroupCard
                  key={group._id}
                  group={group}
                  isSelected={selectedGroupId === group._id}
                  onClick={() => handleOpenGroup(group._id)}
                />
              ))
            )}
          </div>
        )}
      </div>

      <button className="floating-add-btn" onClick={handleCreateGroup}>
        +
      </button>

      <NotesPanel
        isOpen={notesOpen}
        onClose={() => setNotesOpen(false)}
        selectedGroupId={selectedGroupId}
      />
    </div>
  );
}

export default Home;