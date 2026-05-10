import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ReceiptText, Trash2, Pencil } from "lucide-react";

function AllExpenses() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setMessage("");

        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?._id;

        if (!userId) {
          setMessage("User not found. Please login again.");
          setLoading(false);
          return;
        }

        const [groupRes, expenseRes] = await Promise.all([
          fetch(`http://localhost:5000/api/groups/${id}?userId=${userId}`),
          fetch(`http://localhost:5000/api/expenses/group/${id}?userId=${userId}`),
        ]);

        const groupData = await groupRes.json();
        const expenseData = await expenseRes.json();

        if (groupRes.ok) {
          setGroup(groupData.group || groupData);
        } else {
          setMessage(groupData.message || "Failed to load group");
        }

        if (expenseRes.ok) {
          setExpenses(Array.isArray(expenseData) ? expenseData : expenseData.expenses || []);
        } else {
          setMessage(expenseData.message || "Failed to load expenses");
        }
      } catch (error) {
        console.log(error);
        setMessage("Something went wrong while loading expenses");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAllData();
    }
  }, [id]);

  const totalAmount = useMemo(() => {
    return expenses.reduce((total, item) => total + Number(item.amount || 0), 0);
  }, [expenses]);

  const handleDelete = async (expenseId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
    if (!confirmDelete) return;

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id;

      if (!userId) {
        setMessage("User not found. Please login again.");
        return;
      }

      const res = await fetch(`http://localhost:5000/api/expenses/${expenseId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (res.ok) {
        setExpenses((prev) => prev.filter((item) => item._id !== expenseId));
        setMessage("Expense deleted successfully");
      } else {
        setMessage(data.message || "Failed to delete expense");
      }
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="simple-page">
      <div className="form-card wide-card">
        <div className="page-actions">
          <button className="back-btn" onClick={() => navigate("/")}>
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>

          <button
            className="primary-btn"
            onClick={() => navigate(`/add-expense/${id}`)}
          >
            Add New Expense
          </button>
        </div>

        <div className="form-head">
          <div className="icon-bubble">
            <ReceiptText size={18} />
          </div>
          <h1>All Expenses</h1>
          <p>{group ? `Group: ${group.groupName}` : "Loading group..."}</p>
        </div>

        <div className="split-preview">
          <p>Total Expenses: {expenses.length}</p>
          <p>Total Amount: ₹ {totalAmount}</p>
        </div>

        {message && <p className="success-text">{message}</p>}

        {loading ? (
          <p className="muted-text">Loading expenses...</p>
        ) : expenses.length === 0 ? (
          <div className="empty-expense-box">
            <p className="muted-text">No expenses added yet</p>
          </div>
        ) : (
          <div className="expense-scroll-wrap">
            <div className="expense-list">
              {expenses.map((expense) => (
                <div key={expense._id} className="expense-item">
                  <div className="expense-details">
                    <h3>{expense.title || "Untitled Expense"}</h3>
                    <p><strong>Amount:</strong> ₹ {expense.amount}</p>
                    <p><strong>Paid By:</strong> {expense.paidBy}</p>
                    <p>
                      <strong>Per Person:</strong> ₹{" "}
                      {expense.splitAmong?.length
                        ? (expense.amount / expense.splitAmong.length).toFixed(2)
                        : "0.00"}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {expense.date
                        ? new Date(expense.date).toLocaleDateString("en-IN")
                        : expense.createdAt
                        ? new Date(expense.createdAt).toLocaleDateString("en-IN")
                        : "N/A"}
                    </p>
                    <p><strong>Split Type:</strong> {expense.splitType || "Equal"}</p>
                    <p>
                      <strong>Split Among:</strong>{" "}
                      {expense.splitAmong?.length ? expense.splitAmong.join(", ") : "N/A"}
                    </p>
                  </div>

                  <div className="expense-actions">
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/edit-expense/${id}/${expense._id}`)}
                    >
                      <Pencil size={16} />
                      <span>Edit</span>
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(expense._id)}
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllExpenses;