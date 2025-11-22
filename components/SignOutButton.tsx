import { useClerk } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { Alert, TouchableOpacity } from "react-native";

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk();
  const handleSignOut = () => {
    try {
      Alert.alert("Log-out", "Are you sure you want to log out?", [
        { text: "Cancel", style: "cancel" },
        { text: "Log out", style: "destructive", onPress: () => signOut() },
      ]);
      // Redirect to your desired page
      Linking.openURL(Linking.createURL("/"));
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };
  return (
    <TouchableOpacity onPress={handleSignOut}>
      <Feather name="log-out" size={24} color={"#e0245e"} />
    </TouchableOpacity>
  );
};
