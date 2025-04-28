import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { MessageCircle, Phone, Mail } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function SupportScreen() {
  const { theme, isDarkMode } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Customer Support</Text>
        <Text style={[styles.headerSubtitle, { color: isDarkMode ? '#aaa' : '#666' }]}>We're here to help</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact Methods</Text>
        <View style={styles.contactMethods}>
          <View style={[styles.contactMethod, { backgroundColor: theme.card }]}>
            <Mail size={24} color={isDarkMode ? theme.text : '#000'} />
            <Text style={[styles.contactTitle, { color: theme.text }]}>Email</Text>
            <Text style={[styles.contactText, { color: theme.accent }]}>support@visify.com</Text>
            <Text style={[styles.contactHours, { color: isDarkMode ? '#aaa' : '#666' }]}>24/7 Support</Text>
          </View>
          <View style={[styles.contactMethod, { backgroundColor: theme.card }]}>
            <Phone size={24} color={isDarkMode ? theme.text : '#000'} />
            <Text style={[styles.contactTitle, { color: theme.text }]}>Phone</Text>
            <Text style={[styles.contactText, { color: theme.accent }]}>+1 (800) 123-4567</Text>
            <Text style={[styles.contactHours, { color: isDarkMode ? '#aaa' : '#666' }]}>Mon-Fri: 9AM-6PM</Text>
          </View>
          <View style={[styles.contactMethod, { backgroundColor: theme.card }]}>
            <MessageCircle size={24} color={isDarkMode ? theme.text : '#000'} />
            <Text style={[styles.contactTitle, { color: theme.text }]}>Live Chat</Text>
            <Text style={[styles.contactText, { color: theme.accent }]}>Chat with an Agent</Text>
            <Text style={[styles.contactHours, { color: isDarkMode ? '#aaa' : '#666' }]}>Available 9AM - 6PM</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Send us a Message</Text>
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Name</Text>
            <TextInput
              style={[styles.input, {
                backgroundColor: theme.inputBackground,
                color: theme.text,
                borderColor: theme.inputBorder
              }]}
              placeholder="Enter your name"
              placeholderTextColor={theme.placeholderText}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Email</Text>
            <TextInput
              style={[styles.input, {
                backgroundColor: theme.inputBackground,
                color: theme.text,
                borderColor: theme.inputBorder
              }]}
              placeholder="Enter your email"
              placeholderTextColor={theme.placeholderText}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Message</Text>
            <TextInput
              style={[styles.input, styles.textArea, {
                backgroundColor: theme.inputBackground,
                color: theme.text,
                borderColor: theme.inputBorder
              }]}
              placeholder="How can we help you?"
              placeholderTextColor={theme.placeholderText}
              multiline
              numberOfLines={4}
            />
          </View>
          <TouchableOpacity style={[styles.submitButton, { backgroundColor: theme.buttonBackground }]}>
            <Text style={[styles.submitButtonText, { color: theme.buttonText }]}>Send Message</Text>
          </TouchableOpacity>
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
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  contactMethods: {
    gap: 16,
  },
  contactMethod: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 16,
    color: '#2563eb',
    marginBottom: 4,
  },
  contactHours: {
    fontSize: 14,
    color: '#666',
  },
  form: {
    gap: 16,
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
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});