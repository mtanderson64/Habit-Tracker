import { useHabits, type Habit } from "../context/useHabits";
import {
  format,
  isFuture,
  isSameDay,
  subDays,
} from "date-fns";
import { Button } from "./Button";

type HabitListProps = {
  visibleDates: Date[];
};

export function HabitList({ visibleDates }: HabitListProps) {
  const { habits } = useHabits()
  if (habits.length === 0) {
    return (
      <p className="text-center text-zinc-500 py-12">
        No habits yet. Add one above to get started.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {habits.map(habit => (
        <HabitItem
          key={habit.id}
          habit={habit}
          visibleDates={visibleDates}
        />
      ))}
    </div>
  );
}

type HabitItemProps = {
  habit: Habit
  visibleDates: Date[]
};

function HabitItem({ habit, visibleDates }: HabitItemProps) {
  const { deleteHabit, toggleHabit } = useHabits()

  const streak = getStreak(habit.completions);

  return (
    <div className="rounded-lg bg-zinc-800 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between ">
        <div className="flex gap-3 items-center">
          <span className="font-medium">{habit.name}</span>
          <span className="text-base text-amber-400">{streak}</span>
        </div>
        <Button
          onClick={() => deleteHabit(habit.id)}
          variant="ghost-destructive"
          className="text-sm"
        >
          Delete
        </Button>
      </div>
      <div className="flex gap-2">
        {visibleDates.map((date) => (
          <Button
            className="flex flex-1 flex-col items-center gap-0.5 rounded-md text-sm py-2"
            key={date.toISOString()}
            disabled={isFuture(date)}
            onClick={() => toggleHabit(habit.id, date)}
            variant={
              habit.completions.some((d) => isSameDay(date, d))
                ? "primary"
                : "secondary"
            }
          >
            <span className="font-medium">{format(date, "EEE")} </span>
            <div className="flex items-start justify-center gap-0">
              <span>{format(date, "d")}</span>
              <span className="text-[0.75em] font-medium ml-px">
                {format(date, "do").slice(-2)}
              </span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}

function getStreak(completions: Date[]) {
  let streak = 0;
  let date = new Date();

  while (completions.some((c) => isSameDay(c, date))) {
    streak++;
    date = subDays(date, 1);
  }

  if (streak === 0) {
    return null;
  }

  return `🔥 ${streak}`;
}
