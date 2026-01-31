import React from "react";
import { Icons } from "../components/Icons";

interface SuccessRewardsProps {
  onBack: () => void;
}

interface RewardTier {
  id: string;
  name: string;
  icon: string;
  requirement: string;
  percentage: string;
  rewards: string[];
}

interface Milestone {
  icon: string;
  title: string;
  reward: string;
}

export const SuccessRewards: React.FC<SuccessRewardsProps> = ({ onBack }) => {
  const rewardTiers: RewardTier[] = [
    {
      id: "couple",
      name: "Aura Couple",
      icon: "💑",
      requirement: "6+ months together, met on Aura",
      percentage: "5%",
      rewards: [
        "5% of combined subscriptions → Aura Love Fund",
        "Redeemable for dates, travel, or cash",
        "Verified Couple badge",
        "Free couples counseling AI feature",
      ],
    },
    {
      id: "engaged",
      name: "Aura Engaged",
      icon: "💍",
      requirement: "Engaged, met on Aura",
      percentage: "7%",
      rewards: [
        "7% of referred user subscriptions",
        "Featured in Success Stories",
        "$500-$1,000 wedding gift from Aura",
        "Exclusive engagement Moment feature",
        "Wedding planning partner discounts",
      ],
    },
    {
      id: "married",
      name: "Aura Married",
      icon: "👰",
      requirement: "Married, met on Aura",
      percentage: "10%",
      rewards: [
        "10% of referrals + quarterly bonuses",
        "Up to $5,000 wedding/honeymoon fund",
        "Lifetime free Premium subscriptions",
        "Annual anniversary gifts",
        "App ambassador opportunities",
        "Exclusive couples retreats invitation",
      ],
    },
  ];

  const milestones: Milestone[] = [
    { icon: "👶", title: "Aura Baby Bonus", reward: "$1,000 when first child is born" },
    { icon: "🌟", title: "Couple of the Month", reward: "Featured in app + romantic getaway" },
    { icon: "📈", title: "Referral Multiplier", reward: "Each successful referral increases your %" },
    { icon: "💝", title: "Give Back Option", reward: "Donate earnings to help other users" },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-4 py-6 pb-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white border border-warm-gray flex items-center justify-center"
          >
            <Icons.ChevronLeft className="w-5 h-5 text-text-main" />
          </button>
          <h1 className="text-2xl font-bold text-text-main">Success Rewards</h1>
        </div>

        {/* Header Section */}
        <div className="text-center mb-6">
          <span className="text-5xl mb-3 block">🏆</span>
          <h2 className="text-xl font-bold text-text-main mb-2">Success Rewards Program</h2>
          <p className="text-text-sec">
            We invest in love stories. Get rewarded for finding your forever person on Aura.
          </p>
        </div>

        {/* Why This Matters */}
        <div className="bg-white rounded-xl p-5 border border-warm-gray mb-6">
          <h3 className="font-bold text-text-main mb-2">Why We Do This</h3>
          <p className="text-sm text-text-sec leading-relaxed">
            Your success is our success. When you find love on Aura, we want to celebrate
            with you by giving back a portion of our revenue to help fund your journey together.
          </p>
        </div>

        {/* Reward Tiers */}
        <div className="space-y-4 mb-6">
          {rewardTiers.map((tier) => (
            <div
              key={tier.id}
              className="bg-white rounded-2xl p-5 border border-warm-gray"
            >
              {/* Tier Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{tier.icon}</span>
                <div>
                  <h3 className="font-bold text-text-main text-lg">{tier.name}</h3>
                  <p className="text-primary font-semibold">{tier.percentage} Revenue Share</p>
                </div>
              </div>

              {/* Requirement */}
              <div className="bg-cream rounded-xl p-3 mb-4">
                <p className="text-xs font-semibold text-text-sec uppercase mb-1">Requirements</p>
                <p className="text-sm font-medium text-text-main">{tier.requirement}</p>
              </div>

              {/* Rewards */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-primary uppercase mb-2">Your Rewards</p>
                <div className="space-y-2">
                  {tier.rewards.map((reward, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span className="text-sm text-text-main">{reward}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              <button className="w-full py-3 bg-primary text-white font-semibold rounded-xl">
                Apply for This Tier
              </button>
            </div>
          ))}
        </div>

        {/* Additional Milestones */}
        <div className="mb-6">
          <h3 className="font-bold text-text-main text-lg mb-4">Additional Milestone Bonuses</h3>
          <div className="space-y-3">
            {milestones.map((milestone, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 bg-white rounded-xl p-4 border border-warm-gray"
              >
                <span className="text-3xl">{milestone.icon}</span>
                <div>
                  <h4 className="font-semibold text-text-main">{milestone.title}</h4>
                  <p className="text-sm text-text-sec">{milestone.reward}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/10 rounded-2xl p-6 text-center">
          <p className="text-text-main mb-4">
            Ready to start your love story? Match with someone special and you could be
            earning rewards in just 6 months!
          </p>
          <button className="px-8 py-3 bg-primary text-white font-bold rounded-xl">
            Start Matching Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessRewards;
