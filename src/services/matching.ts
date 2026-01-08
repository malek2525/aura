
import {
  AuraProfile,
  MatchResult,
  AuraMatchResult,
  TwinIntroResult,
  TwinChatResult,
  TwinChatMessage,
} from "../types";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const overlapCount = (a: string[] = [], b: string[] = []): number => {
  const setB = new Set(b.map((x) => x.toLowerCase()));
  return a.reduce(
    (count, item) => (setB.has(item.toLowerCase()) ? count + 1 : count),
    0,
  );
};

const hasIntersection = (a: string[] = [], b: string[] = []): boolean =>
  overlapCount(a, b) > 0;

const normalizeScore = (score: number): number =>
  clamp(Math.round(score), 0, 100);

export function computeMatchResult(
  auraA: AuraProfile,
  auraB: AuraProfile,
): MatchResult {
  let score = 50; 
  const goalsA = auraA.goals || [];
  const goalsB = auraB.goals || [];
  const vibeA = auraA.vibeWords || [];
  const vibeB = auraB.vibeWords || [];
  const likeA = auraA.topicsLike || [];
  const likeB = auraB.topicsLike || [];
  const avoidA = auraA.topicsAvoid || [];
  const avoidB = auraB.topicsAvoid || [];
  const introA = auraA.introversionLevel || 5;
  const introB = auraB.introversionLevel || 5;
  const speedA = auraA.socialSpeed || 'normal';
  const speedB = auraB.socialSpeed || 'normal';
  const greenA = auraA.greenFlags || [];
  const greenB = auraB.greenFlags || [];
  const redA = auraA.redFlags || [];
  const redB = auraB.redFlags || [];

  const goalOverlap = overlapCount(goalsA, goalsB);
  score += goalOverlap * 8;

  const vibeOverlap = overlapCount(vibeA, vibeB);
  score += vibeOverlap * 6;

  const likeOverlap = overlapCount(likeA, likeB);
  score += likeOverlap * 4;

  if (hasIntersection(likeA, avoidB)) score -= 10;
  if (hasIntersection(likeB, avoidA)) score -= 10;

  const introDiff = Math.abs(introA - introB); 
  score -= introDiff * 2; 

  if (speedA !== speedB) {
    if (
      (speedA === "slow" && speedB === "fast") ||
      (speedA === "fast" && speedB === "slow")
    ) {
      score -= 8;
    } else {
      score -= 2;
    }
  }

  const greenOverlapA = overlapCount(greenA, vibeB);
  const greenOverlapB = overlapCount(greenB, vibeA);
  score += (greenOverlapA + greenOverlapB) * 3;

  const redOverlapAB = overlapCount(redA, vibeB);
  const redOverlapBA = overlapCount(redB, vibeA);
  score -= (redOverlapAB + redOverlapBA) * 5;

  const compatibilityScore = normalizeScore(score);

  let compatibilityLabel: MatchResult["compatibilityLabel"];
  if (compatibilityScore >= 70) compatibilityLabel = "high";
  else if (compatibilityScore >= 40) compatibilityLabel = "medium";
  else compatibilityLabel = "low";

  const matchReasons: string[] = [];
  const riskFlags: string[] = [];

  if (goalOverlap > 0)
    matchReasons.push(`You want similar things.`);

  if (vibeOverlap > 0)
    matchReasons.push(`You share similar vibe keywords.`);

  if (likeOverlap > 0)
    matchReasons.push(`You both enjoy similar topics.`);

  if (introDiff <= 2)
    matchReasons.push("Your social energy feels naturally balanced.");

  if (introDiff >= 5)
    riskFlags.push("You recharge in very different ways.");

  const suggestedOpeningForUserA = `Hey ${auraB.displayName || 'there'}, I liked your vibe.`;
  const suggestedOpeningForUserB = `Hi ${auraA.displayName || 'there'}, noticed we have things in common.`;

  return {
    compatibilityScore,
    compatibilityLabel,
    matchReasons,
    riskFlags,
    suggestedOpeningForUserA,
    suggestedOpeningForUserB,
    auraToUserSummaryA: `Compatibility: ${compatibilityLabel}`,
    auraToUserSummaryB: `Compatibility: ${compatibilityLabel}`,
  };
}

export function buildAuraMatchResult(
  auraA: AuraProfile,
  auraB: AuraProfile,
): AuraMatchResult {
  const base = computeMatchResult(auraA, auraB);

  const matchLabel =
    base.compatibilityLabel === "high"
      ? "High"
      : base.compatibilityLabel === "medium"
        ? "Medium"
        : "Low";

  const summary = `Match Level: ${matchLabel}`;
  const vibeDescription = `A ${matchLabel} connection based on your vibes.`;
  const suggestedFirstMessage = base.suggestedOpeningForUserA;

  return {
    compatibilityScore: base.compatibilityScore,
    matchLabel,
    summary,
    whyItWorks: base.matchReasons,
    watchOut: base.riskFlags,
    vibeDescription,
    suggestedFirstMessage,
  };
}

export function buildTwinIntro(
  auraA: AuraProfile,
  auraB: AuraProfile,
): TwinIntroResult {
  const match = buildAuraMatchResult(auraA, auraB);
  const title = `${auraA.displayName} × ${auraB.displayName}`;

  const auraToAuraScript: string[] = [
    `Aura A: "Checking compatibility..."`,
    `Aura B: "Looks like a ${match.matchLabel} match."`,
  ];

  const introSummary = `This link feels like a ${match.matchLabel.toLowerCase()}-intensity connection.`;

  const suggestedOpeners = [
    `“What kind of connection are you hoping for?”`,
    `“Hi, seems we both like similar things.”`,
  ];

  return {
    title,
    auraToAuraScript,
    introSummary,
    suggestedOpeners,
    safetyNotes: match.watchOut,
  };
}

export function simulateTwinChat(
  auraA: AuraProfile,
  auraB: AuraProfile,
  turns: number = 6,
): TwinChatResult {
  const messages: TwinChatMessage[] = [];
  const push = (from: TwinChatMessage["from"], text: string) => {
    messages.push({ from, text });
  };

  push("auraA", `Hi, I represent ${auraA.displayName}.`);
  push("auraB", `Hello, I'm here for ${auraB.displayName}.`);
  push("auraA", `They seem to match on some goals.`);
  push("auraB", `Yes, let's suggest they chat.`);

  return {
    transcript: messages.slice(0, turns),
    summary: "A brief simulated exchange between Auras.",
  };
}
