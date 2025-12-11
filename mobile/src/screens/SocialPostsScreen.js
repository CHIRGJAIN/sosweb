import React, { useState } from 'react';
import { View, FlatList, Button } from 'react-native';
import posts, { SOCIAL_CATEGORIES } from '../data/socialPosts';
import ListItem from '../components/ListItem';

export default function SocialPostsScreen() {
  const [cat, setCat] = useState('all');
  const filtered = cat === 'all' ? posts : posts.filter(p => p.category === cat);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', padding: 8, justifyContent: 'space-between' }}>
        <Button title="all" onPress={() => setCat('all')} />
        {SOCIAL_CATEGORIES.map(c => (
          <Button key={c} title={c} onPress={() => setCat(c)} />
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <ListItem title={`${item.author} ${item.handle}`} subtitle={`${item.body} • ${item.location}`} />
        )}
      />
    </View>
  );
}
