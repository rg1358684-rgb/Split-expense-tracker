import { useState } from "react";
import {
  LogOut,
  StickyNote,
  PlusCircle,
  UserCircle2,
  Wallet,
} from "lucide-react";
import ProfileMenu from "./ProfileMenu";

function Navbar({ onOpenNotes, onCreateGroup }) {
  const [showProfile, setShowProfile] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const activeProfile =
    JSON.parse(localStorage.getItem("activeProfile")) || user;

  const userName =
    activeProfile?.profileName ||
    activeProfile?.name ||
    localStorage.getItem("userName") ||
    "User";

  const userEmail =
    activeProfile?.email ||
    localStorage.getItem("userEmail") ||
    "";

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("activeProfile");
    window.location.href = "/login";
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button
          className="icon-btn"
          onClick={() => setShowProfile(!showProfile)}
        >
          <UserCircle2 size={26} />
        </button>

        <ProfileMenu
          isOpen={showProfile}
          userName={userName}
          userEmail={userEmail}
          onClose={() => setShowProfile(false)}
        />
      </div>

      <div className="brand-title">
        <Wallet size={22} />
        <span>SplitEase</span>
      </div>

      <div className="topbar-actions">
        <button className="soft-btn" onClick={onOpenNotes}>
          <StickyNote size={18} />
          <span>Notes</span>
        </button>

        <button className="soft-btn" onClick={onCreateGroup}>
          <PlusCircle size={18} />
          <span>New Group</span>
        </button>

        <button className="dark-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Navbar;