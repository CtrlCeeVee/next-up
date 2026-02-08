import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, ViewStyle, Animated, StyleSheet } from "react-native";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: Animated.Value;
  animation: Animated.CompositeAnimation;
}

interface ShootingStar {
  id: number;
  translateX: Animated.Value;
  translateY: Animated.Value;
  opacity: Animated.Value;
  startX: number;
  startY: number;
  trailSegments: Array<{
    translateX: Animated.Value;
    translateY: Animated.Value;
    opacity: Animated.Value;
  }>;
}

const STAR_OPACITY = 0.2;
const SHOOTING_STAR_MIN_DELAY = 10_000;
const MAX_STARS = 150;

export const StarryBackgroundComponent = ({
  children,
  style,
  animated = true,
  starColor = "#FFFFFF",
  shootingStarColor = "#FFFFFF",
}: {
  children?: React.ReactNode;
  style?: ViewStyle;
  animated?: boolean;
  starColor?: string;
  shootingStarColor?: string;
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [stars, setStars] = useState<Star[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);

  const shootingStarId = useRef(0);
  const timeouts = useRef<NodeJS.Timeout[]>([]);
  const starAnimations = useRef<Animated.CompositeAnimation[]>([]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#18181b",
        },
        star: {
          position: "absolute",
          borderRadius: 999,
          backgroundColor: starColor,
        },
        shootingStar: {
          position: "absolute",
          width: 3,
          height: 3,
          borderRadius: 999,
          backgroundColor: shootingStarColor,
          shadowColor: shootingStarColor,
          shadowOffset: { width: -8, height: -8 },
          shadowOpacity: 1,
          shadowRadius: 8,
        },
        shootingStarTrail: {
          position: "absolute",
          width: 2.5,
          height: 2.5,
          borderRadius: 999,
          backgroundColor: shootingStarColor,
        },
        content: {
          position: "relative",
          zIndex: 1,
        },
      }),
    [starColor, shootingStarColor]
  );

  /* -------------------- STARS -------------------- */
  useEffect(() => {
    if (!animated || dimensions.width === 0 || dimensions.height === 0) return;

    starAnimations.current.forEach((a) => a.stop());
    starAnimations.current = [];

    const starCount = Math.min(
      MAX_STARS,
      Math.floor((dimensions.width * dimensions.height) / 2500)
    );

    const generated: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      const opacity = new Animated.Value(Math.random() * STAR_OPACITY);

      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: Math.random() * 0.5 + STAR_OPACITY,
            duration: Math.random() * 3000 + 2000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: Math.random() * STAR_OPACITY,
            duration: Math.random() * 3000 + 2000,
            useNativeDriver: true,
          }),
        ])
      );

      starAnimations.current.push(animation);
      animation.start();

      generated.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 2 + 1,
        opacity,
        animation,
      });
    }

    setStars(generated);

    return () => {
      starAnimations.current.forEach((a) => a.stop());
      starAnimations.current = [];
    };
  }, [dimensions, animated]);

  /* -------------------- SHOOTING STARS -------------------- */
  useEffect(() => {
    if (!animated || dimensions.width === 0 || dimensions.height === 0) return;

    const createShootingStar = () => {
      const startX = Math.random() * dimensions.width * 0.5;
      const startY = Math.random() * dimensions.height * 0.3;

      const translateX = new Animated.Value(0);
      const translateY = new Animated.Value(0);
      const opacity = new Animated.Value(0);

      const trailSegments = Array.from({ length: 8 }).map(() => ({
        translateX: new Animated.Value(0),
        translateY: new Animated.Value(0),
        opacity: new Animated.Value(0),
      }));

      const id = shootingStarId.current++;

      setShootingStars((prev) => [
        ...prev,
        { id, translateX, translateY, opacity, startX, startY, trailSegments },
      ]);

      const distance = Math.min(dimensions.width, dimensions.height) * 0.4;
      const duration = 1500;

      Animated.parallel([
        Animated.timing(translateX, {
          toValue: distance,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: distance,
          duration,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: duration * 0.1,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: duration * 0.9,
            useNativeDriver: true,
          }),
        ]),
        ...trailSegments.map((segment, index) =>
          Animated.sequence([
            Animated.delay(index * 50),
            Animated.parallel([
              Animated.timing(segment.translateX, {
                toValue: distance,
                duration,
                useNativeDriver: true,
              }),
              Animated.timing(segment.translateY, {
                toValue: distance,
                duration,
                useNativeDriver: true,
              }),
              Animated.sequence([
                Animated.timing(segment.opacity, {
                  toValue: 0.8 - index * 0.1,
                  duration: duration * 0.1,
                  useNativeDriver: true,
                }),
                Animated.timing(segment.opacity, {
                  toValue: 0,
                  duration: duration * 0.9,
                  useNativeDriver: true,
                }),
              ]),
            ]),
          ])
        ),
      ]).start(() => {
        setShootingStars((prev) => prev.filter((s) => s.id !== id));
      });
    };

    const schedule = () => {
      const timeout = setTimeout(
        () => {
          createShootingStar();
          schedule();
        },
        Math.random() * 8000 + SHOOTING_STAR_MIN_DELAY
      );

      timeouts.current.push(timeout);
    };

    schedule();

    return () => {
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];
    };
  }, [dimensions, animated]);

  /* -------------------- RENDER -------------------- */
  return (
    <View
      style={[styles.container, style]}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setDimensions({ width, height });
      }}
    >
      {stars.map((star) => (
        <Animated.View
          key={star.id}
          style={[
            styles.star,
            {
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            },
          ]}
        />
      ))}

      {shootingStars.map((star) => (
        <View key={star.id}>
          {star.trailSegments.map((seg, i) => (
            <Animated.View
              key={i}
              style={[
                styles.shootingStarTrail,
                {
                  left: star.startX,
                  top: star.startY,
                  opacity: seg.opacity,
                  transform: [
                    { translateX: seg.translateX },
                    { translateY: seg.translateY },
                  ],
                },
              ]}
            />
          ))}
          <Animated.View
            style={[
              styles.shootingStar,
              {
                left: star.startX,
                top: star.startY,
                opacity: star.opacity,
                transform: [
                  { translateX: star.translateX },
                  { translateY: star.translateY },
                ],
              },
            ]}
          />
        </View>
      ))}

      <View style={styles.content}>{children}</View>
    </View>
  );
};
