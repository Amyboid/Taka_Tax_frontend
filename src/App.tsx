import "./App.css";
import ExpenseHistoryView from "./views/ExpenseHistoryView";
import ExpenseSplit from "./views/ExpenseSplit";
import ExpenseView from "./views/ExpenseView";
import { Link, Route } from "wouter";

function App() {
  const urls = [
    ["home", "/"],
    ["history", "/history"],
    ["expense", "/expense"],
  ];

  return (
    <>
      <Route path="/" component={ExpenseView} />
      <Route path="/history" component={ExpenseHistoryView} />
      <Route path="/expense">
        <ExpenseSplit username={localStorage.getItem("payer")} />
      </Route>
      <Nav links={urls} />
    </>
  );
}

function Nav({ links }: any) {
  interface Styles {
    [key: string]:
      | string
      | "absolute"
      | "relative"
      | "fixed"
      | "sticky"
      | "static"
      | "inherit";
  }
  const styles: Styles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "calc(100vw - 3.2rem)",
    height: "50px",
    background: "#8a8a8a",
    position: "fixed",
    bottom: "2rem",
    left: "1.6rem",
    margin: "0",
    padding: "0",
    borderRadius: "12px",
  };

  
  return (
    <ul style={styles}>
      {links.map((e:any, key:any) => (
        <li
          style={{
            listStyleType: "none",
          }}
          key={key}
        >
          <Link
            style={{
              color: "white",
            }}
            href={e[1]}
          >
            {e[0]}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default App;
