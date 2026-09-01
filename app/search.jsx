import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import {
  Redirect,
  useRouter,
} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../components/ScreenHeader';
import { COLORS, RADIUS } from '../constants/theme';


import { useAuth } from '../context/AuthContext';

import { apiRequest } from '../services/api';

export default function SearchScreen() {
  const router = useRouter();
  const {
  token,
  isAuthenticated,
  isAuthReady,
} = useAuth();


  
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleStudentIdChange = (value) => {
    const numbersOnly = value.replace(/\D/g, '').slice(0, 8);

    setStudentId(numbersOnly);

    if (error) {
      setError('');
    }
  };

  const handleSearch = async () => {
  if (!studentId) {
    setError(
      'Please enter your Student ID number.'
    );
    return;
  }

  if (!/^\d{8}$/.test(studentId)) {
    setError(
      'Student ID must contain exactly 8 digits.'
    );
    return;
  }

  if (!token) {
    Alert.alert(
      'Authentication Required',
      'Please log in again before searching.'
    );
    return;
  }

  setError('');
  setIsSearching(true);

  try {
    const data = await apiRequest(
      `/api/reports/search/${studentId}`,
      {
        method: 'GET',

        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    const report = data.report;

    const displayStatus =
      report.status ===
      'AWAITING_COLLECTION'
        ? 'Awaiting collection'
        : report.status === 'COLLECTED'
          ? 'Collected'
          : report.status;

    router.push({
      pathname: '/search-found',
      params: {
        reportId: report.id,
        studentId: report.studentId,
        retrievalLocation:
          report.retrievalLocation,
        foundLocation:
          report.foundLocation,
        dateReported:
          report.createdAt,
        status: displayStatus,
      },
    });
  } catch (error) {
    if (error.status === 404) {
      router.push({
        pathname: '/search-not-found',
        params: {
          studentId,
        },
      });

      return;
    }

    Alert.alert(
      'Search Failed',
      error.message ||
        'Unable to search for the Student ID. Please try again.'
    );
  } finally {
    setIsSearching(false);
  }
};

  if (!isAuthReady) {
  return null;
}

if (!isAuthenticated) {
  return <Redirect href="/welcome" />;
}

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <ScreenHeader title="Search" />

          <Text style={styles.label}>
            Enter Your Student ID
          </Text>

          <TextInput
            value={studentId}
            onChangeText={handleStudentIdChange}
            placeholder="e.g. 11124499"
            placeholderTextColor={COLORS.muted}
            keyboardType="number-pad"
            maxLength={8}
            editable={!isSearching}
            style={[
              styles.input,
              error ? styles.inputError : null,
            ]}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          <Pressable
            style={({ pressed }) => [
              styles.searchButton,
              pressed && !isSearching
                ? styles.searchButtonPressed
                : null,
              isSearching ? styles.searchButtonDisabled : null,
            ]}
            onPress={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <ActivityIndicator
                  size="small"
                  color={COLORS.surface}
                />

                <Text style={styles.searchButtonText}>
                  Searching...
                </Text>
              </>
            ) : (
              <>
                <Ionicons
                  name="search-outline"
                  size={21}
                  color={COLORS.surface}
                />

                <Text style={styles.searchButtonText}>
                  Search ID
                </Text>
              </>
            )}
          </Pressable>

          <View style={styles.tipCard}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={COLORS.primary}
            />

            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>
                Stay updated automatically
              </Text>

              <Text style={styles.tipText}>
                Registered users will receive a notification when
                their linked Student ID is reported as found.
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },

  label: {
    color: COLORS.text,
    fontSize: 16,
    marginTop: 34,
    marginBottom: 10,
  },

  input: {
    height: 54,
    borderWidth: 1,
    borderColor: '#9AA3B2',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.small,
    paddingHorizontal: 15,
    fontSize: 17,
    color: COLORS.text,
  },

  inputError: {
    borderColor: COLORS.danger,
  },

  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    marginTop: 7,
  },

  searchButton: {
    minHeight: 52,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.small,
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  searchButtonPressed: {
    opacity: 0.85,
  },

  searchButtonDisabled: {
    opacity: 0.7,
  },

  searchButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
  },

  tipCard: {
    marginTop: 34,
    padding: 18,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.large,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 13,
  },

  tipContent: {
    flex: 1,
  },

  tipTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },

  tipText: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },
});