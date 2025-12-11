import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ListItem({ title, subtitle, right, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right ? <View style={{ marginLeft: 8 }}>{right}</View> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: { fontSize: 16, fontWeight: '600' },
  subtitle: { color: '#666', marginTop: 4 }
});
