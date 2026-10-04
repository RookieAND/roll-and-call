import { and, isNotNull, isNull, or, sql, type SQL } from "drizzle-orm";
import { range, uniq } from "es-toolkit";

import {
  GAME_RULE_OTHER,
  GAME_TIME_SLOT_HOURS,
  type GamesFilter,
} from "#/modules/games/model/games-filter";
import { games, rulebooks } from "#/schema";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const startKstSql = sql`(${games.confirmedAt} at time zone 'Asia/Seoul')`;

// 룰은 언제나 건다. 요일·시간대는 세션 시작 시각(KST) 기준이고, includeUnscheduled가 켜져 있으면 시작 시각이 없는 구인은 요일·시간대와 상관없이 보인다.
export function gameFiltersWhere(filter: GamesFilter): SQL | undefined {
  const inList = (expression: SQL, values: unknown[]) =>
    sql`${expression} in (${sql.join(
      values.map((value) => sql`${value}`),
      sql`, `,
    )})`;
  const conditions: SQL[] = [];

  const categoryIds = uniq(
    (filter.rules ?? [])
      .filter((rule) => UUID_PATTERN.test(rule))
      .map((rule) => rule.toLowerCase()),
  );
  const ruleConditions: SQL[] = [];
  // ponytail: 별칭 "r"과 날 칼럼 이름. RQB가 서브쿼리 칼럼을 바깥 games 별칭으로 바꿔 쓰는 것을 피한다(confirmedCountSql과 같다).
  if (categoryIds.length > 0) {
    ruleConditions.push(
      sql`exists (select 1 from ${rulebooks} "r" where "r"."id" = ${games.rulebookId} and ${inList(sql`"r"."category_id"::text`, categoryIds)})`,
    );
  }
  if (filter.rules?.includes(GAME_RULE_OTHER)) ruleConditions.push(isNull(games.rulebookId));
  if (ruleConditions.length > 0) conditions.push(or(...ruleConditions)!);

  const scheduleConditions: SQL[] = [];
  if (filter.days?.length) {
    scheduleConditions.push(inList(sql`extract(dow from ${startKstSql})::int`, filter.days));
  }
  if (filter.times?.length) {
    const hours = filter.times.flatMap((time) => {
      const [start, end] = GAME_TIME_SLOT_HOURS[time];
      return range(start, end);
    });
    scheduleConditions.push(inList(sql`extract(hour from ${startKstSql})::int`, hours));
  }
  const includeUnscheduled = filter.includeUnscheduled !== false;
  if (scheduleConditions.length > 0) {
    const scheduled = and(isNotNull(games.confirmedAt), ...scheduleConditions)!;
    conditions.push(includeUnscheduled ? or(isNull(games.confirmedAt), scheduled)! : scheduled);
  } else if (!includeUnscheduled) {
    conditions.push(isNotNull(games.confirmedAt));
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
}
