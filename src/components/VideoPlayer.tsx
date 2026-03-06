import { ResizeMode, Video } from 'expo-av';
import { useRef } from 'react';
import { StyleSheet } from 'react-native';

type Props = {
  uri: string;
  isVisible: boolean;
};

export default function VideoPlayer({ uri, isVisible }: Props) {
  const ref = useRef<Video>(null);

  return (
    <Video
      ref={ref}
      source={{ uri }}
      style={StyleSheet.absoluteFill}
      resizeMode={ResizeMode.COVER}
      isLooping
      isMuted
      shouldPlay={isVisible}
    />
  );
}
