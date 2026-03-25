import { Image, StyleSheet, Text, View } from 'react-native';

type Props = {
  name: string;
  photoUrl?: string;
  size?: number;
};

export function Avatar({ name, photoUrl, size = 40 }: Props) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const style = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (photoUrl) {
    return (
      <Image
        source={{ uri: photoUrl }}
        style={[styles.image, style]}
      />
    );
  }

  return (
    <View style={[styles.fallback, style]}>
      <Text style={[styles.initials, { fontSize: size * 0.36 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  fallback: {
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  initials: {
    color: '#fff',
    fontWeight: '700',
  },
});
