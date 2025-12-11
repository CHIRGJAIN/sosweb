import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import ngos from '../data/ngos';
import ListItem from '../components/ListItem';

export default function NGOsScreen({ navigation }) {
  const [level, setLevel] = useState('all');

  const levels = ['all','district','state','national','global'];
  const filtered = level === 'all' ? ngos : ngos.filter(n => n.level === level);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.filterRow}>
        {levels.map(l => (
          <Button key={l} title={l} onPress={() => setLevel(l)} />
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            subtitle={`${item.category} • ${item.location} • ${item.progress}%`}
            onPress={() => navigation.navigate('NGODetail', { id: item.id })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({ filterRow: { padding: 8, flexDirection: 'row', justifyContent: 'space-between' } });
