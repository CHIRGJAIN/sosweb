import React, { useState } from 'react';
import { View, FlatList, Button } from 'react-native';
import contributions from '../data/contributions';
import ListItem from '../components/ListItem';

export default function ContributionsScreen() {
  const [mode, setMode] = useState('all');
  const filtered = mode === 'all' ? contributions : contributions.filter(c => c.mode === mode);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', padding: 8 }}>
        <Button title="all" onPress={() => setMode('all')} />
        <Button title="made" onPress={() => setMode('made')} />
        <Button title="received" onPress={() => setMode('received')} />
      </View>
      <FlatList data={filtered} keyExtractor={i => i.id} renderItem={({ item }) => (
        <ListItem title={item.title} subtitle={`${item.date} • ${item.amount}`} />
      )} />
    </View>
  );
}
