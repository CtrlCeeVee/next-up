import React, { useRef, useState } from "react";
import { StyleSheet, View, LayoutChangeEvent } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Container, Card, ThemedText } from "../../../components";
import { useTheme } from "../../../core/theme";
import { TextStyle } from "../../../core/styles/text";
import { gap, padding, rounding, spacing } from "../../../core/styles";
import { PlayerRanking } from "../../player/types/player-ranking";
import { LeagueLogoComponent } from "./league-logo.component";
import { League } from "../types";

interface StatsSummaryProps {
  // Stub data for now
  winPercentage?: number;
  gamesWon?: number;
  gamesLost?: number;
  gamesPlayed?: number;
  rankings?: PlayerRanking[];
  leagues?: League[];
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({
  winPercentage = 68,
  gamesWon = 68,
  gamesLost = 32,
  gamesPlayed = 100,
  leagues = [],
  rankings = [
    { id: 1, leagueId: "2", ranking: 3 },
    { id: 2, leagueId: "3", ranking: 7 },
  ],
}) => {
  const { theme } = useTheme();
  const [chartWidth, setChartWidth] = useState(280);
  const chartHeight = 80;

  // Generate histogram data with bell curve distribution
  // Using 21 bars (0-100 in steps of 5) for better visibility with limited width
  const barData = useRef(
    Array.from({ length: 21 }, (_, i) => {
      const percentage = i * 5; // 0, 5, 10, ..., 100
      const distance = Math.abs(percentage - winPercentage);
      const maxHeight = 60;
      const minHeight = 2;
      const height =
        maxHeight * Math.exp(-(distance * distance) / (2 * 20 * 20)) +
        minHeight;
      return {
        value: Math.max(minHeight, Math.round(height)),
      };
    })
  ).current;

  const handleChartLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    if (width > 0 && width !== chartWidth) {
      setChartWidth(width);
    }
  };

  const getRanking = (leagueId: string) => {
    const ranking = rankings.find(
      (ranking) => ranking.leagueId === leagueId
    )?.ranking;
    if (!ranking) return "N/A";
    if (ranking === 1) return "1st";
    if (ranking === 2) return "2nd";
    if (ranking === 3) return "3rd";
    return `${ranking}th`;
  };

  const renderBarChart = () => {
    // Calculate bar width accounting for spacing between bars
    // Total width = (numBars * barWidth) + ((numBars - 1) * spacing)
    // So: barWidth = (totalWidth - ((numBars - 1) * spacing)) / numBars
    const numBars = barData.length;
    const spacingBetweenBars = 2; // Reduced spacing for better visibility
    const padding = 5; // Reduced padding
    const availableWidth = chartWidth - padding;
    const calculatedBarWidth =
      chartWidth > 100 && availableWidth > 0
        ? Math.round(
            Math.max(
              1,
              (availableWidth - (numBars - 1) * spacingBetweenBars) / numBars
            )
          )
        : 0;

    const renderCondition =
      chartWidth > 100 && calculatedBarWidth > 0 && barData.length > 0;

    return (
      <Container w100 column>
        <View
          onLayout={handleChartLayout}
          style={[
            styles.chartContainer,
            { height: chartHeight, width: "100%" },
          ]}
        >
          {!!barData && renderCondition && chartWidth > 0 ? (
            <View
              style={{
                width: chartWidth,
                height: chartHeight,
                overflow: "hidden",
              }}
            >
              {/* #region agent log */}
              {(() => {
                const logData = {
                  location: "stats-summary.component.tsx:72",
                  message: "BarChart rendering",
                  data: {
                    chartWidth,
                    height: chartHeight,
                    barWidth: calculatedBarWidth,
                    dataLength: barData.length,
                    frontColor: theme.colors.primary,
                  },
                  timestamp: Date.now(),
                  runId: "post-fix",
                  hypothesisId: "D",
                };
                console.log("[DEBUG] BarChart rendering:", logData);
                fetch(
                  "http://127.0.0.1:7242/ingest/a245086c-ef64-490c-9163-5cde1ec1674c",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(logData),
                  }
                ).catch(() => {});
                return null;
              })()}
              {/* #endregion */}
              <BarChart
                data={barData}
                width={chartWidth}
                height={chartHeight}
                barWidth={calculatedBarWidth}
                spacing={spacingBetweenBars}
                initialSpacing={0}
                endSpacing={0}
                roundedTop
                roundedBottom
                hideRules
                hideYAxisText
                hideAxesAndRules
                scrollAnimation
                frontColor={theme.colors.primary}
                maxValue={65}
                disableScroll
                showScrollIndicator={false}
                backgroundColor="transparent"
              />
            </View>
          ) : (
            <>
              {/* #region agent log */}
              {(() => {
                const logData = {
                  location: "stats-summary.component.tsx:95",
                  message: "BarChart NOT rendering - condition failed",
                  data: {
                    chartWidth,
                    calculatedBarWidth,
                    barDataLength: barData.length,
                  },
                  timestamp: Date.now(),
                  runId: "post-fix",
                  hypothesisId: "C",
                };
                console.log(
                  "[DEBUG] BarChart NOT rendering - condition failed:",
                  logData
                );
                fetch(
                  "http://127.0.0.1:7242/ingest/a245086c-ef64-490c-9163-5cde1ec1674c",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(logData),
                  }
                ).catch(() => {});
                return null;
              })()}
              {/* #endregion */}
              {/* Debug info - visible on screen */}
              <ThemedText
                textStyle={TextStyle.BodySmall}
                style={{ color: "red" }}
              >
                Debug: w={chartWidth} bw={calculatedBarWidth.toFixed(2)} d=
                {barData.length}
              </ThemedText>
            </>
          )}
        </View>
        {/* X-axis labels */}
        <Container row spaceBetween w100 style={{ marginTop: spacing.xs }}>
          <ThemedText textStyle={TextStyle.BodySmall} muted>
            0
          </ThemedText>
          <ThemedText textStyle={TextStyle.BodySmall} muted>
            50
          </ThemedText>
          <ThemedText textStyle={TextStyle.BodySmall} muted>
            100
          </ThemedText>
        </Container>
      </Container>
    );
  };

  return (
    <Container row w100 gap={gap.md}>
      {/* Left Container: Win Percentage */}
      <Card style={{ flex: 1 }}>
        <Container column w100 gap={gap.md}>
          <ThemedText textStyle={TextStyle.BodyMedium}>
            {winPercentage}% of Games Won
          </ThemedText>
          {renderBarChart()}
          <Container row spaceBetween w100>
            <Container column centerHorizontal>
              <ThemedText textStyle={TextStyle.BodyMedium}>
                {gamesWon}
              </ThemedText>
              <ThemedText textStyle={TextStyle.BodySmall} muted>
                Won
              </ThemedText>
            </Container>
            <Container column centerHorizontal>
              <ThemedText textStyle={TextStyle.BodyMedium}>
                {gamesLost}
              </ThemedText>
              <ThemedText textStyle={TextStyle.BodySmall} muted>
                Lost
              </ThemedText>
            </Container>
            <Container column centerHorizontal>
              <ThemedText textStyle={TextStyle.BodyMedium}>
                {gamesPlayed}
              </ThemedText>
              <ThemedText textStyle={TextStyle.BodySmall} muted>
                Played
              </ThemedText>
            </Container>
          </Container>
        </Container>
      </Card>

      {/* Right Container: Rankings */}
      <Card style={{ flex: 1 }}>
        <Container column w100 gap={gap.md}>
          <ThemedText textStyle={TextStyle.BodyMedium}>
            Your rankings
          </ThemedText>
          <Container column w100 gap={gap.sm}>
            {rankings.map((playerRanking, index) => {
              const league = leagues?.find(
                (league) => league.id === playerRanking.leagueId
              );
              console.log("league", league);
              const leagueName =
                league?.name || `League ${playerRanking.leagueId}`;
              const leagueLogo = league?.logoUrl;

              return (
                <Container key={index} row centerVertical gap={gap.sm} w100>
                  <LeagueLogoComponent
                    logo={leagueLogo}
                    name={leagueName}
                    width={24}
                    height={24}
                  />
                  <ThemedText textStyle={TextStyle.Body}>
                    {getRanking(playerRanking.leagueId)}
                  </ThemedText>
                </Container>
              );
            })}
          </Container>
        </Container>
      </Card>
    </Container>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    width: "100%",
    // overflow: "hidden",
  },
});
