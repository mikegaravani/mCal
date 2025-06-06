import StudyPlan from "../../models/studyPlan.model";
import { timeMachineService } from "../timeMachineService";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import tz from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(tz);

export async function rollStudyPlansToToday() {
  const now = timeMachineService.getNow();
  const tzName = "Europe/Zurich";
  const todayStart = dayjs(now).tz(tzName).startOf("day");
  const yesterdayStart = todayStart.subtract(1, "day");
  const yesterdayEnd = yesterdayStart.endOf("day");

  const result = await StudyPlan.updateMany(
    {
      dragToNextDay: true,
      isCompleted: false,
      date: {
        $gte: yesterdayStart.toDate(),
        $lte: yesterdayEnd.toDate(),
      },
    },
    {
      $set: {
        date: todayStart.toDate(),
        updatedAt: now,
      },
    }
  );

  console.log(
    `[📘 StudyPlan Cron] Rolled forward ${
      result.modifiedCount
    } study plan(s) at ${now.toISOString()}`
  );
}
