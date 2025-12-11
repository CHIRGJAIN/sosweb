import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import signals from '../data/distressSignals';
import ListItem from '../components/ListItem';

export default function DistressMonitorScreen() {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={signals}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <ListItem
            title={`${item.sender?.name} — ${item.type.toUpperCase()}`}
            subtitle={`${item.location?.address || item.geo} • ${item.date} ${item.time}`}
            right={<Text style={{ color: '#c00' }}>{item.feedback || 'new'}</Text>}
          />
        )}
      />
    </View>
  );
}
