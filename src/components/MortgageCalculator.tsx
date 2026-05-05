"use client";

import { useMemo, useState } from "react";

export default function MortgageCalculator() {
  const [propertyPrice, setPropertyPrice] = useState(10000000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [loanTerm, setLoanTerm] = useState(15);
  const [interestRate, setInterestRate] = useState(18);
  const [result, setResult] = useState<{
    monthly: number;
    total: number;
    interest: number;
  } | null>(null);

  const downPaymentAmount = useMemo(
    () => propertyPrice * (downPaymentPct / 100),
    [propertyPrice, downPaymentPct]
  );

  const calculate = () => {
    const principal = propertyPrice - downPaymentAmount;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;

    if (monthlyRate === 0) {
      const monthly = principal / numPayments;
      setResult({ monthly, total: principal, interest: 0 });
      return;
    }

    const monthly =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    const total = monthly * numPayments;
    const interest = total - principal;

    setResult({ monthly, total, interest });
  };

  const formatPKR = (amount: number) => {
    if (amount >= 10000000) return `PKR ${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `PKR ${(amount / 100000).toFixed(2)} Lac`;
    return `PKR ${amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Mortgage Calculator
      </h3>
      <p className="text-gray-500 text-sm mb-6">
        Estimate your monthly home loan payment in PKR
      </p>

      <div className="space-y-5">
        {/* Property Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Property Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
              PKR
            </span>
            <input
              type="number"
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              min={1000000}
              step={500000}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            ≈ {formatPKR(propertyPrice)}
          </p>
        </div>

        {/* Down Payment */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-semibold text-gray-700">
              Down Payment
            </label>
            <span className="text-sm font-bold text-emerald-600">
              {downPaymentPct}% ({formatPKR(downPaymentAmount)})
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={50}
            step={5}
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(Number(e.target.value))}
            className="w-full accent-emerald-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>10%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Loan Term & Interest Rate */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Loan Term
            </label>
            <select
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              {[5, 10, 15, 20, 25].map((yr) => (
                <option key={yr} value={yr}>
                  {yr} Years
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Interest Rate (% p.a.)
            </label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              min={5}
              max={25}
              step={0.5}
            />
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculate}
          className="w-full py-3 rounded-xl font-bold text-white text-base transition-colors"
          style={{ backgroundColor: "#059669" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#047857")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#059669")
          }
        >
          Calculate Monthly Payment
        </button>
      </div>

      {/* Results */}
      {result && (
        <div
          className="mt-6 rounded-xl p-5"
          style={{ backgroundColor: "#f0fdf4" }}
        >
          <h4 className="text-base font-bold text-gray-800 mb-4">
            📊 Loan Summary
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center bg-white rounded-lg p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Monthly Payment</p>
              <p className="text-lg font-bold text-emerald-700">
                {formatPKR(result.monthly)}
              </p>
            </div>
            <div className="text-center bg-white rounded-lg p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Total Payment</p>
              <p className="text-lg font-bold text-gray-800">
                {formatPKR(result.total)}
              </p>
            </div>
            <div className="text-center bg-white rounded-lg p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Total Interest</p>
              <p className="text-lg font-bold text-amber-600">
                {formatPKR(result.interest)}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            * Estimates only. Consult your bank for exact figures.
          </p>
        </div>
      )}
    </div>
  );
}
