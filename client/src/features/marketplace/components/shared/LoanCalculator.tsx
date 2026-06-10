// components/property-details/shared/LoanCalculator.tsx
import { useState, useEffect } from "react";
import { Calculator } from "lucide-react";

interface Props {
  propertyPrice: string | null;
  downPayment: string | null;
}

const LoanCalculator = ({ propertyPrice, downPayment }: Props) => {
  const [price, setPrice] = useState(Number(propertyPrice) || 0);
  const [down, setDown] = useState(Number(downPayment) || 0);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(20);
  const [emi, setEmi] = useState(0);

  useEffect(() => {
    const principal = price - down;
    const monthlyRate = rate / 12 / 100;
    const months = years * 12;

    if (principal > 0 && monthlyRate > 0) {
      const calc = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
                   (Math.pow(1 + monthlyRate, months) - 1);
      setEmi(Math.round(calc));
    } else {
      setEmi(0);
    }
  }, [price, down, rate, years]);

  return (
    <div className="bg-white rounded-xl p-4 border shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <Calculator className="w-4 h-4" />
        Loan Calculator
      </h3>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-500">Price (PKR)</label>
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full border rounded-lg px-3 py-1.5 text-sm" />
        </div>
        <div>
          <label className="text-xs text-gray-500">Down Payment</label>
          <input type="number" value={down} onChange={(e) => setDown(Number(e.target.value))}
            className="w-full border rounded-lg px-3 py-1.5 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500">Rate %</label>
            <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-1.5 text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Years</label>
            <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-1.5 text-sm" />
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-500">Monthly EMI</div>
          <div className="text-xl font-bold text-blue-600">PKR {emi.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator;