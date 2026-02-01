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

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  onBack,
}) => {
  const [selectedPlan, setSelectedPlan] = useState("plus");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly",
  );

  const plans: Plan[] = [
    {
      id: "free",
      name: "Free",
      price: 0,
      features: [
        "Basic profile creation",
        "Aura learns from 10 conversations max",
        "5 Aura-to-Aura matches per month",
        "View 1 Aura conversation",
        "Limited access to games (1-2 games)",
        "View Moments feed",
        "Standard matching algorithm",
      ],
      limitations: [
        "No unlimited Aura learning",
        "Cannot post Moments",
        "No advanced features",
        "No priority matching",
      ],
    },
    {
      id: "standard",
      name: "Aura Standard",
      price: 14.99,
      features: [
        "Everything in Free, plus:",
        "Unlimited Aura learning from all conversations",
        "20 Aura-to-Aura matches per month",
        "See all Aura conversations before handoff",
        "Full access to all in-chat games",
        "Post 2 Moments per month (with partner consent)",
        "Priority in matching queue",
        "Basic compatibility scores",
        "Undo last swipe",
        "See when messages are read",
      ],
    },
    {
      id: "plus",
      name: "Aura Plus",
      price: 29.99,
      popular: true,
      features: [
        "Everything in Standard, plus:",
        "Unlimited Aura matches 24/7",
        "Advanced personality insights & compatibility reports",
        "See who liked you before swiping",
        "Aura Boost - priority in match queue",
        "Unlimited Moments posting",
        "Access to exclusive community events",
        "Video call features",
        "Advanced filters (education, interests, values)",
        "Premium in-chat games & customization",
        "Read receipts for all messages",
        "AI Date Planner with personalized suggestions",
      ],
    },
    {
      id: "elite",
      name: "Aura Elite",
      price: 59.99,
      features: [
        "Everything in Plus, plus:",
        "Personal AI relationship coach & conversation analysis",
        "Early access to all new features",
        "Custom Aura training on specific conversation styles",
        "AI Concierge mode - suggests date ideas & activities",
        "Completely ad-free experience",
        "Verified Elite badge on profile",
        "Monthly summary reports of dating patterns",
        "White-glove customer support",
        "Profile review & optimization by experts",
        "Priority customer service response",
      ],
    },
  ];

  const getAnnualPrice = (monthlyPrice: number) => {
    if (monthlyPrice === 0) return 0;
    return (monthlyPrice * 12 * 0.8).toFixed(2);
  };

  const getMonthlySavings = (monthlyPrice: number) => {
    if (monthlyPrice === 0) return 0;
    return (monthlyPrice * 2).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-cream pb-28">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white border border-warm-gray flex items-center justify-center"
          >
            <Icons.ChevronLeft className="w-5 h-5 text-text-main" />
          </button>
          <h1 className="text-2xl font-bold text-text-main">
            Choose Your Plan
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-text-sec text-center mb-4">
          Unlock the full power of Aura's AI matching
        </p>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-4">
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
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mb-4 text-center max-w-md mx-auto">
            <p className="text-primary font-semibold text-sm">
              💎 Save 20% with Annual Plans
            </p>
            <p className="text-xs text-text-sec">
              Get 2 months free when you commit to a year
            </p>
          </div>
        )}

        {/* Horizontal Scrollable Plans */}
        <div className="overflow-x-auto -mx-4 px-4 pb-4">
          <div className="flex gap-4 min-w-max">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative bg-white rounded-2xl p-5 border-2 transition-all cursor-pointer w-80 flex-shrink-0 ${
                  selectedPlan === plan.id
                    ? "border-primary shadow-lg scale-105"
                    : "border-warm-gray hover:border-primary/50"
                } ${plan.popular ? "ring-2 ring-primary/20" : ""}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    MOST POPULAR
                  </div>
                )}

                {/* Selection Indicator */}
                <div className="absolute top-4 right-4">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
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

                {/* Plan Header */}
                <div className="mb-4 pr-8">
                  <h3 className="text-xl font-bold text-text-main mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-text-main">
                      $
                      {billingCycle === "annual"
                        ? getAnnualPrice(plan.price)
                        : plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-sm text-text-sec">
                        /{billingCycle === "annual" ? "year" : "mo"}
                      </span>
                    )}
                  </div>
                  {/* Show savings for annual */}
                  {billingCycle === "annual" && plan.price > 0 && (
                    <p className="text-xs text-green-600 font-semibold mt-1">
                      Save ${getMonthlySavings(plan.price)} per year
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-warm-gray mb-4"></div>

                {/* Features - Scrollable */}
                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-2">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Icons.Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span
                        className={`text-sm leading-relaxed ${
                          feature.includes("Everything in")
                            ? "font-semibold text-text-main"
                            : "text-text-main"
                        }`}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                  {plan.limitations?.map((limitation, idx) => (
                    <div
                      key={`limit-${idx}`}
                      className="flex items-start gap-2"
                    >
                      <Icons.X className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-text-sec leading-relaxed">
                        {limitation}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Hint */}
        <div className="text-center mt-2 mb-4">
          <p className="text-xs text-text-sec">👈 Swipe to see all plans 👉</p>
        </div>

        {/* What Makes Aura Different */}
        <div className="mt-6 bg-white rounded-xl p-4 border border-warm-gray max-w-2xl mx-auto">
          <h3 className="font-bold text-text-main mb-3 flex items-center gap-2">
            <span className="text-lg">✨</span>
            What Makes Aura Different?
          </h3>
          <ul className="space-y-2 text-sm text-text-sec">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                AI Aura agents break the ice for you - perfect for introverts
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Pre-screened compatibility before you even chat</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Moments feature with mutual consent - no fake posts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>In-chat games to keep conversations fun and natural</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Fixed Subscribe Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-cream border-t border-warm-gray shadow-lg">
        <div className="max-w-2xl mx-auto">
          <button className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary/90 transition-colors">
            {selectedPlan === "free"
              ? "Continue with Free"
              : `Subscribe to ${plans.find((p) => p.id === selectedPlan)?.name}`}
          </button>
          <p className="text-xs text-text-sec text-center mt-2">
            Cancel anytime. No hidden fees. Terms apply.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
