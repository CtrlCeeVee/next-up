import { useMemo } from "react";
import { Container, ThemedText } from "../../../components";
import {
  defaultIconSize,
  gap,
  paddingLarge,
  paddingSmall,
  roundingFull,
  TextStyle,
  useTheme,
} from "../../../core";
import { DAYS_OF_WEEK, DayOfWeek } from "../../../core/types";
import { StyleSheet, View } from "react-native";
import { Icon } from "../../../icons";

const DAY_NAMES: Record<DayOfWeek, { short: string; long: string }> = {
  [DayOfWeek.Sunday]: { short: "Sun", long: "Sunday" },
  [DayOfWeek.Monday]: { short: "Mon", long: "Monday" },
  [DayOfWeek.Tuesday]: { short: "Tue", long: "Tuesday" },
  [DayOfWeek.Wednesday]: { short: "Wed", long: "Wednesday" },
  [DayOfWeek.Thursday]: { short: "Thu", long: "Thursday" },
  [DayOfWeek.Friday]: { short: "Fri", long: "Friday" },
  [DayOfWeek.Saturday]: { short: "Sat", long: "Saturday" },
};

interface LeagueDay {
  dayOfWeek: DayOfWeek;
  startTime: string;
}

export const LeagueDays = ({ leagueDays }: { leagueDays: LeagueDay[] }) => {
  const { theme } = useTheme();

  const onDays = useMemo(() => {
    const onDayOfWeek: Record<DayOfWeek, boolean> = {
      [DayOfWeek.Sunday]: false,
      [DayOfWeek.Monday]: false,
      [DayOfWeek.Tuesday]: false,
      [DayOfWeek.Wednesday]: false,
      [DayOfWeek.Thursday]: false,
      [DayOfWeek.Friday]: false,
      [DayOfWeek.Saturday]: false,
    };

    leagueDays.forEach((day) => {
      onDayOfWeek[day.dayOfWeek] = true;
    });

    return onDayOfWeek;
  }, [leagueDays]);

  const isToday = (day: DayOfWeek) => {
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
    }) as DayOfWeek;
    return day === today;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const minute = parseInt(minutes);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  const iconSize = 18;

  return (
    <Container column startVertical gap={gap.md}>
      {DAYS_OF_WEEK.map((day) => (
        <Container key={day} row centerVertical startHorizontal gap={gap.xs}>
          <Container
            column
            centerVertical
            centerHorizontal
            style={{
              ...styles.dayCircle,
              backgroundColor: isToday(day)
                ? theme.colors.accent
                : onDays[day]
                  ? theme.colors.primary
                  : theme.colors.muted + "30",
              borderColor: isToday(day) ? theme.colors.accent : "#f0f0f0",
            }}
          >
            {!onDays[day] ? (
              <Icon name="x" size={iconSize} color={theme.colors.text + "80"} />
            ) : (
              <Icon name="checkmark" size={iconSize} color={"#fff"} />
            )}
          </Container>
          <ThemedText
            textStyle={TextStyle.BodySmall}
            color={
              isToday(day)
                ? theme.colors.accent
                : onDays[day]
                  ? theme.colors.primary
                  : theme.colors.text + "80"
            }
          >
            {DAY_NAMES[day].long}s
          </ThemedText>
          {isToday(day) && (
            <ThemedText
              textStyle={TextStyle.BodySmall}
              color={theme.colors.accent}
            >
              (Today)
            </ThemedText>
          )}
          {onDays[day] && (
            <ThemedText textStyle={TextStyle.BodySmall}>
              {"at "}
              {formatTime(
                leagueDays.find((d) => d.dayOfWeek === day)?.startTime || ""
              )}
            </ThemedText>
          )}
        </Container>
      ))}
    </Container>
  );
};

const styles = StyleSheet.create({
  dayCircle: {
    padding: 2,
    borderRadius: roundingFull,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: roundingFull,
  },
});
