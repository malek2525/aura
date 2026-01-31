import React, { useState } from "react";
import { Icons } from "../components/Icons";

interface SubscriptionPlansProps {
  onBack: () => void;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  popular?: boolean;
  features: string[];
  limitations?: string[];
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ onBack }) => {
  const [selectedPlan, setSelectedPlan] = useState("plus");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const plans: Plan[] = [
    {
      id: "free",
      name: "Free",
      price: 0,
      features: [
        "Basic profile creation",
        "Aura learns from 10 conversations",
        "5 Aura matches per month",
        "View 1 Aura conversation",
        "Limited games (1-2)",
        "View Moments feed only",
      ],
      limitations: [
        "No unlimited Aura learning",
        "Cannot post Moments",
        "No advanced features",
      ],
    },
    {
      id: "standard",
      name: "Aura Standard",
      price: 19.99,
      features: [
        "Unlimited Aura learning",
        "20 Aura matches per month",
        "See all Aura conversations",
        "Full access to all games",
        "Post 2 Moments per month",
        "Priority matching queue",
        "Basic compatibility scores",
        "Undo last swipe",
      ],
    },
    {
      id: "plus",
      name: "Aura Plus",
      price: 34.99,
      popular: true,
      features: [
        "Unlimited Aura matches 24/7",
        "Advanced personality insights",
        "See who liked you first",
        "Priority Aura Boost",
        "Unlimited Moments posting",
        "Exclusive community events",
        "Video call features",
        "Advanced filters",
        "Premium games",
        "Read receipts",
      ],
    },
    {
      id: "elite",
      name: "Aura Elite",
      price: 79.99,
      features: [
        "Personal AI relationship coach",
        "Early access to new features",
        "Custom Aura training",
        "AI Concierge date planning",
        "Ad-free experience",
        "Verified Elite badge",
        "Monthly insights reports",
        "White-glove support",
      ],
    },
  ];

  const getAnnualPrice = (monthlyPrice: number) => {
    if (monthlyPrice === 0) return 0;
    return (monthlyPrice * 12 * 0.8).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white border border-warm-gray flex items-center justify-center"
          >
            <Icons.ChevronLeft className="w-5 h-5 text-text-main" />
          </button>
          <h1 className="text-2xl font-bold text-text-main">Choose Your Plan</h1>
        </div>

        {/* Subtitle */}
        <p className="text-text-sec text-center mb-6">
          Unlock the full power of Aura's AI matching
        </p>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-full p-1 border border-warm-gray inline-flex">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                billingCycle === "monthly"
                  ? "bg-primary text-white"
                  : "text-text-sec"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                billingCycle === "annual"
                  ? "bg-primary text-white"
                  : "text-text-sec"
              }`}
            >
              Annual (Save 20%)
            </button>
          </div>
        </div>

        {/* Annual Discount Banner */}
        {billingCycle === "annual" && (
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6 text-center">
            <p className="text-primary font-semibold">Save 20% with Annual Plans</p>
            <p className="text-sm text-text-sec">Get 2 months free</p>
          </div>
        )}

        {/* Plans */}
        <div className="space-y-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative bg-white rounded-2xl p-5 border-2 transition-all cursor-pointer ${
                selectedPlan === plan.id
                  ? "border-primary shadow-lg"
                  : "border-warm-gray"
              } ${plan.popular ? "ring-2 ring-primary/20" : ""}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}

              {/* Plan Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-text-main">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold text-text-main">
                      ${billingCycle === "annual" ? getAnnualPrice(plan.price) : plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-sm text-text-sec">
                        /{billingCycle === "annual" ? "year" : "mo"}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === plan.id
                      ? "border-primary bg-primary"
                      : "border-warm-gray"
                  }`}
                >
                  {selectedPlan === plan.id && (
                    <Icons.Check className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Icons.Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-text-main">{feature}</span>
                  </div>
                ))}
                {plan.limitations?.map((limitation, idx) => (
                  <div key={`limit-${idx}`} className="flex items-start gap-2">
                    <Icons.X className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-text-sec">{limitation}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Subscribe Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-cream border-t border-warm-gray">
          <div className="max-w-2xl mx-auto">
            <button className="w-full py-4 bg-primary text-white font-bold rounded-xl">
              {selectedPlan === "free" ? "Continue with Free" : "Subscribe Now"}
            </button>
            <p className="text-xs text-text-sec text-center mt-2">
              Cancel anytime. Terms apply.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
