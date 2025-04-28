import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { Link, router } from 'expo-router';
import { ThumbsUp, Star, MapPin, Calendar } from 'lucide-react-native';
import { useUser } from '@/context/UserContext';
import { useReviews } from '@/context/ReviewContext';
import { useTheme } from '@/context/ThemeContext';
import { internationalEvents } from '@/data/events';

type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
};

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is your travel purpose?',
    options: ['Tourism', 'Business', 'Education'],
  },
  {
    id: 2,
    question: 'How long is your planned trip?',
    options: ['Less than 30 days', 'More than 30 days'],
  },
  {
    id: 3,
    question: 'Which region are you interested in?',
    options: ['Europe', 'Asia', 'Americas'],
  },
];

export default function HomeScreen() {
  const { user } = useUser();
  const { reviews, fetchReviews, addReview, deleteReview, toggleLike, isLoading: reviewsLoading } = useReviews();
  const { theme, isDarkMode } = useTheme();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [showQuizResult, setShowQuizResult] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleAddReview = () => {
    if (user && newReview.comment.trim()) {
      addReview({
        productId: 'homepage', // Default product ID for homepage reviews
        userId: user.id,
        userName: user.name || user.userName,
        rating: newReview.rating,
        comment: newReview.comment,
      });
      setShowReviewModal(false);
      setNewReview({ rating: 5, comment: '' });
    }
  };

  const handleQuizAnswer = (answer: string) => {
    const newAnswers = [...quizAnswers, answer];
    setQuizAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowQuizResult(true);
    }
  };

  const getQuizResult = () => {
    const purpose = quizAnswers[0];
    let visaType = 'Tourist Visa';

    if (purpose === 'Business') {
      visaType = 'Business Visa';
    } else if (purpose === 'Education') {
      visaType = 'Student Visa';
    }

    return visaType;
  };

  const resetQuiz = () => {
    setShowQuiz(false);
    setShowQuizResult(false);
    setCurrentQuestion(0);
    setQuizAnswers([]);
  };

  const handleLikePress = (reviewId: string) => {
    if (user) {
      toggleLike(reviewId, user.id);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.hero, { backgroundColor: theme.card }]}>
        <Text style={[styles.title, { color: theme.text }]}>Welcome to Visify</Text>
        <Text style={[styles.subtitle, { color: isDarkMode ? '#aaa' : '#666' }]}>Your Trusted Visa Services Partner</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Popular Services</Text>
        <View style={styles.servicesGrid}>
          <Link href="/services" style={[styles.serviceCard, { backgroundColor: theme.card }]}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=800' }}
              style={styles.serviceImage}
            />
            <Text style={[styles.serviceTitle, { color: theme.text }]}>Tourist Visa</Text>
          </Link>
          <Link href="/services" style={[styles.serviceCard, { backgroundColor: theme.card }]}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800' }}
              style={styles.serviceImage}
            />
            <Text style={[styles.serviceTitle, { color: theme.text }]}>Business Visa</Text>
          </Link>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Upcoming International Events</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.eventsContainer}
        >
          {internationalEvents.map((event) => (
            <View key={event.id} style={[styles.eventCard, { backgroundColor: theme.card }]}>
              <Image source={{ uri: event.image }} style={styles.eventImage} />
              <View style={styles.eventContent}>
                <Text style={[styles.eventName, { color: theme.text }]}>{event.name}</Text>
                <View style={styles.eventInfo}>
                  <MapPin size={16} color={isDarkMode ? '#aaa' : '#666'} />
                  <Text style={[styles.eventLocation, { color: isDarkMode ? '#aaa' : '#666' }]}>{event.location}</Text>
                </View>
                <View style={styles.eventInfo}>
                  <Calendar size={16} color={isDarkMode ? '#aaa' : '#666'} />
                  <Text style={[styles.eventDate, { color: isDarkMode ? '#aaa' : '#666' }]}>{event.date}</Text>
                </View>
                <Text style={[styles.eventDescription, { color: isDarkMode ? '#aaa' : '#666' }]}>{event.description}</Text>
                <TouchableOpacity
                  style={[styles.getVisaButton, { backgroundColor: theme.buttonBackground }]}
                  onPress={() => router.push('/services')}
                >
                  <Text style={[styles.getVisaButtonText, { color: theme.buttonText }]}>Get Visa Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.reviewsHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>User Reviews</Text>
          {user && (
            <TouchableOpacity
              style={[styles.addReviewButton, { backgroundColor: theme.buttonBackground }]}
              onPress={() => setShowReviewModal(true)}
            >
              <Text style={[styles.addReviewButtonText, { color: theme.buttonText }]}>Add Review</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.reviewsList}>
          {reviews.map((review) => (
            <View key={review.id} style={[styles.reviewCard, { backgroundColor: theme.card }]}>
              <View style={styles.reviewHeader}>
                <Text style={[styles.reviewerName, { color: theme.text }]}>{review.userName}</Text>
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#FFD700" fill="#FFD700" />
                  <Text style={[styles.rating, { color: theme.text }]}>{review.rating}</Text>
                </View>
              </View>
              <Text style={[styles.reviewComment, { color: isDarkMode ? '#aaa' : '#666' }]}>{review.comment}</Text>
              <View style={styles.reviewFooter}>
                <TouchableOpacity
                  style={[
                    styles.upvoteButton,
                    user && review.likedBy.includes(user.id) && styles.upvoteButtonActive
                  ]}
                  onPress={() => handleLikePress(review.id)}
                >
                  <ThumbsUp
                    size={16}
                    color={user && review.likedBy.includes(user.id) ? theme.accent : isDarkMode ? '#aaa' : '#666'}
                    fill={user && review.likedBy.includes(user.id) ? theme.accent : 'transparent'}
                  />
                  <Text style={[
                    styles.upvoteCount,
                    user && review.likedBy.includes(user.id) && { color: theme.accent },
                    { color: isDarkMode ? '#aaa' : '#666' }
                  ]}>
                    {review.upvotes}
                  </Text>
                </TouchableOpacity>
                {user && user.id === review.userId && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteReview(review.id)}
                  >
                    <Text style={[styles.deleteButtonText, { color: theme.error }]}>Delete</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Why Choose Us</Text>
        <View style={styles.featureList}>
          <View style={[styles.feature, { backgroundColor: theme.card }]}>
            <Text style={[styles.featureTitle, { color: theme.text }]}>Fast Processing</Text>
            <Text style={[styles.featureText, { color: isDarkMode ? '#aaa' : '#666' }]}>Quick and efficient visa processing with real-time updates</Text>
          </View>
          <View style={[styles.feature, { backgroundColor: theme.card }]}>
            <Text style={[styles.featureTitle, { color: theme.text }]}>Expert Support</Text>
            <Text style={[styles.featureText, { color: isDarkMode ? '#aaa' : '#666' }]}>24/7 assistance from our visa specialists</Text>
          </View>
          <View style={[styles.feature, { backgroundColor: theme.card }]}>
            <Text style={[styles.featureTitle, { color: theme.text }]}>Secure Process</Text>
            <Text style={[styles.featureText, { color: isDarkMode ? '#aaa' : '#666' }]}>Your documents are handled with utmost security</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.quizButton, { backgroundColor: theme.buttonBackground }]}
        onPress={() => setShowQuiz(true)}
      >
        <Text style={[styles.quizButtonText, { color: theme.buttonText }]}>Find Your Visa Type</Text>
      </TouchableOpacity>

      <Modal
        visible={showReviewModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReviewModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Write a Review</Text>
            <View style={styles.ratingInput}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setNewReview({ ...newReview, rating: star })}
                >
                  <Star
                    size={24}
                    color="#FFD700"
                    fill={star <= newReview.rating ? "#FFD700" : "transparent"}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={[styles.reviewInput, {
                borderColor: theme.inputBorder,
                backgroundColor: theme.inputBackground,
                color: theme.text
              }]}
              placeholder="Write your review..."
              placeholderTextColor={theme.placeholderText}
              multiline
              value={newReview.comment}
              onChangeText={(text) => setNewReview({ ...newReview, comment: text })}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: isDarkMode ? '#333' : '#f8f9fa' }]}
                onPress={() => setShowReviewModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: isDarkMode ? '#eee' : '#666' }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton, { backgroundColor: theme.buttonBackground }]}
                onPress={handleAddReview}
              >
                <Text style={[styles.submitButtonText, { color: theme.buttonText }]}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showQuiz}
        animationType="slide"
        transparent={true}
        onRequestClose={resetQuiz}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            {!showQuizResult ? (
              <>
                <Text style={[styles.modalTitle, { color: theme.text }]}>{quizQuestions[currentQuestion].question}</Text>
                <View style={styles.quizOptions}>
                  {quizQuestions[currentQuestion].options.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[styles.quizOption, { backgroundColor: isDarkMode ? '#333' : '#f8f9fa' }]}
                      onPress={() => handleQuizAnswer(option)}
                    >
                      <Text style={[styles.quizOptionText, { color: theme.text }]}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            ) : (
              <>
                <Text style={[styles.modalTitle, { color: theme.text }]}>Quiz Result</Text>
                <Text style={[styles.quizResult, { color: theme.accent }]}>
                  {getQuizResult()} is a great fit for your trip!
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton, { backgroundColor: isDarkMode ? '#333' : '#f8f9fa' }]}
                    onPress={resetQuiz}
                  >
                    <Text style={[styles.cancelButtonText, { color: isDarkMode ? '#eee' : '#666' }]}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.submitButton, { backgroundColor: theme.buttonBackground }]}
                    onPress={() => {
                      resetQuiz();
                      router.push('/services');
                    }}
                  >
                    <Text style={[styles.submitButtonText, { color: theme.buttonText }]}>View Visas</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    padding: 20,
    alignItems: 'center',
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  servicesGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  serviceCard: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  serviceImage: {
    width: '100%',
    height: 120,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '500',
    padding: 12,
    textAlign: 'center',
  },
  featureList: {
    gap: 16,
  },
  feature: {
    padding: 16,
    borderRadius: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    lineHeight: 20,
  },
  quizButton: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  quizButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  eventsContainer: {
    paddingHorizontal: 4,
    gap: 16,
  },
  eventCard: {
    width: 280,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  eventImage: {
    width: '100%',
    height: 150,
  },
  eventContent: {
    padding: 16,
  },
  eventName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
  },
  eventDate: {
    fontSize: 14,
  },
  eventDescription: {
    fontSize: 14,
    marginVertical: 8,
  },
  getVisaButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  getVisaButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addReviewButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  addReviewButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  reviewsList: {
    gap: 16,
  },
  reviewCard: {
    padding: 16,
    borderRadius: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
  },
  reviewComment: {
    fontSize: 14,
    marginBottom: 12,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  upvoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  upvoteButtonActive: {
    padding: 4,
    borderRadius: 6,
  },
  upvoteCount: {
    fontSize: 14,
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  ratingInput: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  reviewInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {},
  submitButton: {},
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  quizOptions: {
    gap: 12,
  },
  quizOption: {
    padding: 16,
    borderRadius: 8,
  },
  quizOptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  quizResult: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 24,
  },
});