import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import ngos from '../data/ngos';

export default function NGODetail({ route }) {
  const { id } = route.params;
  const ngo = ngos.find(n => n.id === id) || {};

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 12 }}>
      <Text style={styles.title}>{ngo.name}</Text>
      <Text style={styles.meta}>{ngo.category} • {ngo.level} • {ngo.location}</Text>
      <Text style={{ marginTop: 12 }}>{ngo.description}</Text>
      <Text style={{ marginTop: 12 }}>Raised: {ngo.raisedAmount} / Goal: {ngo.goalAmount}</Text>
      <Text>Progress: {ngo.progress}%</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#fff' }, title: { fontSize: 20, fontWeight: '700' }, meta: { color: '#666', marginTop: 6 } });
