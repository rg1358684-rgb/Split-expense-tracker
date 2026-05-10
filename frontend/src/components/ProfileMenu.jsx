import { useEffect, useState } from "react";
import { UserCircle2, Mail, User, Plus, X, Check } from "lucide-react";

function ProfileMenu({ isOpen, userName, userEmail, onClose }) {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [activeProfile, setActiveProfile] = useState(
    JSON.parse(localStorage.getItem("activeProfile")) || currentUser || null
  );

  const [profiles, setProfiles] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    profileName: "",
    email: "",
  });

  // ✅ Backend se profiles fetch karo
  useEffect(() => {
    if (isOpen && currentUser?._id) {
      fetch(`http://localhost:5000/api/profiles?userId=${currentUser._id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setProfiles(data);
            localStorage.setItem("profiles", JSON.stringify(data));
          }
        })
        .catch((err) => console.log("Profile fetch error:", err));
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Backend mein profile save karo
  const handleAddProfile = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.profileName.trim()) {
      setMessage("Please enter profile name");
      return;
    }

    const exists = profiles.some(
      (profile) =>
        profile.email?.toLowerCase() === formData.email.trim().toLowerCase()
    );

    if (exists) {
      setMessage("Profile already added");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser._id,
          profileName: formData.profileName,
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Error adding profile");
        return;
      }

      const updatedProfiles = [...profiles, data.profile];
      setProfiles(updatedProfiles);
      localStorage.setItem("profiles", JSON.stringify(updatedProfiles));

      setFormData({ profileName: "", email: "" });
      setShowAddForm(false);
      setMessage("Profile added successfully");

    } catch (err) {
      console.log(err);
      setMessage("Server error");
    }
  };

  // ✅ Profile switch — sahi userId store karo
  const handleSetActiveProfile = (profile) => {
    const activeData = {
      _id: profile.userId,           // ✅ Yahi groups fetch mein jayega
      profileName: profile.profileName,
      email: profile.email,
      profileId: profile._id,        // Profile ka apna id
    };

    console.log("Setting active profile", activeData);

    localStorage.setItem("activeProfile", JSON.stringify(activeData));
    localStorage.setItem("userName", profile.profileName || "");
    localStorage.setItem("userEmail", profile.email || "");
    setActiveProfile(activeData);
    setMessage("Profile selected");

    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleDeleteProfile = async (profileId, e) => {
  e.stopPropagation();
  
  const confirmDelete = window.confirm("Delete this profile?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://localhost:5000/api/profiles/${profileId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      const updatedProfiles = profiles.filter(p => p._id !== profileId);
      setProfiles(updatedProfiles);
      localStorage.setItem("profiles", JSON.stringify(updatedProfiles));
      setMessage("Profile deleted");
    }
  } catch (err) {
    setMessage("Error deleting profile");
  }
};

  const displayName =
    activeProfile?.profileName || activeProfile?.name || userName || "User";

  const displayEmail = activeProfile?.email || userEmail || "No email";

  if (!isOpen) return null;

  return (
    <div className="profile-menu better-profile-menu">
      <div className="profile-top better-profile-top">
        <div className="profile-avatar">
          <UserCircle2 size={44} />
        </div>
        <div>
          <h3>{displayName}</h3>
          <p>Active Account</p>
        </div>
      </div>

      <div className="profile-info better-profile-info">
        <div className="profile-row">
          <User size={16} />
          <span>{displayName}</span>
        </div>

        <div className="profile-row">
          <Mail size={16} />
          <span>{displayEmail}</span>
        </div>
      </div>

      <div className="profiles-list">
        <h4>Saved Profiles</h4>

        {profiles.length === 0 ? (
          <p className="muted-text">No saved profiles yet</p>
        ) : (
          profiles.map((profile) => {
            const isSelected =
              activeProfile &&
              (activeProfile.profileId === profile._id ||
                activeProfile.email === profile.email);

            return (
              <div key={profile._id} className="saved-profile-card">
                <div>
                  <strong>{profile.profileName}</strong>
                  <p>{profile.email || "No email"}</p>
                </div>

                <div style={{display:"flex", gap:"8px"}}>
                <button
                className={isSelected ? "soft-btn active-soft-btn" : "soft-btn"}
                onClick={() => handleSetActiveProfile(profile)}
              >
                {isSelected ? <Check size={15} /> : "Use"}
              </button>

              <button
                className="soft-btn"
                style={{color:"red"}}
                onClick={(e) => handleDeleteProfile(profile._id, e)}
              >
                <X size={15} />
              </button>
            </div>
              </div>
            );
          })
        )}
      </div>

      <button
        className="primary-btn full-width"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        <Plus size={16} />
        Add Another Profile
      </button>

      {showAddForm && (
        <form className="add-profile-form better-add-profile-form" onSubmit={handleAddProfile}>
          <div className="profile-form-head">
            <h4>New Profile</h4>
            <button
              type="button"
              className="icon-btn"
              onClick={() => setShowAddForm(false)}
            >
              <X size={16} />
            </button>
          </div>

          <input
            type="text"
            name="profileName"
            placeholder="Enter profile name"
            value={formData.profileName}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Enter profile email"
            value={formData.email}
            onChange={handleChange}
          />

          <button type="submit" className="dark-btn full-width">
            Save Profile
          </button>
        </form>
      )}

      {message && <p className="success-text">{message}</p>}
    </div>
  );
}

export default ProfileMenu;