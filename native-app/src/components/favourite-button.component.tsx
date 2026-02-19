import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
} from "react-native";
import { Container, Icon, useAuthState, useLeaguesState } from "..";
import { useTheme } from "../core/theme";
import {
  roundingFull,
  paddingSmall,
  MIN_TEXTLESS_BUTTON_SIZE,
} from "../core/styles";
import { League } from "../features/leagues/types";
import { useEffect, useMemo, useState } from "react";
import { getService } from "../di";
import { InjectableType } from "../di";
import { LeaguesService } from "../features/leagues/services/leagues.service";

export const FavouriteButtonComponent = ({
  style,
  league,
}: {
  style?: StyleProp<ViewStyle>;
  league?: League;
}) => {
  const { theme } = useTheme();

  const [isFavourited, setIsFavourited] = useState(false);

  const favouriteLeague = useLeaguesState((state) => state.favouriteLeague);
  const unfavouriteLeague = useLeaguesState((state) => state.unfavouriteLeague);
  const { user } = useAuthState();

  const [isLoadingFavourited, setIsLoadingFavourited] = useState(false);
  const leaguesService = getService<LeaguesService>(InjectableType.LEAGUES);

  useEffect(() => {
    if (!user || !league) return;
    if (isLoadingFavourited) return;

    const init = async () => {
      setIsLoadingFavourited(true);
      try {
        const favouritedResponse = await leaguesService.getIsFavourite(
          league.id,
          user.id
        );
        const favourited = favouritedResponse.isFavourite;
        setIsFavourited(favourited);
      } catch (error) {
        console.error("Error checking if league is favourited:", error);
      } finally {
        setIsLoadingFavourited(false);
      }
    };

    init();
  }, [user, league]);

  const handlePress = async () => {
    if (!user || !league) return;
    if (isLoadingFavourited) return;

    setIsLoadingFavourited(true);
    try {
      if (isFavourited) {
        await unfavouriteLeague(league.id, user.id);
        setIsFavourited(false);
      } else {
        await favouriteLeague(league.id, user.id);
        setIsFavourited(true);
      }
    } catch (error) {
      console.error("Error checking if league is favourited:", error);
    } finally {
      setIsLoadingFavourited(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.heartButtonContainer, style]}
      accessibilityRole="button"
      accessibilityLabel="Toggle favorite league"
    >
      {isLoadingFavourited ? (
        <ActivityIndicator size="small" color={theme.colors.primaryDark} />
      ) : (
        <Container
          column
          rounding={roundingFull}
          padding={paddingSmall}
          style={{
            backgroundColor: isFavourited
              ? theme.colors.primaryDark + "80"
              : "#dddddd80",
          }}
        >
          <Icon
            name="heart"
            size={16}
            color={isFavourited ? theme.colors.primaryDark : "#fff"}
          />
        </Container>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  heartButtonContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: MIN_TEXTLESS_BUTTON_SIZE,
    height: MIN_TEXTLESS_BUTTON_SIZE,
  },
});
