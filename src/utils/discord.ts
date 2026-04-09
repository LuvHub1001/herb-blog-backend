import axios from "axios";
import logger from "../config/logger";

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

interface DiscordEmbed {
  title: string;
  description?: string;
  color: number;
  fields?: { name: string; value: string; inline?: boolean }[];
  timestamp?: string;
}

export async function sendDiscordAlert(embed: DiscordEmbed): Promise<void> {
  if (!DISCORD_WEBHOOK_URL) {
    logger.warn("DISCORD_WEBHOOK_URL 미설정 — 알림 생략");
    return;
  }

  try {
    await axios.post(DISCORD_WEBHOOK_URL, {
      embeds: [{ ...embed, timestamp: embed.timestamp || new Date().toISOString() }],
    }, { timeout: 5000 });
  } catch (err) {
    logger.error("Discord 알림 전송 실패", { error: (err as Error).message });
  }
}

// 에러 알림 전송
export async function sendErrorAlert(error: Error, context?: Record<string, string>): Promise<void> {
  const fields = [
    { name: "Error", value: `\`\`\`${error.message.slice(0, 1000)}\`\`\``, inline: false },
  ];

  if (error.stack) {
    fields.push({
      name: "Stack",
      value: `\`\`\`${error.stack.slice(0, 1000)}\`\`\``,
      inline: false,
    });
  }

  if (context) {
    Object.entries(context).forEach(([key, value]) => {
      fields.push({ name: key, value: value || "N/A", inline: true });
    });
  }

  await sendDiscordAlert({
    title: "🚨 서버 에러 발생",
    color: 0xff0000, // 빨간색
    fields,
  });
}

// 서버 점검 리포트 전송
export async function sendHealthReport(report: Record<string, unknown>): Promise<void> {
  const fields = Object.entries(report).map(([key, value]) => ({
    name: key,
    value: typeof value === "object" ? `\`\`\`json\n${JSON.stringify(value, null, 2).slice(0, 1000)}\`\`\`` : String(value),
    inline: false,
  }));

  await sendDiscordAlert({
    title: "📋 서버 점검 리포트",
    color: 0x00ff00, // 초록색
    fields,
  });
}
