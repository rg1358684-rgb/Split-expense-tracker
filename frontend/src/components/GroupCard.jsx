import { Users, ChevronRight } from "lucide-react";

function GroupCard({ group, onClick, isSelected }) {
  return (
    <div
      className={`group-card ${isSelected ? "group-card-active" : ""}`}
      onClick={onClick}
    >
      <div className="group-card-top">
        <div>
          <h3>{group.groupName}</h3>
          <p>{group.currency || "INR - Indian Rupee"}</p>
        </div>

        <ChevronRight size={20} />
      </div>

      <div className="group-card-bottom">
        <div className="group-members">
          <Users size={16} />
          <span>{group.members?.length || 0} Members</span>
        </div>

        <span className="group-open-text">Open Group</span>
      </div>
    </div>
  );
}

export default GroupCard;