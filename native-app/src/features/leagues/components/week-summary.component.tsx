import React, { useState, useMemo } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import {
  Container,
  Card,
  ThemedText,
  ShimmerComponent,
  ScrollArea,
} from "../../../components";
import { Icon } from "../../../icons";
import { useTheme } from "../../../core/theme";
import { TextStyle } from "../../../core/styles/text";
import {
  gap,
  padding,
  rounding,
  roundingLarge,
  spacing,
} from "../../../core/styles";
import { DateUtility } from "../../../core/utilities";
import { LeagueNightInstance } from "../../league-nights/types";
import { League } from "../types";

interface WeekSummaryProps {
  leagues: League[];
  leagueNightInstances: LeagueNightInstance[];
  loading?: boolean;
  onLeagueNightPress?: (night: LeagueNightInstance) => void;
}

export const WeekSummary: React.FC<WeekSummaryProps> = ({
  leagues,
  leagueNightInstances,
  loading = false,
  onLeagueNightPress,
}) => {
  const { theme } = useTheme();
  const weekDays = DateUtility.getWeekDays();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  // Group league night instances by date
  const instancesByDate = useMemo(() => {
    const grouped: Record<string, LeagueNightInstance[]> = {};
    leagueNightInstances.forEach((instance) => {
      const dateKey = DateUtility.formatDateString(new Date(instance.date));
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(instance);
    });
    return grouped;
  }, [leagueNightInstances]);

  // Get instances for selected date
  const selectedDateInstances = useMemo(() => {
    const dateKey = DateUtility.formatDateString(selectedDate);
    return instancesByDate[dateKey] || [];
  }, [selectedDate, instancesByDate]);

  // Format selected date label
  const selectedDateLabel = useMemo(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return selectedDate.toLocaleDateString("en-US", options);
  }, [selectedDate]);

  const handleDayPress = (date: Date) => {
    setSelectedDate(date);
  };

  const getLeagueName = (leagueId: string): string => {
    return leagues.find((l) => l.id === leagueId)?.name || "";
  };

  const formatTime = (time: string): string => {
    // Time is in HH:mm format, convert to 12-hour format
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "pm" : "am";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <Container column w100 gap={gap.md} padding={padding}>
        <Container row spaceBetween w100>
          {weekDays.map((_, index) => (
            <ShimmerComponent
              key={index}
              width={40}
              height={60}
              rounding={rounding}
              renderCardUnderneath={true}
            />
          ))}
        </Container>
        <Container w100>
          <ShimmerComponent
            width="100%"
            height={80}
            rounding={roundingLarge}
            renderCardUnderneath={true}
          />
        </Container>
      </Container>
    );
  }

  return (
    <Card style={{ padding: 0, flex: 1 }}>
      <Container column w100 gap={gap.md} padding={padding} style={{ flex: 1 }}>
        {/* Days of week header */}
        <Container row spaceBetween w100>
          {weekDays.map((date) => {
            const isSelected = DateUtility.isSameDay(date, selectedDate);
            const isToday = DateUtility.isSameDay(date, today);
            const dateKey = DateUtility.formatDateString(date);
            const hasInstances = !!instancesByDate[dateKey]?.length;

            return (
              <TouchableOpacity
                key={dateKey}
                onPress={() => handleDayPress(date)}
                activeOpacity={0.7}
                style={styles.dayButton}
              >
                <Container
                  column
                  centerHorizontal
                  gap={gap.xs}
                  paddingVertical={spacing.sm}
                  paddingHorizontal={spacing.xs}
                  rounding={rounding}
                  style={{
                    ...styles.dayButtonContent,
                    ...(isSelected && {
                      backgroundColor: isToday
                        ? theme.colors.accent + "33"
                        : theme.colors.primary + "33",
                    }),
                  }}
                >
                  <ThemedText
                    textStyle={TextStyle.BodySmall}
                    style={[
                      styles.dayName,
                      isSelected && {
                        color: isToday
                          ? theme.colors.accent
                          : theme.colors.primary,
                      },
                      !isSelected && { opacity: 0.6 },
                    ]}
                  >
                    {DateUtility.formatDayName(date)}
                  </ThemedText>
                  <ThemedText
                    textStyle={TextStyle.BodyMedium}
                    style={[
                      styles.dayNumber,
                      isSelected && {
                        color: isToday
                          ? theme.colors.accent
                          : theme.colors.primary,
                        fontWeight: "600",
                      },
                      !isSelected && { opacity: 0.7 },
                    ]}
                  >
                    {date.getDate()}
                  </ThemedText>
                  {hasInstances && (
                    <Container
                      style={{
                        ...styles.dot,
                        ...(isSelected && {
                          backgroundColor: isToday
                            ? theme.colors.accent
                            : theme.colors.primary,
                        }),
                        ...(!isSelected && {
                          backgroundColor: theme.colors.text + "40",
                        }),
                      }}
                    />
                  )}
                </Container>
              </TouchableOpacity>
            );
          })}
        </Container>

        {/* Selected date label */}
        <Container column w100>
          <ThemedText textStyle={TextStyle.Body} style={styles.dateLabel}>
            {selectedDateLabel}
          </ThemedText>
        </Container>

        {/* League night instances for selected day */}
        <Container column w100 style={{ flex: 1, minHeight: 0 }}>
          <ScrollArea contentGap={gap.sm} innerPadding={0}>
            {selectedDateInstances.length > 0 ? (
              selectedDateInstances.map((instance, index) => (
                <TouchableOpacity
                  key={instance.id || index}
                  onPress={() => onLeagueNightPress?.(instance)}
                  activeOpacity={onLeagueNightPress ? 0.7 : 1}
                  disabled={!onLeagueNightPress}
                >
                  <Card style={styles.instanceCard}>
                    <Container row spaceBetween centerVertical w100>
                      <Container
                        row
                        centerVertical
                        gap={gap.md}
                        style={{ flex: 1 }}
                      >
                        <Container
                          column
                          centerHorizontal
                          paddingVertical={spacing.xs}
                          paddingHorizontal={spacing.sm}
                          rounding={rounding}
                          style={styles.timeContainer}
                        >
                          <ThemedText textStyle={TextStyle.BodyMedium}>
                            {formatTime(instance.time)}
                          </ThemedText>
                        </Container>
                        <Container column gap={gap.xs} style={{ flex: 1 }}>
                          <ThemedText textStyle={TextStyle.BodyMedium}>
                            {getLeagueName(instance.leagueId)}
                          </ThemedText>
                        </Container>
                      </Container>
                      <Icon
                        name="chevron-right"
                        size={20}
                        color={theme.colors.text + "60"}
                      />
                    </Container>
                  </Card>
                </TouchableOpacity>
              ))
            ) : (
              <Card>
                <Container column w100 centerHorizontal gap={gap.sm}>
                  <ThemedText textStyle={TextStyle.BodyMedium} muted>
                    No league nights scheduled
                  </ThemedText>
                  <ThemedText textStyle={TextStyle.BodySmall} muted>
                    Check back later for upcoming events
                  </ThemedText>
                </Container>
              </Card>
            )}
          </ScrollArea>
        </Container>
      </Container>
    </Card>
  );
};

const styles = StyleSheet.create({
  dayButton: {
    flex: 1,
    alignItems: "center",
  },
  dayButtonContent: {
    minWidth: 40,
    position: "relative",
  },
  dayName: {
    fontSize: 12,
    textTransform: "uppercase",
  },
  dayNumber: {
    fontSize: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: spacing.xs,
  },
  dateLabel: {
    fontWeight: "500",
  },
  instanceCard: {
    width: "100%",
  },
  timeContainer: {
    backgroundColor: "transparent",
  },
});
