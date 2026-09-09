import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../components/ScreenHeader';
import { useAuth } from '../context/AuthContext';
import {
  COLORS,
  RADIUS,
} from '../constants/theme';

const FAQS = [
  {
    id: '1',
    question:
      'How do I search for my lost Student ID?',
    answer:
      'Open Search Lost ID, enter your 8-digit Student ID number, and tap Search ID. If an active report exists, the app will show the retrieval details.',
  },
  {
    id: '2',
    question:
      'How do I report a found Student ID?',
    answer:
      'Open the Report tab, upload or take a clear photo of the ID, enter the required details, select a retrieval location, and submit the report.',
  },
  {
    id: '3',
    question:
      'Where should I submit the physical ID?',
    answer:
      'The physical Student ID should be submitted to the approved retrieval location selected when creating the report.',
  },
  {
    id: '4',
    question:
      'How will I know when my ID is found?',
    answer:
      'If your Student ID is linked to your RetrieveID account, you will receive an in-app notification and an email when someone reports your ID as found.',
  },
  {
    id: '5',
    question:
      'Who can view the uploaded Student ID photo?',
    answer:
      'For privacy, the Student ID photo can only be viewed by the owner of the ID and the user who submitted the report.',
  },
  {
    id: '6',
    question:
      'How do I confirm that I have collected my ID?',
    answer:
      'Open the active report for your Student ID and tap Mark as Collected after you have physically received the card.',
  },
];

export default function HelpScreen() {
  const {
    isAuthenticated,
    isAuthReady,
  } = useAuth();

  const [openFaqId, setOpenFaqId] =
    useState(null);

  if (!isAuthReady) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/welcome" />;
  }

  const toggleFaq = (id) => {
    setOpenFaqId(
      (currentId) =>
        currentId === id
          ? null
          : id
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Help & FAQs"
          showBell={false}
        />

        <Text style={styles.intro}>
          Find answers to common questions about
          searching, reporting and collecting Student IDs.
        </Text>

        <View style={styles.faqList}>
          {FAQS.map((faq) => {
            const isOpen =
              openFaqId === faq.id;

            return (
              <View
                key={faq.id}
                style={styles.faqCard}
              >
                <Pressable
                  style={styles.questionRow}
                  onPress={() =>
                    toggleFaq(faq.id)
                  }
                >
                  <Text
                    style={styles.question}
                  >
                    {faq.question}
                  </Text>

                  <Ionicons
                    name={
                      isOpen
                        ? 'chevron-up'
                        : 'chevron-down'
                    }
                    size={20}
                    color={COLORS.muted}
                  />
                </Pressable>

                {isOpen ? (
                  <Text style={styles.answer}>
                    {faq.answer}
                  </Text>
                ) : null}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 50,
  },

  intro: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.muted,
    marginTop: 10,
  },

  faqList: {
    gap: 12,
    marginTop: 28,
  },

  faqCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.large,
    paddingHorizontal: 18,
  },

  questionRow: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  question: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 21,
  },

  answer: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
    paddingBottom: 18,
    paddingRight: 18,
  },
});