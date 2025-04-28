import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { visaServices } from '@/data/visaServices';

export default function VisaDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const service = visaServices.find(s => s.id === Number(id));

  if (!service) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Visa service not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: service.image }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{service.title}</Text>
        <Text style={styles.price}>{service.price}</Text>
        <Text style={styles.description}>{service.description}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Processing Time</Text>
          <Text style={styles.sectionText}>{service.processingTime}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          {service.requirements?.map((requirement, index) => (
            <Text key={index} style={styles.listItem}>• {requirement}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eligibility</Text>
          {service.eligibility?.map((item, index) => (
            <Text key={index} style={styles.listItem}>• {item}</Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: '#2563eb',
    fontWeight: '600',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  listItem: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    paddingLeft: 8,
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 40,
  },
});