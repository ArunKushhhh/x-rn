import { View, Text, Button } from "react-native";
import React from "react";
import { useClerk } from "@clerk/clerk-expo";

const HomeScreen = () => {
  const { signOut } = useClerk();
  return (
    <View>
      <Text>HomeScreen</Text>
      <Button title="Sign Out" onPress={() => signOut()}></Button>
    </View>
  );
};

export default HomeScreen;
