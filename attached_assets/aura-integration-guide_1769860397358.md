# Aura Dating App - Feature Integration Guide

## 🎯 IMPORTANT: Keep Your Current Color Scheme

**DO NOT change your existing app's colors, branding, or design system.**
This integration adds NEW FEATURES to your existing app using YOUR current styling.

---

## 📋 Features to Add

### 1. **Subscription Tiers Page**
### 2. **Success Rewards Program Section**
### 3. **Additional Revenue Features (In-App Purchases, Virtual Gifts)**
### 4. **Date Planner Feature**
### 5. **Monetization Settings/Admin Panel**

---

## 🔧 INTEGRATION INSTRUCTIONS FOR REPLIT

### STEP 1: Add New Routes/Pages

Create these new pages in your existing app structure:

```
/pages or /screens
├── SubscriptionPlans.jsx (NEW)
├── SuccessRewards.jsx (NEW)
├── DatePlanner.jsx (NEW)
├── Shop.jsx (NEW - for in-app purchases)
└── Settings.jsx (update to include subscription management)
```

---

## 📄 CODE TO ADD

### 1. SUBSCRIPTION PLANS PAGE (`SubscriptionPlans.jsx`)

**Where to add:** Create as a new screen/page accessible from Settings or Profile

**What it does:** Displays all 4 subscription tiers with your app's styling

```jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState('plus');

  // SUBSCRIPTION TIERS DATA
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      features: [
        'Basic profile creation',
        'Aura learns from 10 conversations',
        '5 Aura matches per month',
        'View 1 Aura conversation',
        'Limited games (1-2)',
        'View Moments feed only'
      ],
      limitations: [
        'No unlimited Aura learning',
        'Cannot post Moments',
        'No advanced features'
      ]
    },
    {
      id: 'standard',
      name: 'Aura Standard',
      price: 19.99,
      popular: false,
      features: [
        'Unlimited Aura learning',
        '20 Aura matches per month',
        'See all Aura conversations',
        'Full access to all games',
        'Post 2 Moments per month',
        'Priority matching queue',
        'Basic compatibility scores',
        'Undo last swipe'
      ]
    },
    {
      id: 'plus',
      name: 'Aura Plus',
      price: 34.99,
      popular: true,
      features: [
        'Unlimited Aura matches 24/7',
        'Advanced personality insights',
        'See who liked you first',
        'Priority Aura Boost',
        'Unlimited Moments posting',
        'Exclusive community events',
        'Video call features',
        'Advanced filters',
        'Premium games',
        'Read receipts'
      ]
    },
    {
      id: 'elite',
      name: 'Aura Elite',
      price: 79.99,
      features: [
        'Personal AI relationship coach',
        'Early access to new features',
        'Custom Aura training',
        'AI Concierge date planning',
        'Ad-free experience',
        'Verified Elite badge',
        'Monthly insights reports',
        'White-glove support'
      ]
    }
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Plan</Text>
        <Text style={styles.subtitle}>
          Unlock the full power of Aura's AI matching
        </Text>
      </View>

      {/* Annual Discount Banner */}
      <View style={styles.discountBanner}>
        <Text style={styles.discountText}>💎 Save 20% with Annual Plans</Text>
        <Text style={styles.discountSubtext}>Get 2 months free</Text>
      </View>

      {/* Plans Grid */}
      {plans.map((plan) => (
        <TouchableOpacity
          key={plan.id}
          style={[
            styles.planCard,
            selectedPlan === plan.id && styles.planCardSelected,
            plan.popular && styles.planCardPopular
          ]}
          onPress={() => setSelectedPlan(plan.id)}
        >
          {plan.popular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
            </View>
          )}

          <Text style={styles.planName}>{plan.name}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.priceSymbol}>$</Text>
            <Text style={styles.priceAmount}>{plan.price}</Text>
            {plan.price > 0 && <Text style={styles.pricePeriod}>/mo</Text>}
          </View>

          {/* Features List */}
          <View style={styles.featuresList}>
            {plan.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.checkmark}>✓</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
            {plan.limitations?.map((limitation, index) => (
              <View key={`limit-${index}`} style={styles.featureItem}>
                <Text style={styles.crossmark}>✗</Text>
                <Text style={styles.limitationText}>{limitation}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.selectButton}>
            <Text style={styles.selectButtonText}>
              {plan.price === 0 ? 'Current Plan' : 'Upgrade Now'}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// USE YOUR APP'S EXISTING STYLESHEET STRUCTURE
// This is just a template - adapt to your styling system
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Replace with your app's background color
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    // Use your app's primary text color
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    // Use your app's secondary text color
  },
  discountBanner: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFF3E0', // Replace with your accent color
    alignItems: 'center',
  },
  planCard: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    // Add your shadow/elevation style
  },
  planCardSelected: {
    borderColor: '#YOUR_PRIMARY_COLOR', // Your app's primary color
  },
  planCardPopular: {
    borderColor: '#YOUR_ACCENT_COLOR', // Your app's accent color
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#YOUR_ACCENT_COLOR',
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  priceSymbol: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  priceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  pricePeriod: {
    fontSize: 18,
    marginLeft: 4,
  },
  featuresList: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkmark: {
    fontSize: 18,
    marginRight: 12,
    color: '#4CAF50',
  },
  crossmark: {
    fontSize: 18,
    marginRight: 12,
    color: '#999999',
  },
  featureText: {
    flex: 1,
    fontSize: 15,
  },
  limitationText: {
    flex: 1,
    fontSize: 15,
    color: '#999999',
  },
  selectButton: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#YOUR_PRIMARY_COLOR',
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default SubscriptionPlans;
```

---

### 2. SUCCESS REWARDS PROGRAM (`SuccessRewards.jsx`)

**Where to add:** Accessible from Profile or a dedicated "Rewards" menu item

**What it does:** Shows the couple rewards program

```jsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const SuccessRewards = () => {
  const rewardTiers = [
    {
      id: 'couple',
      name: 'Aura Couple',
      icon: '💑',
      requirement: '6+ months together, met on Aura',
      percentage: '5%',
      rewards: [
        '5% of combined subscriptions → Aura Love Fund',
        'Redeemable for dates, travel, or cash',
        'Verified Couple badge',
        'Free couples counseling AI feature'
      ]
    },
    {
      id: 'engaged',
      name: 'Aura Engaged',
      icon: '💍',
      requirement: 'Engaged, met on Aura',
      percentage: '7%',
      rewards: [
        '7% of referred user subscriptions',
        'Featured in Success Stories',
        '$500-$1,000 wedding gift from Aura',
        'Exclusive engagement Moment feature',
        'Wedding planning partner discounts'
      ]
    },
    {
      id: 'married',
      name: 'Aura Married',
      icon: '👰🤵',
      requirement: 'Married, met on Aura',
      percentage: '10%',
      rewards: [
        '10% of referrals + quarterly bonuses',
        'Up to $5,000 wedding/honeymoon fund',
        'Lifetime free Premium subscriptions',
        'Annual anniversary gifts',
        'App ambassador opportunities',
        'Exclusive couples retreats invitation'
      ]
    }
  ];

  const milestones = [
    { icon: '👶', title: 'Aura Baby Bonus', reward: '$1,000 when first child is born' },
    { icon: '🌟', title: 'Couple of the Month', reward: 'Featured in app + romantic getaway' },
    { icon: '📈', title: 'Referral Multiplier', reward: 'Each successful referral increases your %' },
    { icon: '💝', title: 'Give Back Option', reward: 'Donate earnings to help other users' }
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🏆</Text>
        <Text style={styles.title}>Success Rewards Program</Text>
        <Text style={styles.subtitle}>
          We invest in love stories. Get rewarded for finding your forever person on Aura.
        </Text>
      </View>

      {/* Why This Matters */}
      <View style={styles.benefitsSection}>
        <Text style={styles.sectionTitle}>Why We Do This</Text>
        <Text style={styles.benefitText}>
          Your success is our success. When you find love on Aura, we want to celebrate 
          with you by giving back a portion of our revenue to help fund your journey together.
        </Text>
      </View>

      {/* Reward Tiers */}
      {rewardTiers.map((tier) => (
        <View key={tier.id} style={styles.tierCard}>
          <View style={styles.tierHeader}>
            <Text style={styles.tierIcon}>{tier.icon}</Text>
            <View style={styles.tierTitleContainer}>
              <Text style={styles.tierName}>{tier.name}</Text>
              <Text style={styles.tierPercentage}>{tier.percentage} Revenue Share</Text>
            </View>
          </View>

          <View style={styles.requirementBox}>
            <Text style={styles.requirementLabel}>Requirements</Text>
            <Text style={styles.requirementText}>{tier.requirement}</Text>
          </View>

          <View style={styles.rewardsBox}>
            <Text style={styles.rewardsLabel}>Your Rewards</Text>
            {tier.rewards.map((reward, index) => (
              <View key={index} style={styles.rewardItem}>
                <Text style={styles.rewardBullet}>•</Text>
                <Text style={styles.rewardText}>{reward}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply for This Tier</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Additional Milestones */}
      <View style={styles.milestonesSection}>
        <Text style={styles.sectionTitle}>Additional Milestone Bonuses</Text>
        {milestones.map((milestone, index) => (
          <View key={index} style={styles.milestoneCard}>
            <Text style={styles.milestoneIcon}>{milestone.icon}</Text>
            <View style={styles.milestoneContent}>
              <Text style={styles.milestoneTitle}>{milestone.title}</Text>
              <Text style={styles.milestoneReward}>{milestone.reward}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* CTA */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaText}>
          Ready to start your love story? Match with someone special and you could be 
          earning rewards in just 6 months!
        </Text>
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Start Matching Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Your app's background
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666666',
    lineHeight: 24,
  },
  benefitsSection: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#F5F5F5', // Your app's card background
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#666666',
  },
  tierCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    // Add your shadow style
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tierIcon: {
    fontSize: 40,
    marginRight: 12,
  },
  tierTitleContainer: {
    flex: 1,
  },
  tierName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  tierPercentage: {
    fontSize: 16,
    color: '#YOUR_ACCENT_COLOR',
    fontWeight: '600',
    marginTop: 4,
  },
  requirementBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    marginBottom: 16,
  },
  requirementLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#666666',
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 15,
    fontWeight: '600',
  },
  rewardsBox: {
    marginBottom: 16,
  },
  rewardsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#YOUR_PRIMARY_COLOR',
    marginBottom: 12,
  },
  rewardItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  rewardBullet: {
    fontSize: 18,
    marginRight: 8,
    color: '#YOUR_PRIMARY_COLOR',
  },
  rewardText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  applyButton: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#YOUR_PRIMARY_COLOR',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  milestonesSection: {
    margin: 16,
  },
  milestoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  milestoneIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  milestoneReward: {
    fontSize: 14,
    color: '#666666',
  },
  ctaSection: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#YOUR_PRIMARY_COLOR_LIGHT',
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  ctaButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    backgroundColor: '#YOUR_PRIMARY_COLOR',
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default SuccessRewards;
```

---

### 3. DATE PLANNER FEATURE (`DatePlanner.jsx`)

**Where to add:** Accessible from chat screen or main navigation

**What it does:** AI-powered date suggestions based on both users' interests

```jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

const DatePlanner = ({ userInterests, matchInterests }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');

  const categories = [
    { id: 'all', name: 'All', icon: '🎯' },
    { id: 'food', name: 'Food & Dining', icon: '🍽️' },
    { id: 'activities', name: 'Activities', icon: '🎨' },
    { id: 'outdoor', name: 'Outdoor', icon: '🌳' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎭' },
    { id: 'cultural', name: 'Cultural', icon: '🏛️' },
  ];

  // SAMPLE DATE SUGGESTIONS - Replace with your AI-generated suggestions
  const dateSuggestions = [
    {
      id: 1,
      title: 'Sunset Picnic at Central Park',
      category: 'outdoor',
      compatibility: 95,
      price: '$$',
      duration: '2-3 hours',
      location: 'Central Park, NYC',
      description: 'Based on both your love for nature and photography. Perfect golden hour lighting!',
      features: ['Pet-friendly', 'Photo opportunity', 'Romantic'],
      estimatedCost: '$30-50',
      whyMatched: 'Matches your shared interests: Photography, Nature, Outdoor activities'
    },
    {
      id: 2,
      title: 'Cooking Class: Italian Cuisine',
      category: 'food',
      compatibility: 88,
      price: '$$$',
      duration: '3 hours',
      location: 'Brooklyn Culinary Center',
      description: 'You both mentioned loving Italian food. Learn to make pasta from scratch together!',
      features: ['Interactive', 'Learn together', 'Take-home recipes'],
      estimatedCost: '$120-150 for two',
      whyMatched: 'Matches your shared interests: Italian food, Cooking, Trying new things'
    },
    {
      id: 3,
      title: 'Jazz Night at Blue Note',
      category: 'entertainment',
      compatibility: 82,
      price: '$$',
      duration: '2 hours',
      location: 'Blue Note Jazz Club, Manhattan',
      description: 'Both mentioned enjoying live music. Intimate setting with world-class jazz.',
      features: ['Live music', 'Dinner available', 'Intimate atmosphere'],
      estimatedCost: '$60-80',
      whyMatched: 'Matches your shared interests: Live music, Jazz, Evening dates'
    },
    {
      id: 4,
      title: 'Museum & Coffee',
      category: 'cultural',
      compatibility: 90,
      price: '$',
      duration: '2-4 hours',
      location: 'MoMA + nearby café',
      description: 'You both love art and meaningful conversations. Explore modern art, then discuss over coffee.',
      features: ['Indoor', 'Conversation starter', 'Flexible timing'],
      estimatedCost: '$40-60',
      whyMatched: 'Matches your shared interests: Art, Museums, Coffee, Deep conversations'
    },
  ];

  const filteredSuggestions = dateSuggestions.filter(date => 
    (selectedCategory === 'all' || date.category === selectedCategory) &&
    (locationFilter === '' || date.location.toLowerCase().includes(locationFilter.toLowerCase()))
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>AI Date Planner</Text>
        <Text style={styles.subtitle}>
          Personalized suggestions based on your shared interests
        </Text>
      </View>

      {/* Compatibility Score */}
      <View style={styles.compatibilityCard}>
        <Text style={styles.compatibilityLabel}>Overall Compatibility</Text>
        <Text style={styles.compatibilityScore}>89%</Text>
        <Text style={styles.compatibilityText}>
          You have 12 shared interests including: Music, Travel, Food, Art
        </Text>
      </View>

      {/* Location Filter */}
      <View style={styles.filterSection}>
        <TextInput
          style={styles.locationInput}
          placeholder="Filter by location..."
          value={locationFilter}
          onChangeText={setLocationFilter}
        />
      </View>

      {/* Category Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.categoryTextActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Date Suggestions */}
      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsHeader}>
          {filteredSuggestions.length} Perfect Dates for You
        </Text>

        {filteredSuggestions.map(date => (
          <View key={date.id} style={styles.dateCard}>
            {/* Compatibility Badge */}
            <View style={styles.compatibilityBadge}>
              <Text style={styles.compatibilityBadgeText}>
                {date.compatibility}% Match
              </Text>
            </View>

            <Text style={styles.dateTitle}>{date.title}</Text>
            <Text style={styles.dateDescription}>{date.description}</Text>

            {/* Date Info */}
            <View style={styles.dateInfo}>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>📍</Text>
                <Text style={styles.infoText}>{date.location}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>⏱️</Text>
                <Text style={styles.infoText}>{date.duration}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>💰</Text>
                <Text style={styles.infoText}>{date.estimatedCost}</Text>
              </View>
            </View>

            {/* Features */}
            <View style={styles.featuresContainer}>
              {date.features.map((feature, index) => (
                <View key={index} style={styles.featureTag}>
                  <Text style={styles.featureTagText}>{feature}</Text>
                </View>
              ))}
            </View>

            {/* Why Matched */}
            <View style={styles.whyMatchedBox}>
              <Text style={styles.whyMatchedLabel}>Why this is perfect:</Text>
              <Text style={styles.whyMatchedText}>{date.whyMatched}</Text>
            </View>

            {/* Actions */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButtonSecondary}>
                <Text style={styles.actionButtonSecondaryText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButtonPrimary}>
                <Text style={styles.actionButtonPrimaryText}>Book Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButtonSecondary}>
                <Text style={styles.actionButtonSecondaryText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Custom Date Request */}
      <View style={styles.customDateSection}>
        <Text style={styles.customDateTitle}>Can't find the perfect date?</Text>
        <Text style={styles.customDateText}>
          Tell our AI what you're looking for and we'll create custom suggestions!
        </Text>
        <TouchableOpacity style={styles.customDateButton}>
          <Text style={styles.customDateButtonText}>Request Custom Date Ideas</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Your app's background
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
  },
  compatibilityCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#YOUR_PRIMARY_COLOR_LIGHT',
    alignItems: 'center',
  },
  compatibilityLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  compatibilityScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#YOUR_PRIMARY_COLOR',
  },
  compatibilityText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    color: '#666666',
  },
  filterSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  locationInput: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    fontSize: 16,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#YOUR_PRIMARY_COLOR',
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  suggestionsContainer: {
    padding: 16,
  },
  suggestionsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dateCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    // Add shadow
  },
  compatibilityBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#YOUR_ACCENT_COLOR',
  },
  compatibilityBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingRight: 80,
  },
  dateDescription: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 22,
    marginBottom: 16,
  },
  dateInfo: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333333',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  featureTag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
    marginBottom: 8,
  },
  featureTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  whyMatchedBox: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#YOUR_PRIMARY_COLOR_VERY_LIGHT',
    marginBottom: 16,
  },
  whyMatchedLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#YOUR_PRIMARY_COLOR',
  },
  whyMatchedText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButtonPrimary: {
    flex: 2,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#YOUR_PRIMARY_COLOR',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionButtonPrimaryText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  actionButtonSecondary: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#YOUR_PRIMARY_COLOR',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionButtonSecondaryText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#YOUR_PRIMARY_COLOR',
  },
  customDateSection: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  customDateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  customDateText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666666',
    marginBottom: 16,
  },
  customDateButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#YOUR_PRIMARY_COLOR',
  },
  customDateButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default DatePlanner;
```

---

### 4. IN-APP SHOP (`Shop.jsx`)

**Where to add:** Accessible from navigation menu or in-chat

**What it does:** Virtual gifts, boosters, premium features

```jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'boosters', name: 'Boosters' },
    { id: 'gifts', name: 'Virtual Gifts' },
    { id: 'features', name: 'Premium Features' },
    { id: 'packs', name: 'Value Packs' }
  ];

  const shopItems = [
    {
      id: 1,
      category: 'boosters',
      name: 'Aura Boost',
      icon: '⚡',
      price: 4.99,
      description: 'Get 3x more matches for 24 hours',
      popular: true
    },
    {
      id: 2,
      category: 'boosters',
      name: 'Super Boost',
      icon: '🚀',
      price: 9.99,
      description: '48-hour boost + featured profile',
      popular: false
    },
    {
      id: 3,
      category: 'gifts',
      name: 'Digital Rose',
      icon: '🌹',
      price: 1.99,
      description: 'Send a rose to someone special',
      popular: false
    },
    {
      id: 4,
      category: 'gifts',
      name: 'Coffee Date',
      icon: '☕',
      price: 2.99,
      description: 'Virtual coffee invitation',
      popular: false
    },
    {
      id: 5,
      category: 'features',
      name: 'See Who Liked You',
      icon: '👀',
      price: 3.99,
      description: 'Unlock for 7 days',
      popular: true
    },
    {
      id: 6,
      category: 'features',
      name: 'Rewind Pack',
      icon: '⏮️',
      price: 4.99,
      description: 'Undo up to 10 swipes',
      popular: false
    },
    {
      id: 7,
      category: 'features',
      name: 'Premium Games',
      icon: '🎮',
      price: 2.99,
      description: 'Unlock all in-chat games',
      popular: false
    },
    {
      id: 8,
      category: 'packs',
      name: 'Starter Pack',
      icon: '📦',
      price: 14.99,
      originalPrice: 20.97,
      description: '1 Boost + 5 Super Likes + 1 Rewind',
      popular: true
    }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? shopItems 
    : shopItems.filter(item => item.category === selectedCategory);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Aura Shop</Text>
        <Text style={styles.subtitle}>Enhance your dating experience</Text>
      </View>

      {/* Category Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryTab,
              selectedCategory === category.id && styles.categoryTabActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={[
              styles.categoryTabText,
              selectedCategory === category.id && styles.categoryTabTextActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Shop Items Grid */}
      <View style={styles.itemsGrid}>
        {filteredItems.map(item => (
          <View key={item.id} style={styles.itemCard}>
            {item.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularBadgeText}>POPULAR</Text>
              </View>
            )}

            <Text style={styles.itemIcon}>{item.icon}</Text>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>

            <View style={styles.priceContainer}>
              {item.originalPrice && (
                <Text style={styles.originalPrice}>${item.originalPrice}</Text>
              )}
              <Text style={styles.itemPrice}>${item.price}</Text>
            </View>

            <TouchableOpacity style={styles.buyButton}>
              <Text style={styles.buyButtonText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Subscription Upsell */}
      <View style={styles.upsellCard}>
        <Text style={styles.upsellIcon}>👑</Text>
        <Text style={styles.upsellTitle}>Get More with Premium</Text>
        <Text style={styles.upsellText}>
          Subscribe to Aura Plus and get unlimited boosts, see who liked you, and more!
        </Text>
        <TouchableOpacity style={styles.upsellButton}>
          <Text style={styles.upsellButtonText}>View Plans</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 8,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryTab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  categoryTabActive: {
    backgroundColor: '#YOUR_PRIMARY_COLOR',
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTabTextActive: {
    color: '#FFFFFF',
  },
  itemsGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#YOUR_ACCENT_COLOR',
  },
  popularBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  itemIcon: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#999999',
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#YOUR_PRIMARY_COLOR',
  },
  buyButton: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#YOUR_PRIMARY_COLOR',
    alignItems: 'center',
  },
  buyButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  upsellCard: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#YOUR_PRIMARY_COLOR_LIGHT',
    alignItems: 'center',
  },
  upsellIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  upsellTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  upsellText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666666',
    marginBottom: 16,
    lineHeight: 20,
  },
  upsellButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    backgroundColor: '#YOUR_PRIMARY_COLOR',
  },
  upsellButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default Shop;
```

---

## 🔗 HOW TO INTEGRATE INTO YOUR NAVIGATION

### Add to your main navigation/menu:

```jsx
// In your Navigation component or menu
const menuItems = [
  // ... your existing menu items
  { 
    id: 'subscriptions', 
    label: '👑 Go Premium', 
    screen: 'SubscriptionPlans',
    icon: 'crown' // Use your icon system
  },
  { 
    id: 'rewards', 
    label: '🏆 Rewards Program', 
    screen: 'SuccessRewards',
    icon: 'trophy'
  },
  { 
    id: 'shop', 
    label: '🛍️ Shop', 
    screen: 'Shop',
    icon: 'shopping-bag'
  },
  { 
    id: 'datePlanner', 
    label: '📅 Date Planner', 
    screen: 'DatePlanner',
    icon: 'calendar'
  }
];
```

---

## 🎨 COLOR SCHEME REPLACEMENT

**FIND AND REPLACE these placeholder colors with YOUR app's actual colors:**

- `#YOUR_PRIMARY_COLOR` → Your main brand color
- `#YOUR_PRIMARY_COLOR_LIGHT` → Lighter version (10-20% opacity)
- `#YOUR_PRIMARY_COLOR_VERY_LIGHT` → Very light version (5-10% opacity)
- `#YOUR_ACCENT_COLOR` → Your accent/secondary color
- `#YOUR_BACKGROUND_COLOR` → Your app's background color
- `#YOUR_TEXT_PRIMARY` → Main text color
- `#YOUR_TEXT_SECONDARY` → Secondary text color

---

## 📊 MONETIZATION TRACKING

### Add analytics events for tracking:

```javascript
// When user views subscription plans
analytics.track('Viewed_Subscription_Plans');

// When user selects a plan
analytics.track('Selected_Subscription_Plan', { planId: 'plus', price: 34.99 });

// When user views rewards program
analytics.track('Viewed_Success_Rewards');

// When user makes in-app purchase
analytics.track('In_App_Purchase', { itemId: 'boost', price: 4.99 });

// When user uses date planner
analytics.track('Used_Date_Planner', { category: 'food', location: 'NYC' });
```

---

## ✅ IMPLEMENTATION CHECKLIST

- [ ] Add SubscriptionPlans.jsx page
- [ ] Add SuccessRewards.jsx page
- [ ] Add DatePlanner.jsx page
- [ ] Add Shop.jsx page
- [ ] Update navigation to include new screens
- [ ] Replace placeholder colors with your app's colors
- [ ] Add payment integration (Stripe/RevenueCat)
- [ ] Set up analytics tracking
- [ ] Test on both iOS and Android
- [ ] Add loading states and error handling
- [ ] Implement actual AI date suggestions API
- [ ] Connect to backend for subscription management
- [ ] Test Success Rewards verification flow

---

## 🚀 QUICK START FOR REPLIT

1. **Copy the code files** into your Replit project
2. **Find/Replace all color placeholders** with your actual hex codes
3. **Add routes** to your navigation system
4. **Test each feature** individually
5. **Connect to your backend APIs**
6. **Deploy and test with real users**

---

## 💡 TIPS

- Start with **Subscription Plans** first - it's the main monetization
- Test **Date Planner** with mock data before connecting AI
- **Success Rewards** can be a "Coming Soon" feature initially
- Add **Shop** items gradually based on user demand
- Keep tracking analytics to see which features users engage with most

---

## 📞 NEED HELP?

If you run into issues integrating these features:
1. Check that all imports are correct
2. Verify your navigation system is set up properly
3. Make sure colors are replaced correctly
4. Test on real devices, not just emulator
5. Check console for any errors

---

**Remember: This is meant to enhance your existing app, not replace it. Keep your current design and branding - just add these new monetization and feature screens!**
