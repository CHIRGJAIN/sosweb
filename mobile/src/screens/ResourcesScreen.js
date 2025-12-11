import React, { useState } from 'react';
import { View, FlatList, Button } from 'react-native';
import resources from '../data/resources';
import ListItem from '../components/ListItem';

export default function ResourcesScreen() {
  const [cat, setCat] = useState('all');
  const cats = Array.from(new Set(resources.map(r => r.category)));
  const filtered = cat === 'all' ? resources : resources.filter(r => r.category === cat);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', padding: 8 }}>
        <Button title="all" onPress={() => setCat('all')} />
        {cats.map(c => <Button key={c} title={c} onPress={() => setCat(c)} />)}
      </View>
      <FlatList data={filtered} keyExtractor={i => i.id} renderItem={({ item }) => (
        <ListItem title={item.title} subtitle={`${item.category} • ${item.region}`} />
      )} />
    </View>
  );
}
