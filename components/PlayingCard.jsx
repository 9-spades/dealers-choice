import { useState, useRef } from 'react';
import { StyleSheet, View, Text, PanResponder, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { JsonContent } from '@/components/JsonContent';
import { CARD } from '@/components/constants';

export function PlayingCard({ heading, label, sublabel, content, style }) {
  const [offset, setOffset] = useState(null);
  const progress = useSharedValue(0);

  const swipe = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const range = CARD.height - (offset + 2 * styles.swiper.padding);
        const { dy } = gestureState;
        progress.value =
          (dy < 0 ? Math.min(range, -dy) : Math.max(0, range - dy)) / range;
      },
      onPanResponderRelease: (evt, gestureState) =>
        (progress.value = withSpring(
          progress.value > 0.5 || gestureState.vy < -0.5 ? 1 : 0
        ))
    })
  ).current;

  const swiperAnimation = useAnimatedStyle(() => {
    return {
      height: interpolate(
        progress.value,
        [0, 1],
        [offset + 2 * styles.swiper.padding, CARD.height]
      )
    };
  });

  const labelAnimation = useAnimatedStyle(() => {
    return {
      fontSize: interpolate(
        progress.value,
        [0, 1],
        [styles.label.fontSize, styles.label.fontSize / 2]
      ),
      opacity: interpolate(progress.value, [0, 1], [1, 0])
    };
  });

  const sublabelAnimation = useAnimatedStyle(() => {
    return {
      fontSize: interpolate(
        progress.value,
        [0, 1],
        [styles.sublabel.fontSize, styles.sublabel.fontSize / 2]
      ),
      opacity: interpolate(progress.value, [0, 1], [1, 0])
    };
  });

  const iconAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: interpolate(progress.value, [0, 1], [0, 180]) + 'deg' }
      ]
    };
  });

  return (
    <View style={[styles.card, style]}>
      <LinearGradient
        colors={['#581C87', '#A21CAF', '#F0E68C']}
        style={styles.background}
      />
      <View>
        <Text style={styles.heading}>{heading}</Text>
      </View>
      <Animated.View
        style={[styles.swiper, offset && swiperAnimation]}
        {...swipe.panHandlers}
      >
        <View
          onLayout={(evt) => {
            if (!offset) setOffset(evt.nativeEvent.layout.height);
          }}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <View>
            <Animated.Text style={[styles.label, offset && labelAnimation]}>
              {label}
            </Animated.Text>
            <Animated.Text
              style={[styles.sublabel, offset && sublabelAnimation]}
            >
              {sublabel}
            </Animated.Text>
          </View>
          <Animated.View style={[styles.button, offset && iconAnimation]}>
            <Pressable
              onPress={() => (progress.value = withSpring(!progress.value))}
            >
              <MaterialCommunityIcons
                name='cards-spade-outline'
                size={24}
                color='white'
              />
            </Pressable>
          </Animated.View>
        </View>
        <View style={{ paddingTop: 16 }}>
          <JsonContent obj={content} style='dark' />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD.width,
    height: CARD.height,
    borderRadius: CARD.borderRadius,
    overflow: 'hidden'
  },
  background: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  heading: {
    color: 'white',
    fontSize: 60,
    fontWeight: 100,
    padding: 16
  },
  swiper: {
    backgroundColor: 'black',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16
  },
  label: {
    color: 'white',
    fontSize: 20
  },
  sublabel: {
    color: 'gray',
    fontSize: 14
  },
  button: {
    position: 'absolute',
    right: 0
  }
});
