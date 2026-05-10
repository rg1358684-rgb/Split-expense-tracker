import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ReceiptText } from "lucide-react";

function AddExpense() {
  const navigate = useNavigate();
  const { id, expenseId } = useParams();
  const isEditMode = Boolean(expenseId);

  const [group, setGroup] = useState(null);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    paidBy: "",
    splitType: "equally",
    splitAmong: [],
    date: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?._id;

        if (!userId) {
          setMessage("User not found. Please login again.");
          return;
        }

        const groupRes = await fetch(
          `http://localhost:5000/api/groups/${id}?userId=${userId}`
        );
        const groupDataRes = await groupRes.json();

        if (!groupRes.ok) {
          setMessage(groupDataRes.error || groupDataRes.message || "Failed to load group");
          return;
        }

        const groupData = groupDataRes.group || groupDataRes;
        const members = groupData?.members || [];
        setGroup(groupData);

        if (isEditMode) {
          const expenseRes = await fetch(
            `http://localhost:5000/api/expenses/${expenseId}?userId=${userId}`
          );
          const expenseData = await expenseRes.json();

          if (!expenseRes.ok) {
            setMessage(expenseData.error || expenseData.message || "Failed to load expense");
            return;
          }

          setFormData({
            title: expenseData.title || "",
            amount: expenseData.amount || "",
            paidBy: expenseData.paidBy || members[0]?.name || "",
            splitType: expenseData.splitType || "equally",
            splitAmong:
              expenseData.splitType === "equally"
                ? members.map((member) => member.name)
                : expenseData.splitAmong || [],
            date: expenseData.date ? expenseData.date.slice(0, 10) : "",
          });
        } else {
          setFormData((prev) => ({
            ...prev,
            paidBy: members[0]?.name || "",
            splitAmong: members.map((member) => member.name),
          }));
        }
      } catch (err) {
        console.log(err);
        setMessage("Something went wrong while loading data");
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, expenseId, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "splitType") {
      if (value === "equally") {
        setFormData((prev) => ({
          ...prev,
          splitType: value,
          splitAmong: group?.members?.map((member) => member.name) || [],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          splitType: value,
          splitAmong: [],
        }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMemberToggle = (memberName) => {
    if (formData.splitType === "equally") return;

    const exists = formData.splitAmong.includes(memberName);

    if (exists) {
      setFormData((prev) => ({
        ...prev,
        splitAmong: prev.splitAmong.filter((item) => item !== memberName),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        splitAmong: [...prev.splitAmong, memberName],
      }));
    }
  };

  const selectedMembers =
    formData.splitType === "equally"
      ? group?.members?.map((member) => member.name) || []
      : formData.splitAmong;

  const perPerson = useMemo(() => {
    const total = Number(formData.amount);
    const count = selectedMembers.length;

    if (!total || count === 0) return 0;
    return (total / count).toFixed(2);
  }, [formData.amount, selectedMembers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (
      !formData.title ||
      !formData.amount ||
      !formData.paidBy ||
      !formData.date ||
      selectedMembers.length === 0
    ) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id;

      if (!userId) {
        setMessage("User not found. Please login again.");
        return;
      }

      const url = isEditMode
        ? `http://localhost:5000/api/expenses/${expenseId}`
        : "http://localhost:5000/api/expenses";

      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          groupId: id,
          title: formData.title,
          amount: Number(formData.amount),
          paidBy: formData.paidBy,
          splitType: formData.splitType,
          splitAmong: selectedMembers,
          date: formData.date,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(isEditMode ? "Expense updated successfully" : "Expense added successfully");

        setTimeout(() => {
          navigate(`/all-expenses/${id}`);
        }, 800);
      } else {
        setMessage(data.error || data.message || "Failed to save expense");
      }
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="simple-page">
      <div className="form-card">
        <div className="page-actions">
          <button className="back-btn" onClick={() => navigate(`/all-expenses/${id}`)}>
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>

          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/")}
          >
            <ReceiptText size={18} />
            <span>All Expenses</span>
          </button>
        </div>

        <div className="form-head">
          <div className="icon-bubble">
            <ReceiptText size={18} />
          </div>
          <h1>{isEditMode ? "Edit Expense" : "Add Expense"}</h1>
          <p>{group ? `Group: ${group.groupName}` : "Loading group..."}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="input-group">
              <label>Expense Name</label>
              <input
                type="text"
                name="title"
                placeholder="Enter expense name"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Paid By</label>
              <select
                name="paidBy"
                value={formData.paidBy}
                onChange={handleChange}
              >
                <option value="">Select member</option>
                {group?.members?.map((member, index) => (
                  <option key={index} value={member.name}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Split Type</label>
            <select
              name="splitType"
              value={formData.splitType}
              onChange={handleChange}
            >
              <option value="equally">Equally</option>
              <option value="selected">Among selected members</option>
            </select>
          </div>

          <div className="input-group">
            <label>Split Among</label>
            <div className="members-wrap">
              {group?.members?.map((member, index) => {
                const active = selectedMembers.includes(member.name);

                return (
                  <button
                    type="button"
                    key={index}
                    className={`member-chip ${active ? "member-chip-active" : ""}`}
                    onClick={() => handleMemberToggle(member.name)}
                  >
                    {member.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="split-preview">
            <p>Total Amount: ₹ {formData.amount || 0}</p>
            <p>Members Selected: {selectedMembers.length}</p>
            <p>Each Person Pays: ₹ {perPerson}</p>
          </div>

          {message && <p className="success-text">{message}</p>}

          <button type="submit" className="primary-btn full-width">
            {isEditMode ? "Update Expense" : "Add Expense"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddExpense;