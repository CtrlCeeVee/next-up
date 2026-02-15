import { StyleSheet, View } from "react-native";
import { useTheme } from "../../../core/theme";
import { ThemedText } from "../../../components";
import {
  gap,
  roundingSmall,
  roundingFull,
  TextStyle,
} from "../../../core/styles";

const DAYS_OF_WEEK = ["S", "M", "T", "W", "T", "F", "S"];
const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export enum LeagueDaysComponentSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

const getDayCircleSize = (size: LeagueDaysComponentSize) => {
  switch (size) {
    case LeagueDaysComponentSize.Small:
      return 6;
    case LeagueDaysComponentSize.Medium:
      return 12;
    case LeagueDaysComponentSize.Large:
      return 16;
    default:
      return 6;
  }
};

const getDayCircleBorderWidth = (size: LeagueDaysComponentSize) => {
  switch (size) {
    case LeagueDaysComponentSize.Small:
      return 1;
    case LeagueDaysComponentSize.Medium:
      return 2;
    case LeagueDaysComponentSize.Large:
      return 2;
    default:
      return 1;
  }
};

const getDayTextStyle = (size: LeagueDaysComponentSize): TextStyle => {
  switch (size) {
    case LeagueDaysComponentSize.Small:
      return TextStyle.BodySmall;
    case LeagueDaysComponentSize.Medium:
      return TextStyle.BodyMedium;
    case LeagueDaysComponentSize.Large:
      return TextStyle.Body;
    default:
      return TextStyle.BodySmall;
  }
};

const getDayItemGap = (size: LeagueDaysComponentSize) => {
  switch (size) {
    case LeagueDaysComponentSize.Small:
      return gap.xs;
    case LeagueDaysComponentSize.Medium:
      return gap.sm;
    case LeagueDaysComponentSize.Large:
      return gap.md;
    default:
      return gap.xs;
  }
};

export const LeagueDaysSummary = ({
  leagueDays,
  size = LeagueDaysComponentSize.Small,
  todayColour,
  activeColour,
  inactiveColour,
}: {
  leagueDays: string[];
  size?: LeagueDaysComponentSize;
  todayColour?: string;
  activeColour?: string;
  inactiveColour?: string;
}) => {
  const { theme } = useTheme();
  const activeDays = leagueDays.map((day) => DAY_NAMES.indexOf(day));
  const todayDayOfWeek = new Date().getDay();

  const colours = {
    today: todayColour || theme.colors.accent,
    active: activeColour || theme.colors.text,
    inactive: inactiveColour || theme.colors.muted,
  };

  return (
    <View style={[styles.daysContainer, { gap: getDayItemGap(size) }]}>
      {DAYS_OF_WEEK.map((day, index) => {
        const isActive = activeDays.includes(index);
        return (
          <View
            key={index}
            style={[styles.dayItem, { gap: getDayItemGap(size) }]}
          >
            <View
              style={[
                styles.dayCircle,
                {
                  width: getDayCircleSize(size),
                  height: getDayCircleSize(size),
                  borderWidth: getDayCircleBorderWidth(size),
                  backgroundColor: isActive
                    ? index === todayDayOfWeek
                      ? colours.today
                      : colours.active
                    : "transparent",
                  borderColor:
                    index === todayDayOfWeek
                      ? colours.today
                      : isActive
                        ? colours.active
                        : colours.inactive,
                },
              ]}
            />
            <ThemedText
              textStyle={getDayTextStyle(size)}
              style={[
                {
                  color:
                    index === todayDayOfWeek
                      ? colours.today
                      : isActive
                        ? colours.active
                        : colours.inactive,
                },
              ]}
            >
              {day}
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  daysContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  dayItem: {
    alignItems: "center",
    borderRadius: roundingSmall,
  },
  dayCircle: {
    borderRadius: roundingFull,
    borderWidth: 1,
  },
});
