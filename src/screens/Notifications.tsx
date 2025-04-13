import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAuthStore from 'zustand/authStore';

type NotificationType = {
  title: string;
  description: string;
  id: number;
  read: boolean;
  icon: string;
  timestamp: number;
  timeAgo?: string;
};

const Notification = () => {
  const { isDarkMode, notifications, markNotificationAsRead } = useAuthStore();
  const [selectedNotif, setSelectedNotif] = useState<NotificationType | null>(null);
  const [updatedNotifications, setUpdatedNotifications] = useState<NotificationType[]>([]);

  const themeStyles = {
    backgroundColor: isDarkMode === 'dark' ? '#0c2b2c' : '#f9f9f9',
    textColor: isDarkMode === 'dark' ? '#fff' : '#000',
    cardBackground: isDarkMode === 'dark' ? '#123536' : '#fff',
    timeColor: isDarkMode === 'dark' ? '#bbb' : '#666',
    modalBackground: isDarkMode === 'dark' ? '#183f40' : '#fff',
  };

  useEffect(() => {
    const getTimeAgo = (timestamp: number) => {
      const now = Date.now();
      const diffInMs = now - timestamp;
      const diffInSec = Math.floor(diffInMs / 1000);
      const diffInMin = Math.floor(diffInSec / 60);
      const diffInHours = Math.floor(diffInMin / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInSec < 60) return `${diffInSec} sec${diffInSec === 1 ? '' : 's'} ago`;
      if (diffInMin < 60) return `${diffInMin} min${diffInMin === 1 ? '' : 's'} ago`;
      if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
      if (diffInDays < 7) return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
      const diffInWeeks = Math.floor(diffInDays / 7);
      return `${diffInWeeks} week${diffInWeeks === 1 ? '' : 's'} ago`;
    };

    const updated = notifications.map(noti => ({
      ...noti,
      timeAgo: getTimeAgo(noti?.timestamp),
    }));
    setUpdatedNotifications(updated);
  }, [notifications]);

  const markAsRead = () => {
    if (!selectedNotif) return;

    markNotificationAsRead(selectedNotif.id);

    const updated = updatedNotifications.map(noti =>
      noti.id === selectedNotif.id ? { ...noti, read: true } : noti
    );

    setUpdatedNotifications(updated);
    setSelectedNotif(null);
  };

  const renderItem = ({ item }: { item: NotificationType }) => (
    <Pressable
      onPress={() => setSelectedNotif(item)}
      style={[
        styles.card,
        { backgroundColor: themeStyles.cardBackground, opacity: item.read ? 0.5 : 1 },
      ]}
    >
      <Ionicons
        name={item.icon || 'notifications-outline'}
        size={24}
        color="#008080"
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={[styles.message, { color: themeStyles.textColor }]}>
          {item.title}
        </Text>
        <Text style={[styles.message, { color: themeStyles.textColor }]}>
          {item.description}
        </Text>
        <Text style={[styles.time, { color: themeStyles.timeColor }]}>
          {item.timeAgo}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <Text style={[styles.header, { color: themeStyles.textColor }]}>Notifications</Text>
      <FlatList
        data={updatedNotifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Modal
        visible={!!selectedNotif}
        animationType="fade"
        transparent
        onRequestClose={() => setSelectedNotif(null)}
      >
        <View style={styles.modalWrapper}>
          <View style={[styles.modalContent, { backgroundColor: themeStyles.modalBackground }]}>
            <Ionicons
              name={selectedNotif?.icon || 'notifications-outline'}
              size={32}
              color="#008080"
              style={{ marginBottom: 10 }}
            />
            <Text style={[styles.modalText, { color: themeStyles.textColor }]}>
              {selectedNotif?.title}
            </Text>
            <Text style={[styles.modalText, { color: themeStyles.textColor }]}>
              {selectedNotif?.description}
            </Text>
            <Text style={[styles.modalTime, { color: themeStyles.timeColor }]}>
              {selectedNotif?.timeAgo}
            </Text>
            <Pressable
              onPress={markAsRead}
              style={styles.closeBtn}
            >
              <Text style={styles.closeText}>Mark as Read</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  icon: {
    marginRight: 12,
    marginTop: 4,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
  },
  time: {
    fontSize: 12,
    marginTop: 4,
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalTime: {
    marginTop: 8,
    fontSize: 13,
  },
  closeBtn: {
    marginTop: 20,
    backgroundColor: '#008080',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Notification;
