import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useApplications } from '@/context/ApplicationContext';
import { Briefcase, Globe, Mail, Phone, User, Calendar, FileText } from 'lucide-react-native';

export default function ApplicationDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { applications } = useApplications();
  const application = applications.find(app => app.id === id);

  if (!application) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Application not found</Text>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#22c55e';
      case 'rejected':
        return '#ef4444';
      case 'in_progress':
        return '#3b82f6';
      default:
        return '#f59e0b';
    }
  };

  const getVisaTypeIcon = (visaType: string) => {
    if (visaType.toLowerCase().includes('tourist')) {
      return <Globe size={24} color="#666" />;
    }
    return <Briefcase size={24} color="#666" />;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {getVisaTypeIcon(application.visaType)}
          <Text style={styles.title}>{application.visaType}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(application.status) }]}>
          <Text style={styles.statusText}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FileText size={24} color="#666" />
            <Text style={styles.sectionTitle}>Application Details</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.label}>Application ID</Text>
            <Text style={styles.value}>{application.id}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.label}>Submission Date</Text>
            <View style={styles.valueWithIcon}>
              <Calendar size={16} color="#666" />
              <Text style={styles.value}>{application.submissionDate}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={24} color="#666" />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.value}>{application.fullName}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.label}>Nationality</Text>
            <Text style={styles.value}>{application.nationality}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.label}>Passport Number</Text>
            <Text style={styles.value}>{application.passportNumber}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Mail size={24} color="#666" />
            <Text style={styles.sectionTitle}>Contact Information</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{application.email}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.label}>Phone</Text>
            <View style={styles.valueWithIcon}>
              <Phone size={16} color="#666" />
              <Text style={styles.value}>{application.phone}</Text>
            </View>
          </View>
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
  header: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  valueWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 40,
  },
});