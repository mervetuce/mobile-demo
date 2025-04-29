import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { visaServices } from '@/data/visaServices';
import { useApplications } from '@/context/ApplicationContext';
import { useUser } from '@/context/UserContext';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  passportNumber: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function ApplyScreen() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const service = visaServices.find(s => s.id === Number(serviceId));
  const { addApplication } = useApplications();
  const { user } = useUser();
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    nationality: '',
    passportNumber: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must contain only digits';
    }

    if (!formData.nationality.trim()) {
      newErrors.nationality = 'Nationality is required';
    }

    if (!formData.passportNumber.trim()) {
      newErrors.passportNumber = 'Passport number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      if (service && user) {
        addApplication({
          visaType: service.title,
          status: 'pending',
          submissionDate: new Date().toISOString().split('T')[0],
          userId: user.id,
        });

        Alert.alert(
          'Application Submitted',
          'Your visa application has been submitted successfully.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    }
  };

  if (!service) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Service not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Apply for {service.title}</Text>
        <Text style={styles.subtitle}>Please fill in your details below</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, errors.fullName && styles.inputError]}
            value={formData.fullName}
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            placeholder="Enter your full name"
          />
          {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nationality</Text>
          <TextInput
            style={[styles.input, errors.nationality && styles.inputError]}
            value={formData.nationality}
            onChangeText={(text) => setFormData({ ...formData, nationality: text })}
            placeholder="Enter your nationality"
          />
          {errors.nationality && <Text style={styles.errorText}>{errors.nationality}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Passport Number</Text>
          <TextInput
            style={[styles.input, errors.passportNumber && styles.inputError]}
            value={formData.passportNumber}
            onChangeText={(text) => setFormData({ ...formData, passportNumber: text })}
            placeholder="Enter your passport number"
            autoCapitalize="characters"
          />
          {errors.passportNumber && <Text style={styles.errorText}>{errors.passportNumber}</Text>}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Application</Text>
        </TouchableOpacity>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    padding: 20,
    gap: 20,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});