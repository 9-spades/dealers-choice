import { View, ImageBackground } from 'react-native';
import { CARD } from '@/components/constants';

export function BicycleCard({ style }) {
  return (
    <View style={style}>
      <ImageBackground
        source={require('@/assets/bicycle.png')}
        style={{
          width: CARD.width,
          height: CARD.height,
          borderRadius: CARD.borderRadius,
          overflow: 'hidden'
        }}
        resizeMode='cover'
      />
    </View>
  );
}
