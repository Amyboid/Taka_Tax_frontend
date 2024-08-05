import { useAtom } from "jotai"; 
import { amountAtom, purposeAtom } from "./states";
 
export default function ExpenseInput() {
  const [_amount, setAmount] = useAtom(amountAtom);
  const [_purpose,setPurpose] = useAtom(purposeAtom);   

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseInt(e.target.value) || 0);
  };
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPurpose(e.target.value);
  }; 
 
  return (
    <>
      <label htmlFor="amount">Amount</label>
      <input
        type="number"
        name="amount"
        placeholder="In Rupees"
        aria-label="In Rupees"
        onChange={handleInputChange}
        required
      />
      <label htmlFor="purpose">Purpose</label>
      <textarea
        required
        name="purpose"
        placeholder="Describe what are you spending for"
        aria-label="Describe what are you spending for"
        onChange={handleTextAreaChange}
      ></textarea>
    </>
  );
}
