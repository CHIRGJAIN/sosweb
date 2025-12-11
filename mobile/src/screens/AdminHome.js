import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import ngos from '../data/ngos';
import social from '../data/socialPosts';
import resources from '../data/resources';

export default function AdminHome() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 12 }}>
      <Text style={styles.h1}>SOS Command Center — Admin</Text>
      <Text style={styles.h2}>Snapshot</Text>
      <Text>NGOs: {ngos.length}</Text>
      <Text>Social posts: {social.length}</Text>
      <Text>Resources: {resources.length}</Text>
      <Text style={[styles.h2, { marginTop: 16 }]}>Quick Actions</Text>
      <Text>- Monitor distress signals</Text>
      <Text>- Review resource handling logs</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  h1: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  h2: { fontSize: 16, fontWeight: '600', marginTop: 12, marginBottom: 6 }
});
