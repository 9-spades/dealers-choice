import { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CardDeck } from '@/components/CardDeck';

export default function App() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          if (!isFlipped) setIsFlipped(!isFlipped);
        }}
      >
        <CardDeck
          playingCard={{
            heading: 'You just wait, sunshine',
            label: '',
            sublabel: 'Site under development',
            content: {
              name: 'Andres Romero',
              title: 'Software Engineer',
              email: '9-spades@proton.me',
              skills: [
                'Scrum',
                'API design & development',
                'Java',
                'Gradle',
                'Python',
                'C',
                'AWS',
                'OCI',
                'Relational DBs',
                'Docker',
                'git & ade'
              ],
              active: true,
              experience: 2
            }
          }}
          shouldFlip={isFlipped}
        />
      </Pressable>
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
