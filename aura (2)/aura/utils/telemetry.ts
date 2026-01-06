export type TelemetryEventName =
  | 'reply_lab_opened'
  | 'reply_lab_generated'
  | 'reply_lab_used_option';

export interface ReplyLabGeneratedData {
  length: number;
  context?: string;
}

export interface ReplyLabUsedOptionData {
  tone: 'safe' | 'direct' | 'playful';
}

export type TelemetryEventData = ReplyLabGeneratedData | ReplyLabUsedOptionData | Record<string, unknown>;

export function logEvent(eventName: TelemetryEventName, data?: TelemetryEventData): void {
  console.log(`[Telemetry] ${eventName}`, data || {});
}
