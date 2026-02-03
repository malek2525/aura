// src/services/matching.ts

import {
  AuraProfile,
  MatchResult,
  AuraMatchResult,
  TwinIntroResult,
  TwinChatResult,
  TwinChatMessage,
} from "../types";

/**
 * Small helpers
 */
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

/**
 * 1. Core compatibility scorer
 *
 * Pure TypeScript, no AI. We can later swap internals and keep the same API.
 */
export function computeMatchResult(
  auraA: AuraProfile,
  auraB: AuraProfile,
): MatchResult {
  let score = 50; // neutral starting point

  // 1) Goals alignment (friends, dating, practice_talking, etc.)
  const goalOverlap = overlapCount(auraA.goals, auraB.goals);
  score += goalOverlap * 8; // up to +24

  // 2) Vibe words alignment ("calm", "playful", "deep", etc.)
  const vibeOverlap = overlapCount(auraA.vibeWords, auraB.vibeWords);
  score += vibeOverlap * 6; // up to +18

  // 3) Topics they both like
  const likeOverlap = overlapCount(auraA.topicsLike, auraB.topicsLike);
  score += likeOverlap * 4; // up to +16

  // 4) Topic conflicts (A likes what B avoids and vice versa)
  if (hasIntersection(auraA.topicsLike, auraB.topicsAvoid)) score -= 10;
  if (hasIntersection(auraB.topicsLike, auraA.topicsAvoid)) score -= 10;

  // 5) Introversion / social speed balance
  const introDiff = Math.abs(auraA.introversionLevel - auraB.introversionLevel); // 0–9
  score -= introDiff * 2; // max -18

  // Social speed mismatch (slow/fast)
  if (auraA.socialSpeed !== auraB.socialSpeed) {
    if (
      (auraA.socialSpeed === "slow" && auraB.socialSpeed === "fast") ||
      (auraA.socialSpeed === "fast" && auraB.socialSpeed === "slow")
    ) {
      score -= 8;
    } else {
      // normal paired with slow/fast is okay-ish
      score -= 2;
    }
  }

  // 6) Green flags / red flags
  const greenOverlapA = overlapCount(auraA.greenFlags, auraB.vibeWords);
  const greenOverlapB = overlapCount(auraB.greenFlags, auraA.vibeWords);
  score += (greenOverlapA + greenOverlapB) * 3;

  const redOverlapAB = overlapCount(auraA.redFlags, auraB.vibeWords);
  const redOverlapBA = overlapCount(auraB.redFlags, auraA.vibeWords);
  score -= (redOverlapAB + redOverlapBA) * 5;

  // Clamp to 0–100
  const compatibilityScore = normalizeScore(score);

  let compatibilityLabel: MatchResult["compatibilityLabel"];
  if (compatibilityScore >= 70) compatibilityLabel = "high";
  else if (compatibilityScore >= 40) compatibilityLabel = "medium";
  else compatibilityLabel = "low";

  const matchReasons: string[] = [];
  const riskFlags: string[] = [];

  if (goalOverlap > 0)
    matchReasons.push(
      `You want similar things (${auraA.goals.join(", ")} / ${auraB.goals.join(
        ", ",
      )}).`,
    );

  if (vibeOverlap > 0)
    matchReasons.push(
      `You share similar vibe keywords (${auraA.vibeWords.join(
        ", ",
      )} / ${auraB.vibeWords.join(", ")}).`,
    );

  if (likeOverlap > 0)
    matchReasons.push(
      `You both enjoy talking about: ${auraA.topicsLike
        .filter((t) =>
          auraB.topicsLike
            .map((x) => x.toLowerCase())
            .includes(t.toLowerCase()),
        )
        .join(", ")}.`,
    );

  if (introDiff <= 2)
    matchReasons.push("Your social energy feels naturally balanced.");

  if (
    hasIntersection(auraA.topicsLike, auraB.topicsAvoid) ||
    hasIntersection(auraB.topicsLike, auraA.topicsAvoid)
  )
    riskFlags.push("Some conversation topics might feel draining or annoying.");

  if (introDiff >= 5)
    riskFlags.push("You recharge in very different ways; pacing will matter.");

  if (auraA.socialSpeed === "fast" && auraB.socialSpeed === "slow") {
    riskFlags.push(
      `${auraA.displayName} moves faster while ${auraB.displayName} prefers a gentle pace.`,
    );
  } else if (auraB.socialSpeed === "fast" && auraA.socialSpeed === "slow") {
    riskFlags.push(
      `${auraB.displayName} moves faster while ${auraA.displayName} prefers a gentle pace.`,
    );
  }

  const suggestedOpeningForUserA =
    `Try something simple and grounded, like: "Hey ${auraB.displayName}, ` +
    `I liked that you described yourself as ${auraB.vibeWords[0] ?? "thoughtful"} – ` +
    `how was your day really?"`;

  const suggestedOpeningForUserB =
    `You can start with: "Hi ${auraA.displayName}, I relate to the ${auraA.vibeWords[0] ?? "quiet"} vibe you mentioned. ` +
    `What kind of evenings recharge you the most?"`;

  const auraToUserSummaryA =
    `${auraA.displayName}, this connection feels ` +
    (compatibilityLabel === "high"
      ? "strong and emotionally promising."
      : compatibilityLabel === "medium"
        ? "potentially good if you go slowly."
        : "delicate and needs extra care.");

  const auraToUserSummaryB =
    `${auraB.displayName}, this twin connection is ` +
    (compatibilityLabel === "high"
      ? "a great fit for your current goals."
      : compatibilityLabel === "medium"
        ? "worth exploring gently."
        : "possible, but only if both of you are patient.");

  return {
    compatibilityScore,
    compatibilityLabel,
    matchReasons,
    riskFlags,
    suggestedOpeningForUserA,
    suggestedOpeningForUserB,
    auraToUserSummaryA,
    auraToUserSummaryB,
  };
}

/**
 * 2. Aura-to-Aura style result for UI cards
 */
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

  const summary =
    base.compatibilityLabel === "high"
      ? `${auraA.displayName} and ${auraB.displayName} are strongly aligned and likely to feel safe together.`
      : base.compatibilityLabel === "medium"
        ? `There is potential between ${auraA.displayName} and ${auraB.displayName}, especially if they respect each other’s pacing.`
        : `This connection is more experimental; it could work with careful boundaries.`;

  const vibeDescription = `${auraA.displayName} feels ${
    auraA.vibeWords.join(", ") || "subtle"
  }, while ${auraB.displayName} brings ${
    auraB.vibeWords.join(", ") || "their own unique energy"
  }. Together, the atmosphere can become ${
    base.compatibilityLabel === "high"
      ? "supportive and grounding"
      : base.compatibilityLabel === "medium"
        ? "interesting and balanced"
        : "intense and unpredictable"
  }`;

  const suggestedFirstMessage =
    base.compatibilityLabel === "high"
      ? `“Hey, I think our vibes match in a nice way. Want to share something small about your day that felt good?”`
      : base.compatibilityLabel === "medium"
        ? `“You seem interesting but also gentle. How do you usually like to get to know someone new?”`
        : `“I like that you’re different from me. What should I know so I don’t accidentally drain you?”`;

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

/**
 * 3. Intro script between two Auras
 */
export function buildTwinIntro(
  auraA: AuraProfile,
  auraB: AuraProfile,
): TwinIntroResult {
  const match = buildAuraMatchResult(auraA, auraB);

  const title = `${auraA.displayName} × ${auraB.displayName}`;

  const auraToAuraScript: string[] = [
    `${auraA.displayName}'s Aura: “Hey, I’ve been carrying ${auraA.displayName}'s inner world. They’re feeling ${auraA.vibeWords[0] ?? "quiet"} today but they’re genuinely open to you.”`,
    `${auraB.displayName}'s Aura: “Nice to meet you. ${auraB.displayName} gets overstimulated easily but they love when someone is ${auraB.greenFlags[0] ?? "patient and honest"}.”`,
    `${auraA.displayName}'s Aura: “Let’s keep the tone ${auraA.vibeWords[0] ?? "soft"} and ${auraB.vibeWords[0] ?? "kind"}. No pressure, just small steps.”`,
  ];

  const introSummary =
    `This link feels like a ${match.matchLabel.toLowerCase()}-intensity connection. ` +
    `The Auras agree to protect both social batteries and avoid topics that feel too heavy too fast.`;

  const suggestedOpeners = [
    `“What kind of connection are you secretly hoping for right now?”`,
    `“If tonight could feel emotionally safe for both of us, what would that look like?”`,
  ];

  const safetyNotes: string[] = [];
  if (match.watchOut.length > 0) {
    safetyNotes.push(
      `Auras will gently slow the pace if conversations step into: ${match.watchOut.join(
        "; ",
      )}.`,
    );
  }

  return {
    title,
    auraToAuraScript,
    introSummary,
    suggestedOpeners,
    safetyNotes,
  };
}

/**
 * 4. Simulated twin chat (Aura ↔ Aura)
 *
 * This is deterministic text, not LLM. Later we can delegate to Gemini,
 * but the UI can already display a transcript.
 */
export function simulateTwinChat(
  auraA: AuraProfile,
  auraB: AuraProfile,
  turns: number = 6,
): TwinChatResult {
  const messages: TwinChatMessage[] = [];

  const push = (from: TwinChatMessage["from"], text: string) => {
    messages.push({ from, text });
  };

  const match = buildAuraMatchResult(auraA, auraB);

  // Turn 1–2: opening
  push(
    "auraA",
    `Hey, I'm ${auraA.displayName}'s Aura. They’re feeling ${auraA.vibeWords[0] ?? "soft"} today and hoping for something ${auraA.goals[0] ?? "gentle"}.`,
  );
  push(
    "auraB",
    `Nice to meet you. I'm ${auraB.displayName}'s Aura. They’re in a ${auraB.vibeWords[0] ?? "quiet"} headspace and would enjoy ${auraB.goals[0] ?? "a low-pressure chat"}.`,
  );

  // Turn 3–4: shared topics
  const sharedTopic =
    auraA.topicsLike.find((t) =>
      auraB.topicsLike.map((x) => x.toLowerCase()).includes(t.toLowerCase()),
    ) || "slow evenings and small comforts";

  push(
    "auraA",
    `They both light up when talking about ${sharedTopic}. Maybe we keep the focus there for now.`,
  );
  push(
    "auraB",
    `Agreed. Heavy topics and sharp conflicts are off-limits tonight. Let’s keep it human, honest and simple.`,
  );

  // Turn 5–6: boundaries and pacing
  const pacePhrase =
    auraA.socialSpeed === "slow" || auraB.socialSpeed === "slow"
      ? "moving at a slow, breathable pace"
      : "adjusting the pace as you go";

  push(
    "auraA",
    `My priority is ${auraA.displayName}'s nervous system. If they start to shut down, I’ll quietly nudge them to take a break.`,
  );
  push(
    "auraB",
    `Same here for ${auraB.displayName}. We’ll handle the emotional calibration while they just answer honestly.`,
  );

  const summary =
    `The twin chat sets a tone of safety and ${pacePhrase}. ` +
    `Match level: ${match.matchLabel} (${match.compatibilityScore}/100). ` +
    `They’re encouraged to talk about ${sharedTopic} and avoid known draining topics.`;

  return {
    transcript: messages.slice(0, turns),
    summary,
  };
}
