import { useCallback, useEffect } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import { useAudioPlayer } from 'expo-audio';
import { PlayingCard } from '@/components/PlayingCard';
import { BicycleCard } from '@/components/BicycleCard';
import { CARD } from '@/components/constants';

export function CardDeck({ playingCard, shouldFlip, onFlipComplete, style }) {
  const N = 13;
  const flip = useSharedValue(0);
  const preSpringUpward = useSharedValue(0);
  const spring = useSharedValue(0);
  const postSpringUpward = useSharedValue(0);
  const shufflePlayer = useAudioPlayer(require('@/assets/shuffle.mp3'));

  const playShuffle = useCallback(() => {
    shufflePlayer.seekTo(0);
    shufflePlayer.play();
  }, [shufflePlayer]);

  const downFaceFlipAnimation = useAnimatedStyle(() => {
    const rotateY = interpolate(flip.value, [0, 1], [0, 180]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: rotateY + 'deg' }],
      backfaceVisibility: 'hidden'
    };
  });

  const upFaceFlipAnimation = useAnimatedStyle(() => {
    const rotateY = interpolate(flip.value, [0, 1], [180, 360]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: rotateY + 'deg' }],
      backfaceVisibility: 'hidden'
    };
  });

  const SpringAnimation = (index) =>
    useAnimatedStyle(() => {
      const delay = 0.5 / N;
      const progress = spring.value - index * delay;
      const preSpringUpwardTranslateY = interpolate(
        preSpringUpward.value,
        [0, 1],
        [0, -CARD.height / 2]
      );
      const springTranslateX = interpolate(
        progress,
        [0, 0.25, 0.5],
        [0, CARD.width, 0],
        'clamp'
      );
      const springTranslateY = interpolate(
        progress,
        [0, 0.5],
        [0, CARD.height],
        'clamp'
      );
      const springRotate = interpolate(
        progress,
        [0, 0.25, 0.5],
        [0, 45, 0],
        'clamp'
      );
      const scale = interpolate(progress, [0, 0.25, 0.5], [1, 0.9, 1], 'clamp');
      const rotateY = interpolate(
        progress,
        [0, 0.25, 0.5],
        [0, 90, 0],
        'clamp'
      );
      const postSpringUpwardTranslateY = interpolate(
        postSpringUpward.value,
        [0, 1],
        [0, -CARD.height / 2]
      );
      const transforms = [
        { translateX: springTranslateX },
        {
          translateY:
            preSpringUpwardTranslateY +
            springTranslateY +
            postSpringUpwardTranslateY
        },
        { rotate: springRotate + 'deg' },
        { scale }
      ];
      if (Platform.OS === 'web')
        transforms.push({ perspective: 1000 }, { rotateY: rotateY + 'deg' });
      return { transform: transforms };
    });

  const doCardistry = useCallback(() => {
    flip.value = withTiming(0, { duration: 300 }, () => {
      preSpringUpward.value = withTiming(1, { duration: 500 }, () => {
        runOnJS(playShuffle)();
        spring.value = withTiming(1, { duration: 1000 }, () => {
          postSpringUpward.value = withTiming(1, { duration: 500 }, () => {
            flip.value = withTiming(1, { duration: 300 }, () => {
              preSpringUpward.value = spring.value = postSpringUpward.value = 0;
            });
          });
        });
      });
    });
  }, [flip, preSpringUpward, spring, postSpringUpward, playShuffle]);

  useEffect(() => {
    if (shouldFlip) {
      doCardistry();
      onFlipComplete?.();
    }
  }, [shouldFlip, doCardistry, onFlipComplete]);

  return (
    <View style={[styles.deck, style]}>
      {Array.from({ length: N }, (_, i) => (
        <Animated.View
          key={i}
          style={[SpringAnimation(i), { position: 'absolute', zIndex: i }]}
        >
          <BicycleCard />
        </Animated.View>
      ))}
      <View style={{ zIndex: N }}>
        <Animated.View style={[downFaceFlipAnimation, SpringAnimation(N)]}>
          <BicycleCard />
        </Animated.View>
        <Animated.View style={[upFaceFlipAnimation, { position: 'absolute' }]}>
          <PlayingCard
            heading={playingCard.heading}
            label={playingCard.label}
            sublabel={playingCard.sublabel}
            content={playingCard.content}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  deck: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
