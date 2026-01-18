import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ThemedText,
  Card,
  ScreenContainer,
  LoadingSpinner,
  Button,
} from "../../components";
import { Icon } from "../../icons";
import { useTheme } from "../../core/theme";
import { useAuthState } from "../../features/auth/state";
import { useProfilesState } from "../../features/profiles/state";
import { useToastState } from "../../features/toast/state";
import { GlobalStyles, TextStyle, padding } from "../../core/styles";

export const ProfileScreen = () => {
  const { theme, isDark } = useTheme();
  const { user, signOut } = useAuthState();
  const { profile, stats, loading, fetchProfileByUserId, fetchStats, updateProfile } = useProfilesState();
  const { showToast } = useToastState();

  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editSkillLevel, setEditSkillLevel] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfileByUserId(user.id);
      fetchStats(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      setEditBio(profile.bio || "");
      setEditLocation(profile.location || "");
      setEditSkillLevel(profile.skillLevel || "Beginner");
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!user || !profile) return;

    try {
      setIsSaving(true);
      await updateProfile(user.id, {
        bio: editBio,
        location: editLocation,
        skillLevel: editSkillLevel as any,
      });
      setIsEditing(false);
      showToast({
        type: "success",
        title: "Profile Updated",
        message: "Your changes have been saved successfully.",
      });
    } catch (error: any) {
      showToast({
        type: "error",
        title: "Update Failed",
        message: error.message || "Failed to update profile",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      showToast({
        type: "error",
        title: "Sign Out Failed",
        message: error.message || "Failed to sign out",
      });
    }
  };

  if (loading && !profile) {
    return (
      <ScreenContainer>
        <View style={styles.centerContainer}>
          <LoadingSpinner size="large" />
          <ThemedText textStyle={TextStyle.Body} style={styles.loadingText}>
            Loading profile...
          </ThemedText>
        </View>
      </ScreenContainer>
    );
  }

  if (!profile || !user) {
    return (
      <ScreenContainer>
        <View style={styles.centerContainer}>
          <Icon name="user" size={48} color={theme.colors.text + "40"} />
          <ThemedText textStyle={TextStyle.Body} style={styles.emptyText}>
            Profile not found
          </ThemedText>
        </View>
      </ScreenContainer>
    );
  }

  const winRate = stats?.winRate?.toFixed(1) || "0.0";
  const avgPoints = stats?.averagePoints?.toFixed(1) || "0.0";

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section with Gradient */}
        <View
          style={styles.heroSection}
        >
          {/* Edit Button */}
          {!isEditing && (
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              style={[styles.editIconButton]}
            >
              <Icon name="edit" size={28} color={theme.colors.primary} />
            </TouchableOpacity>
          )}

          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={isDark ? ["#475569", "#334155"] : ["#ffffff", "#f1f5f9"]}
              style={[styles.avatar, { borderColor: theme.colors.primary + "40" }]}
            >
              <Icon name="user" size={48} color={theme.colors.text + "80"} />
            </LinearGradient>
          </View>

          {/* Name & Details */}
          <ThemedText textStyle={TextStyle.Header} style={styles.heroName}>
            {profile.firstName} {profile.lastName}
          </ThemedText>

          {isEditing ? (
            <View style={styles.heroEditContainer}>
              <View style={[styles.heroEditInput, { backgroundColor: theme.componentBackground + "CC" }]}>
                <Icon name="trophy" size={14} color={theme.colors.primary} />
                <View style={styles.skillLevelInlineContainer}>
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <TouchableOpacity
                      key={level}
                      onPress={() => setEditSkillLevel(level)}
                      style={[
                        styles.skillChip,
                        {
                          backgroundColor:
                            editSkillLevel === level
                              ? theme.colors.primary
                              : "transparent",
                        },
                      ]}
                    >
                      <ThemedText
                        textStyle={TextStyle.BodySmall}
                        style={{
                          color: editSkillLevel === level ? "#FFFFFF" : theme.colors.text,
                          fontSize: 12,
                        }}
                      >
                        {level}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.heroSkillBadge}>
              <Icon name="trophy" size={14} color={theme.colors.primary} />
              <ThemedText
                textStyle={TextStyle.BodyMedium}
                style={[styles.heroSkillText, { color: theme.colors.primary }]}
              >
                {profile.skillLevel}
              </ThemedText>
            </View>
          )}

          {isEditing ? (
            <View style={[styles.heroEditInput, { backgroundColor: theme.componentBackground + "CC" }]}>
              <Icon name="map-pin" size={14} color={theme.colors.text + "80"} />
              <TextInput
                style={[styles.inlineInput, { color: theme.colors.text }]}
                placeholder="City, Country"
                placeholderTextColor={theme.colors.text + "60"}
                value={editLocation}
                onChangeText={setEditLocation}
              />
            </View>
          ) : (
            profile.location && (
              <View style={styles.heroDetailRow}>
                <Icon name="map-pin" size={14} color={theme.colors.text + "80"} />
                <ThemedText textStyle={TextStyle.BodyMedium} style={styles.heroDetailText}>
                  {profile.location}
                </ThemedText>
              </View>
            )
          )}

          {profile.createdAt && (
            <View style={styles.heroDetailRow}>
              <Icon name="calendar" size={14} color={theme.colors.text + "80"} />
              <ThemedText textStyle={TextStyle.BodyMedium} style={styles.heroDetailText}>
                Joined {new Date(profile.createdAt).toLocaleDateString()}
              </ThemedText>
            </View>
          )}

          {/* Quick Stats */}
          <View style={styles.quickStatsGrid}>
            <View style={[styles.quickStatCard, { backgroundColor: theme.componentBackground + "99" }]}>
              <ThemedText textStyle={TextStyle.Header} style={styles.quickStatValue}>
                {stats?.totalGames || 0}
              </ThemedText>
              <ThemedText textStyle={TextStyle.BodySmall} style={styles.quickStatLabel}>
                Games
              </ThemedText>
            </View>
            <View style={[styles.quickStatCard, { backgroundColor: theme.componentBackground + "99" }]}>
              <ThemedText
                textStyle={TextStyle.Header}
                style={[styles.quickStatValue, { color: theme.colors.success }]}
              >
                {winRate}%
              </ThemedText>
              <ThemedText textStyle={TextStyle.BodySmall} style={styles.quickStatLabel}>
                Win Rate
              </ThemedText>
            </View>
            <View style={[styles.quickStatCard, { backgroundColor: theme.componentBackground + "99" }]}>
              <ThemedText textStyle={TextStyle.Header} style={styles.quickStatValue}>
                {stats?.activeLeagues || 0}
              </ThemedText>
              <ThemedText textStyle={TextStyle.BodySmall} style={styles.quickStatLabel}>
                Leagues
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Edit Mode Actions */}
          {isEditing && (
            <View style={styles.editActions}>
              <Button
                text="Cancel"
                variant="outline"
                onPress={() => {
                  setIsEditing(false);
                  if (profile) {
                    setEditBio(profile.bio || "");
                    setEditLocation(profile.location || "");
                    setEditSkillLevel(profile.skillLevel || "Beginner");
                  }
                }}
                style={styles.editActionButton}
              />
              <Button
                text="Save Changes"
                onPress={handleSaveProfile}
                loading={isSaving}
                disabled={isSaving}
                style={styles.editActionButton}
              />
            </View>
          )}

          {/* About Section */}
          <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Icon name="user" size={20} color={theme.colors.primary} />
              <ThemedText textStyle={TextStyle.Subheader}>About</ThemedText>
            </View>
            {isEditing ? (
              <TextInput
                style={[
                  styles.bioInput,
                  {
                    backgroundColor: theme.componentBackground,
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                  },
                ]}
                placeholder="Tell everyone about yourself..."
                placeholderTextColor={theme.colors.text + "60"}
                value={editBio}
                onChangeText={setEditBio}
                multiline
                numberOfLines={4}
              />
            ) : (
              <ThemedText textStyle={TextStyle.Body} style={styles.bioText}>
                {profile.bio || "No bio yet. Tap edit to add one!"}
              </ThemedText>
            )}
          </Card>

          {/* Performance Card */}
          <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Icon name="trending-up" size={20} color={theme.colors.success} />
              <ThemedText textStyle={TextStyle.Subheader}>Performance</ThemedText>
            </View>
            <View style={styles.performanceGrid}>
              <View style={styles.performanceItem}>
                <ThemedText textStyle={TextStyle.BodySmall} style={styles.performanceLabel}>
                  Avg Points
                </ThemedText>
                <ThemedText textStyle={TextStyle.Header} style={styles.performanceValue}>
                  {avgPoints}
                </ThemedText>
              </View>
              <View style={styles.performanceItem}>
                <ThemedText textStyle={TextStyle.BodySmall} style={styles.performanceLabel}>
                  Total Points
                </ThemedText>
                <ThemedText textStyle={TextStyle.Header} style={styles.performanceValue}>
                  {stats?.totalPoints || 0}
                </ThemedText>
              </View>
            </View>
          </Card>

          {/* Contact Info */}
          <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Icon name="mail" size={20} color={theme.colors.primary} />
              <ThemedText textStyle={TextStyle.Subheader}>Contact</ThemedText>
            </View>
            <View style={styles.contactRow}>
              <Icon name="mail" size={16} color={theme.colors.text + "80"} />
              <ThemedText textStyle={TextStyle.Body} style={styles.contactText}>
                {profile.email}
              </ThemedText>
            </View>
            {profile.location && (
              <View style={styles.contactRow}>
                <Icon name="map-pin" size={16} color={theme.colors.text + "80"} />
                <ThemedText textStyle={TextStyle.Body} style={styles.contactText}>
                  {profile.location}
                </ThemedText>
              </View>
            )}
          </Card>

          {/* Sign Out Button */}
          <Button
            text="Sign Out"
            variant="outline"
            onPress={handleSignOut}
            leftIcon="logout"
            style={styles.signOutButton}
          />
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
  scrollContent: {
    paddingBottom: 100,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    opacity: 0.7,
  },
  emptyText: {
    opacity: 0.5,
  },
  heroSection: {
    paddingTop: 40,
    marginBottom: 20,
    paddingHorizontal: padding,
    alignItems: "center",
    position: "relative",
  },
  editIconButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  heroName: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  heroSkillBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  heroSkillText: {
    fontWeight: "600",
  },
  heroDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  heroDetailText: {
    opacity: 0.8,
  },
  heroEditContainer: {
    width: "100%",
    marginBottom: 8,
  },
  heroEditInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  skillLevelInlineContainer: {
    flexDirection: "row",
    flex: 1,
    gap: 4,
  },
  skillChip: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  inlineInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 4,
  },
  quickStatsGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    width: "100%",
  },
  quickStatCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  quickStatValue: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  quickStatLabel: {
    opacity: 0.7,
    fontSize: 12,
  },
  contentSection: {
    paddingHorizontal: padding,
    gap: 16,
  },
  editActions: {
    flexDirection: "row",
    gap: 12,
  },
  editActionButton: {
    flex: 1,
  },
  sectionCard: {
    ...GlobalStyles.container,
    gap: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bioInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    height: 100,
    textAlignVertical: "top",
  },
  bioText: {
    opacity: 0.8,
    lineHeight: 22,
  },
  performanceGrid: {
    flexDirection: "row",
    gap: 16,
  },
  performanceItem: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  performanceLabel: {
    opacity: 0.7,
  },
  performanceValue: {
    fontSize: 28,
    fontWeight: "700",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  contactText: {
    opacity: 0.8,
  },
  signOutButton: {
    marginTop: 8,
  },
  bottomSpacing: {
    height: 32,
  },
});
