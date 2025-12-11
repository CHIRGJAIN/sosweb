import React from 'react';
import { View, Text, FlatList } from 'react-native';
import profile from '../data/profile';
import ListItem from '../components/ListItem';

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>{profile.name}</Text>
        <Text>Phone: {profile.phone}</Text>
        <Text>Emergency: {profile.emergencyContact}</Text>
        <Text>Address: {profile.address}</Text>
        <Text>KYC: {profile.kyc}</Text>
      </View>

      <Text style={{ padding: 12, fontWeight: '600' }}>Distress History</Text>
      <FlatList data={profile.distressHistory} keyExtractor={i => i.id} renderItem={({ item }) => (
        <ListItem title={item.label} subtitle={`${item.status} • ${item.responseTime}`} />
      )} />

      <Text style={{ padding: 12, fontWeight: '600' }}>Contributions</Text>
      <FlatList data={profile.contributions} keyExtractor={i => i.id} renderItem={({ item }) => (
        <ListItem title={item.title} subtitle={item.detail} />
      )} />
    </View>
  );
}
