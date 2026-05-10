import { useEffect, useState } from "react";
import { X, StickyNote } from "lucide-react";

function NotesPanel({ isOpen, onClose, selectedGroupId }) {
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ✅ Har baar fresh localStorage se lo
  const user = JSON.parse(localStorage.getItem("user"));
  const activeProfile = JSON.parse(localStorage.getItem("activeProfile"));
  const activeUserId = user?._id;
  const activeProfileId = activeProfile?.profileId || null;

  useEffect(() => {
    if (!isOpen) return;

    // ✅ useEffect ke andar fresh lo
    const freshUser = JSON.parse(localStorage.getItem("user"));
    const freshProfile = JSON.parse(localStorage.getItem("activeProfile"));
    const freshUserId = freshUser?._id;
    const freshProfileId = freshProfile?.profileId || null;

    const loadNotes = async () => {
      try {
        setLoading(true);
        setMessage("");

        if (selectedGroupId && selectedGroupId !== "undefined" && selectedGroupId !== "") {
          const res = await fetch(
            `http://localhost:5000/api/groups/${selectedGroupId}`
          );
          const data = await res.json();
          setNotes(data.notes || "");
        } else {
          const url = freshProfileId
            ? `http://localhost:5000/api/notes?userId=${freshUserId}&profileId=${freshProfileId}`
            : `http://localhost:5000/api/notes?userId=${freshUserId}&profileId=null`;

          console.log("Loading notes URL:", url); // Debug

          const res = await fetch(url);
          const data = await res.json();

          console.log("Notes data:", data); // Debug

          if (Array.isArray(data) && data.length > 0) {
            const noteWithoutGroup = data.find((note) => !note.groupId);
            setNotes(noteWithoutGroup?.content || "");
          } else {
            setNotes("");
          }
        }
      } catch (error) {
        console.log(error);
        setMessage("Failed to load notes");
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [isOpen, selectedGroupId]);

  const handleSaveNotes = async () => {
    try {
      setSaving(true);
      setMessage("");

      // ✅ Save karte waqt bhi fresh lo
      const freshUser = JSON.parse(localStorage.getItem("user"));
      const freshProfile = JSON.parse(localStorage.getItem("activeProfile"));
      const freshUserId = freshUser?._id;
      const freshProfileId = freshProfile?.profileId || null;

      console.log("Saving note with profileId:", freshProfileId); // Debug

      if (selectedGroupId && selectedGroupId !== "undefined" && selectedGroupId !== "") {
        const response = await fetch(
          `http://localhost:5000/api/groups/${selectedGroupId}/notes`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ notes, userId: freshUserId }),
          }
        );

        if (response.ok) {
          setMessage("Notes saved successfully");
        } else {
          setMessage("Failed to save notes");
        }
      } else {
        const response = await fetch(`http://localhost:5000/api/notes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: freshUserId,
            profileId: freshProfileId,
            groupId: null,
            content: notes,
          }),
        });

        const data = await response.json();
        console.log("Save response:", data); // Debug

        if (response.ok) {
          setMessage("Notes saved successfully");
        } else {
          setMessage("Failed to save notes");
        }
      }
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="notes-overlay">
      <div className="notes-panel">
        <div className="notes-header">
          <div className="notes-title">
            <StickyNote size={20} />
            <h3>{selectedGroupId ? "Group Notes" : "Personal Notes"}</h3>
          </div>

          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <p className="success-text">Loading notes...</p>
        ) : (
          <>
            <textarea
              placeholder="Write your notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="notes-textarea"
            />

            <button
              className="primary-btn full-width"
              onClick={handleSaveNotes}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Notes"}
            </button>

            {message && <p className="success-text">{message}</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default NotesPanel;