import { FormEvent, ForwardedRef, forwardRef, useEffect, useRef, useState } from "react";
import ChoosePerson from "./ChoosePerson";
import ExpenseInput from "./ExpenseInput";
import { amountAtom, purposeAtom, splitsAtom } from "./states";
import { useAtom } from "jotai";

export default function ExpenseView() {
  const [fillUser, setFillUser] = useState(true);
  const [splits, _setSplits] = useAtom(splitsAtom);
  const [amount, _setAmount] = useAtom(amountAtom);
  const [purpose, _setPurpose] = useAtom(purposeAtom);
  const [error, setError] = useState("");
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.getItem("isUserSet") == "true" ? setFillUser(false) : "" ;
  }, [])

  const storeData = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isOnline = await checkConnection();
    console.log("is", isOnline);

    setError((_) => "");

    if (amount <= 0) {
      setError((error) => error + "no amount is specified");
      return;
    }
    if (purpose == "") {
      setError((error) => error + "no purpose is specified");
      return;
    }
    if (splits.length === 0) {
      setError((error) => error + "no split is specified");
      return;
    }

    const payer = localStorage.getItem("payer")!;
    const expenses = JSON.parse(localStorage.getItem("Expenses") || "[]");
    console.log("Existing expenses:");
    console.table(expenses);
    let updatedExpenses = expenses;

    let newExpense: Expense;

    if (isOnline) {
      newExpense = {
        amount: amount,
        purpose: purpose,
        splits: splits,
        payer: payer,
      };

      const copyOfExpense = JSON.parse(JSON.stringify(expenses));
      const notSyncedExpenses = copyOfExpense.filter(
        (e: Expense) => "isSynced" in e
      );
      console.log("Not Synced Expenses:");
      console.table(notSyncedExpenses);

      const syncQueue = notSyncedExpenses.map((e: Expense) => {
        delete e.isSynced;
        return e;
      });
      syncQueue.push(newExpense);
      console.log("que", syncQueue);

      fetch("/api/addexpenses", {
        method: "POST",
        body: JSON.stringify(syncQueue),
      })
        .then((e) => {
          if (e.status === 200) updatedExpenses = copyOfExpense;
          else newExpense.isSynced = false;
        })
        .catch((error) => {
          newExpense.isSynced = false;
          console.log(error);
        });
    } else {
      newExpense = {
        amount: amount,
        purpose: purpose,
        splits: splits,
        payer: payer,
        isSynced: false,
      };
    }

    console.log("expense to be set:", newExpense);

    localStorage.setItem(
      "Expenses",
      JSON.stringify([...updatedExpenses, newExpense])
    );
    const setexpenses = JSON.parse(localStorage.getItem("Expenses") || "[]");
    console.log("expenses after set:", setexpenses);

    (toastRef.current as HTMLDivElement).classList.add("toast-in");
    setTimeout(() => {
      (toastRef.current as HTMLDivElement).classList.remove("toast-in");
    }, 600);

    (e.target as HTMLFormElement).reset();
  };
  // useEffect(() => {
  //   console.log("splits: ", splits);
  // }, [splits]);

  return fillUser ? (
    <div>
      <h2>who are you 🤔</h2>
      <input type="text" />
      <button
        onClick={(e) => {
          setFillUser(false);
          localStorage.setItem("isUserSet", "true");
          localStorage.setItem(
            "payer",
            (
              (e.target as HTMLButtonElement)
                .previousElementSibling as HTMLInputElement
            ).value.toUpperCase()
          );
        }}
      >
        yoo
      </button>
    </div>
  ) : (
    <form onSubmit={storeData}>
      <ExpenseInput />
      <ChoosePerson />
      <div
        style={{ marginTop: "12px", color: "#cc0000", transition: "all 1s" }}
      >
        {error}
      </div>
      <button className="pico-background-lime-50 split-expense-btn">
        Split Expense
      </button>

      <AddToast ref={toastRef} />
    </form>
  );
}

const AddToast = forwardRef(function AddToast(
  _props,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      style={{
        display: "block",
        width: "30vw",
        lineHeight: "2.4rem",
        background: "#8a8a8a55",
        position: "absolute",
        top: "-2.4rem",
        left: "35vw",
        textAlign: "center",
        borderRadius: "12px",
        transition: "top 300ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      Added &nbsp; 🎉
    </div>
  );
});

async function checkConnection() {
  try {
    await fetch("https://example.com", { mode: "no-cors" });
    return true;
  } catch (error) {
    // console.log(error);
    return false;
  }
}

type Expense = {
  amount: number;
  purpose: string;
  splits: string[];
  payer: string;
  isSynced?: false;
};
