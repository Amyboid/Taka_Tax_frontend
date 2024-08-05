import { useEffect, useState } from "react";

function DetailedExpenseSplit({ name, pabe, debe }:any) {
  return (
    <div className="detailed-split">
      <div className="money-to-give money-split">{pabe}</div>
      <span>
        <p>...................</p>
      </span>
      <div className="person-name">{name}</div>
      <span>
        <p>...................</p>
      </span>
      <div className="money-to-get money-split">{debe}</div>
    </div>
  );
}



export default function ExpenseSplit({ username }:any) {
  const [ users, setUsers ] = useState<string[]>([]);
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

  useEffect(() => {
    async function getUser() {
      const response:{code:string} | [{name:string, shortcode:string}] = (await (await fetch("/api/users")).json());
      if ("code" in response) {
        return [];
      }
      setUsers(response.map((e) => e.shortcode));
    }
    getUser()
  },[])
  const names = users.filter((user) => user !== username);

  let rpabe = 0;
  let rdebe = 0;

  const lits:any[] = [];

  names.map((name) => {
    // console.log("for: " + name);

    let pabe = 0;
    let debe = 0;
    const expenses = JSON.parse(localStorage.getItem("Expenses") || "[]");
    for (const expense of expenses) { 
        // const ini = [...expense.splits, expense.payer]
        //modified
        if (!expense.splits.includes(name) && (name !== expense.payer)) continue;
        const amt = Math.round(expense.amount / expense.splits.length);
        if (expense.payer == username) {
            debe += amt;
        }
        //new added
        if (!expense.splits.includes(name) && (name === expense.payer) && expense.splits.includes(username)) { 
            pabe += amt; 
        }
        //modified
        if (expense.payer == name && expense.splits.includes(username) && expense.splits.includes(name)) {
            pabe += amt;
        }
    }
    lits.push([name, pabe, debe]);
    rpabe += pabe;
    rdebe += debe;

});

  // names.map((name) => {
  //   console.log("for: " + name);

  //   let pabe = 0;
  //   let debe = 0;

  //   const expenses = JSON.parse(localStorage.getItem("Expenses") || "[]");
  //   for (const expense of expenses) {
  //     const ini = [...expense.splits, expense.payer]
  //     if (!expense.splits.includes(name)) continue;
  //     const amt = Math.round(expense.amount / expense.splits.length);
  //     if (expense.payer == username) {
  //       debe += amt;
  //     }
  //     if (expense.payer == name && expense.splits.includes(username)) {
  //       pabe += amt;
  //     }
  //   }
  //   lits.push([name, pabe, debe]);
  //   rpabe += pabe;
  //   rdebe += debe;
  // });

  console.log(lits);
  console.log("ex init");

  if (loading) {
    return (
      <div>
        <h2>Details</h2>
        <p>loading....</p>
      </div>
    );
  }

  return (
    <>
      <div className="expense-split">
        <h1 className="pay-money">{rpabe}</h1>
        <div className="line"></div>
        <h1 className="get-money">{rdebe}</h1>
      </div>
      <div className="detailed-view">
        <h2>Details</h2>
        {lits.map((e) => {
          return (
            <DetailedExpenseSplit
              key={e[0]}
              name={e[0]}
              pabe={e[1]}
              debe={e[2]}
            />
          );
        })}
      </div>
    </>
  );
}
