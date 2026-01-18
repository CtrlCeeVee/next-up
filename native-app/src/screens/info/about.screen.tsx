import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { ThemedText, Card, ScreenContainer } from "../../components";
import { Icon } from "../../icons";
import { useTheme } from "../../core/theme";
import { GlobalStyles } from "../../core/styles";

export const AboutScreen = () => {
  const { theme } = useTheme();

  return (
    <ScreenContainer>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View
            style={[
              styles.badge,
              { backgroundColor: theme.colors.primaryFaded },
            ]}
          >
            <Icon name="zap" size={16} color={theme.colors.primary} />
            <ThemedText
              styleType="BodySmall"
              style={[styles.badgeText, { color: theme.colors.primary }]}
            >
              Revolutionizing Pickleball in South Africa
            </ThemedText>
          </View>
          <ThemedText styleType="Header" style={styles.title}>
            Making Pickleball Seamless & Fun
          </ThemedText>
          <ThemedText styleType="Body" style={styles.subtitle}>
            Next-Up exists to transform how pickleball leagues operate across
            South Africa, making every game night smoother, more competitive,
            and more enjoyable for everyone involved.
          </ThemedText>
        </View>

        {/* Mission & Vision Cards */}
        <View style={styles.cardsContainer}>
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.cardIcon,
                  { backgroundColor: theme.colors.primaryFaded },
                ]}
              >
                <Icon name="target" size={24} color={theme.colors.primary} />
              </View>
              <ThemedText styleType="Subheader">Our Mission</ThemedText>
            </View>
            <ThemedText styleType="Body" style={styles.cardText}>
              To eliminate the chaos of paper-based league management and create
              a seamless digital experience that keeps players engaged, matches
              flowing, and communities thriving.
            </ThemedText>
          </Card>

          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.cardIcon,
                  { backgroundColor: theme.colors.secondaryFaded },
                ]}
              >
                <Icon name="heart" size={24} color={theme.colors.secondary} />
              </View>
              <ThemedText styleType="Subheader">Our Vision</ThemedText>
            </View>
            <ThemedText styleType="Body" style={styles.cardText}>
              Every pickleball league in South Africa running like clockwork,
              with players focused on the game they love rather than logistics
              and coordination challenges.
            </ThemedText>
          </Card>
        </View>

        {/* What We Solve */}
        <View style={styles.section}>
          <ThemedText styleType="Subheader" style={styles.sectionTitle}>
            What We Solve
          </ThemedText>
          <ThemedText styleType="Body" style={styles.sectionSubtitle}>
            Traditional league management creates friction. We eliminate it.
          </ThemedText>

          <View style={styles.problemsContainer}>
            {[
              {
                emoji: "📝",
                problem: "Paper Chaos",
                solution: "Digital check-ins & real-time updates",
              },
              {
                emoji: "⏰",
                problem: "Waiting Around",
                solution: "Instant match assignments & notifications",
              },
              {
                emoji: "🤷",
                problem: "Confusion",
                solution: "Clear standings, stats & schedules",
              },
            ].map((item, index) => (
              <Card key={index} style={styles.problemCard}>
                <ThemedText style={styles.emoji}>{item.emoji}</ThemedText>
                <ThemedText styleType="BodyMedium" style={styles.problemTitle}>
                  {item.problem}
                </ThemedText>
                <ThemedText styleType="BodySmall" style={styles.solutionText}>
                  {item.solution}
                </ThemedText>
              </Card>
            ))}
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <ThemedText styleType="Subheader" style={styles.sectionTitle}>
            Key Features
          </ThemedText>
          {[
            {
              icon: "users" as const,
              title: "Smart Partnerships",
              description: "Automatic pairing system for balanced matches",
            },
            {
              icon: "trophy" as const,
              title: "Live Leaderboards",
              description: "Real-time rankings and player statistics",
            },
            {
              icon: "bell" as const,
              title: "Instant Notifications",
              description: "Never miss your match with push alerts",
            },
            {
              icon: "bar-chart" as const,
              title: "Detailed Stats",
              description: "Track your progress and improvement",
            },
          ].map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Icon
                name={feature.icon}
                size={24}
                color={theme.colors.primary}
              />
              <View style={styles.featureContent}>
                <ThemedText styleType="BodyMedium">{feature.title}</ThemedText>
                <ThemedText styleType="BodySmall" style={styles.featureDesc}>
                  {feature.description}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    ...GlobalStyles.padding,
    alignItems: "center",
    paddingTop: 32,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
    gap: 8,
  },
  badgeText: {
    fontWeight: "600",
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 24,
  },
  cardsContainer: {
    ...GlobalStyles.padding,
    gap: 16,
  },
  card: {
    ...GlobalStyles.padding,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: {
    opacity: 0.7,
    lineHeight: 22,
  },
  section: {
    ...GlobalStyles.padding,
    paddingTop: 32,
  },
  sectionTitle: {
    textAlign: "center",
    marginBottom: 8,
  },
  sectionSubtitle: {
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 24,
  },
  problemsContainer: {
    gap: 12,
  },
  problemCard: {
    padding: 16,
    alignItems: "center",
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  problemTitle: {
    fontWeight: "600",
    marginBottom: 4,
  },
  solutionText: {
    opacity: 0.7,
    textAlign: "center",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureDesc: {
    opacity: 0.7,
    marginTop: 4,
  },
  bottomSpacing: {
    height: 32,
  },
});
