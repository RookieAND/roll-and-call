import { getHolidayPreset } from "@hyunbinseo/holidays-kr";
import { getMonthSessions } from "@roll-and-call/database/games";
import { getServerByGuildId } from "@roll-and-call/database/servers";
import { after } from "next/server";

import { dayjs, KST } from "@/shared/lib";
import {
  buildMonthCells,
  DATE_KEY_FORMAT,
  groupSessionsByDay,
  toCalendarSessions,
} from "@/views/home";

import { deferredEphemeralResponse } from "./deferred-ephemeral-response";
import { editOriginalImage } from "./edit-original-image";
import { editOriginalResponse } from "./edit-original-response";
import { ephemeralResponse } from "./ephemeral-response";
import type { DiscordInteraction, DiscordInteractionResponse } from "./interaction-types";
import { renderCalendarImage } from "./render-calendar-image";

const MONTH_OPTION_NAME = "월";

// /캘린더: 그 달 세션 달력을 이미지로 만들어 본인에게만 보여 준다. 월을 안 적으면 이번 달.
export function handleCalendarCommand(interaction: DiscordInteraction): DiscordInteractionResponse {
  const guildId = interaction.guild_id;
  if (!guildId) return ephemeralResponse("서버 안에서만 쓸 수 있는 명령입니다.");

  const now = dayjs().tz(KST);
  const month = Number(
    interaction.data?.options?.find(({ name }) => name === MONTH_OPTION_NAME)?.value ??
      now.month() + 1,
  );
  const monthStart = dayjs.tz(`${now.year()}-${String(month).padStart(2, "0")}-01`, KST);

  after(async () => {
    try {
      const server = await getServerByGuildId(guildId);
      if (!server) {
        await editOriginalResponse({
          interaction,
          content: "이 서버에서는 쓸 수 없는 명령입니다.",
        });
        return;
      }
      const [rows, holidays] = await Promise.all([
        getMonthSessions({
          serverId: server.id,
          from: monthStart.toDate(),
          to: monthStart.add(1, "month").toDate(),
        }),
        getHolidayPreset(String(monthStart.year())).catch(() => ({})),
      ]);
      const image = await renderCalendarImage({
        monthStart,
        cells: buildMonthCells(monthStart),
        sessionsByDay: groupSessionsByDay(toCalendarSessions({ rows, viewerId: null })),
        holidays,
        todayKey: now.format(DATE_KEY_FORMAT),
      });
      await editOriginalImage({ interaction, image, content: "" });
    } catch (error) {
      console.error("디스코드 /캘린더 실패", { error });
      await editOriginalResponse({
        interaction,
        content: "캘린더를 만들지 못했습니다. 잠시 뒤에 다시 시도해 주세요.",
      });
    }
  });
  return deferredEphemeralResponse();
}
