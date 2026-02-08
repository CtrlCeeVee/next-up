import { useMemo } from "react";
import { Container, ThemedText } from "../../../components";
import {
  defaultIconSize,
  gap,
  paddingLarge,
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

export const LeagueDays = ({ leagueDays }: { leagueDays: DayOfWeek[] }) => {
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
      onDayOfWeek[day] = true;
    });

    return onDayOfWeek;
  }, [leagueDays]);

  const isToday = (day: DayOfWeek) => {
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
    }) as DayOfWeek;
    return day === today;
  };

  return (
    <Container row centerVertical growHorizontal spaceBetween gap={gap.lg}>
      {DAYS_OF_WEEK.map((day) => (
        <Container
          key={day}
          column
          centerVertical
          centerHorizontal
          gap={gap.xs}
        >
          <Container
            column
            centerVertical
            centerHorizontal
            style={{
              ...styles.dayCircle,
              backgroundColor: onDays[day]
                ? theme.colors.primary
                : isToday(day)
                  ? theme.colors.accent
                  : theme.colors.muted + "20",
              borderColor: isToday(day) ? theme.colors.accent : "#f0f0f0",
            }}
          >
            {!onDays[day] ? (
              <Icon
                name="x"
                size={defaultIconSize}
                color={theme.colors.text + "40"}
              />
            ) : (
              <Icon name="checkmark" size={defaultIconSize} color={"#fff"} />
            )}
          </Container>
          <ThemedText
            textStyle={TextStyle.BodySmall}
            color={
              onDays[day]
                ? theme.colors.text
                : isToday(day)
                  ? theme.colors.accent
                  : theme.colors.muted
            }
          >
            {DAY_NAMES[day].short}
          </ThemedText>
        </Container>
      ))}
    </Container>
  );
};

const styles = StyleSheet.create({
  dayCircle: {
    width: defaultIconSize,
    height: defaultIconSize,
    borderRadius: 5,
  },
});
