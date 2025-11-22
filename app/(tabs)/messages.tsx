import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import React, { useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { CONVERSATIONS, ConversationType } from "@/data/conversations";
import { Feather } from "@expo/vector-icons";
import { Modal } from "react-native";

const MessagesScreen = () => {
  const insets = useSafeAreaInsets();
  const [saerchText, setSearchText] = useState("");
  const [convList, setConvList] = useState(CONVERSATIONS);
  const [selectedConv, setSelectedConv] = useState<ConversationType | null>(
    null
  );
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const deleteConv = (conversationId: number) => {
    Alert.alert(
      "Delete Conversation",
      "Are you sure you want to delete the conversation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setConvList((prev) =>
              prev.filter((conv) => conv.id !== conversationId)
            );
          },
        },
      ]
    );
  };

  const openConv = (conversation: ConversationType) => {
    setSelectedConv(conversation);
    setIsChatOpen(true);
  };

  const closeChatModel = () => {
    setIsChatOpen(false);
    setSelectedConv(null);
    setNewMessage("");
  };

  const sendMessage = () => {
    if (newMessage.trim() && selectedConv) {
      setConvList((prev) =>
        prev.map((conv) =>
          conv.id === selectedConv.id
            ? { ...conv, lastMessage: newMessage, time: "now" }
            : conv
        )
      );

      setNewMessage("");
      Alert.alert(
        "Message Sent!",
        `Your message has been sent to ${selectedConv.user.name}`
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <Text className="text-xl font-bold text-gray-900">Messages</Text>
        <TouchableOpacity>
          <Feather name="edit" size={24} color={"#1da1f2"} />
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View className="px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3">
          <Feather name="search" size={20} color={"#657786"} />
          <TextInput
            placeholder="Search for people and groups"
            className="flex-1 ml-3 text-base"
            placeholderTextColor={"#657786"}
            value={saerchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* conv list */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
      >
        {convList.map((conv) => (
          <TouchableOpacity
            key={conv.id}
            className="flex-row items-center p-4 border-b border-gray-50 active:bg-gray-50"
            onPress={() => openConv(conv)}
            onLongPress={() => deleteConv(conv.id)}
          >
            <Image
              source={{ uri: conv.user.avatar }}
              className="size-12 rounded-full mr-3"
            />

            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-1">
                <View className="flex-row items-center gap-1">
                  <Text className="font-semibold text-gray-900">
                    {conv.user.name}
                  </Text>
                  {conv.user.verified && (
                    <Feather
                      name="check-circle"
                      size={16}
                      color={"#1da1f2"}
                      className="ml-1"
                    />
                  )}
                  <Text className="text-gray-500 text-sm ml-1">
                    @{conv.user.username}
                  </Text>
                </View>
                <Text className="text-gray-500 text-sm">{conv.time}</Text>
              </View>
              <Text className="text-sm text-gray-500">{conv.lastMessage}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* quick actions */}
      <View className="px-4 py-2 border-t border-gray-100 bg-gray-50">
        <Text className="text-xs text-gray-500 text-center">
          Tap to open * Long press to delete
        </Text>
      </View>

      <Modal
        visible={isChatOpen}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {selectedConv && (
          <SafeAreaView className="flex-1">
            {/* chat header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
              <TouchableOpacity onPress={closeChatModel} className="mr-3">
                <Feather name="arrow-left" size={24} color={"#1da1f2"} />
              </TouchableOpacity>

              <Image
                source={{ uri: selectedConv.user.avatar }}
                className="size-10 rounded-full mr-3"
              />
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text className="font-semibold text-gray-900 mr-1">
                    {selectedConv.user.name}
                  </Text>
                  {selectedConv.user.verified && (
                    <Feather name="check-circle" size={16} color={"#1da1f2"} />
                  )}
                </View>
                <Text className="text-gray-500 text-sm">
                  @{selectedConv.user.username}
                </Text>
              </View>
            </View>

            {/* chat mesgs */}
            <ScrollView className="flex-1 px-4 py-4">
              <View className="mb-4">
                <Text className="text-center text-gray-400 text-sm mb-4">
                  This is the beginning of your conversation with{" "}
                  {selectedConv.user.name}
                </Text>

                {/* conv msgs */}
                {selectedConv.messages.map((message) => (
                  <View
                    key={message.id}
                    className={`flex-row mb-3 ${message.fromUser ? "justify-end" : ""}`}
                  >
                    {!message.fromUser && (
                      <Image
                        source={{ uri: selectedConv.user.avatar }}
                        className="size-8 rounded-full mr-2"
                      />
                    )}
                    <View
                      className={`flex-1 ${message.fromUser ? "items-end" : ""}`}
                    >
                      <View
                        className={`rounded-2xl px-4 py-3 max-w-xs ${message.fromUser ? "bg-blue-500" : "bg-gray-100"}`}
                      >
                        <Text
                          className={
                            message.fromUser ? "text-white" : "text-gray-900"
                          }
                        >
                          {message.text}
                        </Text>
                      </View>
                      <Text className="text-xs text-gray-400 mt-1">
                        {message.time}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* msg input */}
            <View className="flex-row items-center px-4 py-3 border-t border-gray-100">
              <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-3 mr-3">
                <TextInput
                  className="flex-1 text-base"
                  placeholder="Start a message..."
                  placeholderTextColor={"#657786"}
                  value={newMessage}
                  onChangeText={setNewMessage}
                  multiline
                />
              </View>
              <TouchableOpacity
                onPress={sendMessage}
                className={`size-10 rounded-full items-center justify-center ${newMessage.trim() ? "bg-blue-500" : "bg-gray-300"}`}
                disabled={!newMessage.trim()}
              >
                <Feather name="send" size={20} color={"white"} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
};

export default MessagesScreen;
