import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { splitsAtom } from "./states";

interface personProps {
  name: string;
  img: string;
}

function Person({ name, img }: personProps) {
  const [select, setSelect] = useState(false);
  const [splits, setSplits] = useAtom(splitsAtom);
  function handleClick() {
    setSelect(!select);
    if (!select) {
      setSplits([...splits, name]);
    } else {
      setSplits(splits.filter((person) => person !== name));
    }
  }

  return (
    <div id="each-person">
      <img
        src={img}
        alt={name}
        className={select ? "person update-person" : "person"}
        onClick={handleClick}
      />
    </div>
  );
}

export default function ChoosePerson() {
  const [_splits, setSplits] = useAtom(splitsAtom);
  useEffect(()=>{
    setSplits([]);
  },[])

  return (
    <div className="choose-person-root">
      <Person name="MD" img="mm.jpg" />
      <Person name="BB" img="bb.jpg" />
      <Person name="SH" img="ss.jpg" />
    </div>
  );
}



