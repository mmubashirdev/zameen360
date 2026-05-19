
const MortgageCalculator = () => {
  return (
    <div className="border rounded-xl p-5 bg-white">
      <h3 className="text-sm font-semibold text-gray-500 mb-4">
        MORTGAGE CALCULATOR
      </h3>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-600 block mb-1">
            Property Price (PKR)
          </label>
          <input
            type="text"
            defaultValue="125,000,000"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600 block mb-1">
            Down Payment (20%)
          </label>
          <input
            type="text"
            defaultValue="25,000,000"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600 block mb-1">
            Loan Amount
          </label>
          <input
            type="text"
            defaultValue="100,000,000"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600 block mb-1">
            Interest Rate (%)
          </label>
          <input
            type="text"
            defaultValue="11.5"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600 block mb-1">
            Loan Tenure
          </label>
          <select className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option>20 Years</option>
            <option>15 Years</option>
            <option>10 Years</option>
          </select>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-gray-500">Estimated Monthly Payment</p>
        <p className="text-xl font-bold text-blue-600">PKR 1,201,000</p>
        <a
          href="#"
          className="text-xs text-blue-600 hover:underline mt-2 inline-block"
        >
          View Full Mortgage Plan
        </a>
      </div>
    </div>
  );
};

export default MortgageCalculator;
