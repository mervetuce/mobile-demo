import { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Filter } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { visaServices } from '@/data/visaServices';
import type { VisaService } from '@/types/visa';

export default function ServicesScreen() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { theme, isDarkMode } = useTheme();

  const filteredServices = visaServices.filter(service =>
    selectedFilter === 'all' || service.type === selectedFilter.toLowerCase()
  );

  const handleServicePress = (service: VisaService) => {
    router.push(`/services/${service.id}`);
  };

  const handleApplyPress = (serviceId: number) => {
    router.push({
      pathname: '/services/apply',
      params: { serviceId }
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: theme.text }]}>Visa Services</Text>
          <Text style={[styles.subtitle, { color: isDarkMode ? '#aaa' : '#666' }]}>Find the right visa for your needs</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.filterHeader}>
          <Filter size={20} color={isDarkMode ? theme.text : '#000'} />
          <Text style={[styles.filterTitle, { color: theme.text }]}>Filter by type</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'all' && styles.filterButtonActive,
              { backgroundColor: selectedFilter === 'all' ? theme.buttonBackground : isDarkMode ? '#333' : '#f8f9fa' }
            ]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === 'all' && styles.filterButtonTextActive,
                { color: selectedFilter === 'all' ? theme.buttonText : isDarkMode ? '#aaa' : '#666' }
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'tourist' && styles.filterButtonActive,
              { backgroundColor: selectedFilter === 'tourist' ? theme.buttonBackground : isDarkMode ? '#333' : '#f8f9fa' }
            ]}
            onPress={() => setSelectedFilter('tourist')}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === 'tourist' && styles.filterButtonTextActive,
                { color: selectedFilter === 'tourist' ? theme.buttonText : isDarkMode ? '#aaa' : '#666' }
              ]}
            >
              Tourist
            </Text>
          </TouchableOpacity>
          {/* ...other filter buttons with similar styling... */}
        </ScrollView>
      </View>

      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.serviceCard, { backgroundColor: theme.card }]}>
            <Image source={{ uri: item.image }} style={styles.serviceImage} />
            <View style={styles.serviceContent}>
              <Text style={[styles.serviceTitle, { color: theme.text }]}>{item.title}</Text>
              <Text style={[styles.serviceDescription, { color: isDarkMode ? '#aaa' : '#666' }]}>
                {item.description}
              </Text>
              <Text style={[styles.servicePrice, { color: theme.accent }]}>{item.price}</Text>
              <TouchableOpacity
                style={[styles.applyButton, { backgroundColor: theme.buttonBackground }]}
                onPress={() => handleApplyPress(item.id)}
              >
                <Text style={[styles.applyButtonText, { color: theme.buttonText }]}>
                  Apply Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.servicesContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  filterContainer: {
    paddingVertical: 16,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonActive: {
    borderWidth: 1,
    borderColor: '#000',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    fontWeight: 'bold',
  },
  servicesContainer: {
    padding: 16,
  },
  serviceCard: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  serviceImage: {
    width: '100%',
    height: 200,
  },
  serviceContent: {
    padding: 16,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  applyButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});