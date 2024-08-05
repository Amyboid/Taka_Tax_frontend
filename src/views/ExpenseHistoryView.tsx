import { useEffect, useState } from "react";

export default function ExpenseHistoryView() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/expenses")
      .then((e) => e.json())
      .then((e) => {
        if (!("code" in e)) {
          let existingExpenses = JSON.parse(
            localStorage.getItem("Expenses") || "[]"
          );
          existingExpenses = existingExpenses.filter((e:any) => "isSynced" in e);
          localStorage.setItem(
            "Expenses",
            JSON.stringify([...e, ...existingExpenses])
          );
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, []);

  const expenses = JSON.parse(localStorage.getItem("Expenses") || "[]");

  if (loading) {
    return (
      <div>
        <h2>Expenditures</h2>
        <p>loading....</p>
      </div>
    );
  }
  
  return (
    <div>
      <h2>Expenditures</h2>
      <div id="expense-list">
        {expenses.map((e:any, i:any) => (
          <Expense
            amt={e.amount}
            purpose={e.purpose}
            splits={e.splits}
            key={i}
          />
        ))}
      </div>
    </div>
  );
}

function Expense({ amt, purpose, splits }:any) {
  return (
    <div className="expense">
      <div id="amount">{amt}</div>
      <div id="purpose">{purpose}</div>
      <div id="all-payers">
        {splits.map((e:any, i:any) => (
          <div className="splits" key={i}>
            {e}
          </div>
        ))}
      </div>
    </div>
  );
}
