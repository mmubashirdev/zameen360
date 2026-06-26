import { useEffect, useState } from "react";
import {
  X,
  Star,
  Zap,
  Crown,
  Check,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { paymentService, type FeaturedPlan } from "../services/payment.service";

interface Props {
  propertyId: number;
  propertyTitle: string;
  onClose: () => void;
}

const PLAN_ICONS: Record<string, LucideIcon> = {
  basic: Star,
  premium: Zap,
  elite: Crown,
};

const PLAN_COLORS: Record<string, string> = {
  basic: "from-blue-500 to-blue-700",
  premium: "from-purple-500 to-purple-700",
  elite: "from-yellow-500 to-yellow-700",
};

const FeaturePropertyModal = ({
  propertyId,
  propertyTitle,
  onClose,
}: Props) => {
  const [plans, setPlans] = useState<Record<string, FeaturedPlan>>({});
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelected] = useState<string>("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setLoading(true);
    paymentService
      .getPlan()
      .then(setPlans)
      .catch(() => toast.error("Failed to load plans. Please try again later."))
      .finally(() => setLoading(false));
  }, []);

  console.log("Selected plan:", selectedPlan);
  const handleCheckout = async () => {
    setProcessing(true);
    try {
      const checkoutUrl = await paymentService.createCheckout(
        propertyId,
        selectedPlan,
      );
      window.location.href = checkoutUrl;
    } catch (error: any) {
      toast.error("Failed to create checkout. Please try again later.", error);
    } finally {
      setProcessing(false);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
    }).format(amount);
  };
  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-linear-to-r from-blue-600 to-purple-600 px-6 py-5 flex items-start justify-between text-white">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Star size={22} className="fill-yellow-300 text-yellow-300" />
                Feature Your Property
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                Get 5x more views • Appear at the top of search results
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {/* Property name */}
            <div className="bg-gray-50 rounded-lg px-4 py-3 mb-5">
              <p className="text-xs text-gray-500">Featuring property:</p>
              <p className="font-semibold text-gray-900 mt-0.5">
                {propertyTitle}
              </p>
            </div>

            {/* Plans */}
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-blue-600" size={32} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(plans).map(([key, plan]) => {
                  const Icon = PLAN_ICONS[key] || Star;
                  const isSelected = selectedPlan === key;
                  const isPopular = key === "premium";

                  return (
                    <div
                      key={key}
                      onClick={() => setSelected(key)}
                      className={`relative cursor-pointer rounded-xl border-2 p-5 transition-all ${
                        isSelected
                          ? "border-blue-600 shadow-lg scale-[1.02]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {isPopular && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-linear-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold uppercase px-3 py-0.5 rounded-full">
                          Most Popular
                        </span>
                      )}

                      <div
                        className={`w-12 h-12 rounded-xl bg-linear-to-br ${PLAN_COLORS[key]} flex items-center justify-center text-white mb-3`}
                      >
                        <Icon size={22} />
                      </div>

                      <h3 className="font-bold text-gray-900 mb-1">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-3 min-h-10">
                        {plan.description}
                      </p>

                      <div className="mb-3">
                        <span className="text-2xl font-bold text-gray-900">
                          PKR {formatPrice(plan.amount)}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          / {plan.duration} days
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-gray-600">
                        <div className="flex items-start gap-1.5">
                          <Check
                            size={12}
                            className="text-green-600 mt-0.5 shrink-0"
                          />
                          <span>Top placement for {plan.duration} days</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <Check
                            size={12}
                            className="text-green-600 mt-0.5 shrink-0"
                          />
                          <span>"⭐ Featured" badge</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <Check
                            size={12}
                            className="text-green-600 mt-0.5 shrink-0"
                          />
                          <span>5x more visibility</span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Test card info */}
            <div className="mt-5 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-xs text-blue-800">
              <p className="font-semibold mb-1">💳 Test Mode</p>
              <p>
                Card:{" "}
                <code className="bg-blue-100 px-1 py-0.5 rounded">
                  4242 4242 4242 4242
                </code>
              </p>
              <p>Expiry: any future date • CVC: any 3 digits • ZIP: any</p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between bg-gray-50">
            <p className="text-xs text-gray-500">
              🔒 Secure payment via Stripe • Cancel anytime
            </p>
            <button
              onClick={handleCheckout}
              disabled={processing || loading}
              className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {processing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  <Star size={16} />
                  Continue to Payment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeaturePropertyModal;
