import { FontAwesome6 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

SplashScreen.preventAutoHideAsync();

const userImagePath = require("../assets/images/profile-user.png");
const backwardArrow = require("../assets/images/arrow.png");
const sendArrow = require("../assets/images/send.png");


export default function Chat() {
  const [getChatAray, setChatArray] = useState([]);

  const item = useLocalSearchParams();

  const [getChatText, setChatText] = useState("");

  const chatListRef = useRef(null);

  const [loaded, error] = useFonts({
    "Roboto-light": require("../assets/fonts/Roboto-Light.ttf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-thinitalic": require("../assets/fonts/Roboto-ThinItalic.ttf"),
  });

  const scrollToEnd = () => {
    if (chatListRef.current && getChatAray.length > 0) {
      chatListRef.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    async function fetchChatArray() {
      let userJson = await AsyncStorage.getItem("user");
      let user = JSON.parse(userJson);
      if(user != null){
        let response = await fetch(
          process.env.EXPO_PUBLIC_URL +
            "/VibeChat/LoadChat?user_id=" +
            user.id +
            "&other_user_id=" +
            item.other_user_id
        );
  
        if (response.ok) {
          let chatArray = await response.json();
  
          setChatArray(chatArray);
        }
      }
      
    }
    fetchChatArray();

      setInterval(() => {
        fetchChatArray();
      }, 1000);
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  useEffect(() => {
    scrollToEnd();  
  }, [getChatAray]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      keyboardVerticalOffset={10}
    >
    <LinearGradient colors={["white", "white"]} style={stylesheet.view1}>
      <View style={stylesheet.view2}>
        <Pressable
          onPress={() => {
            router.back("/home");
          }}
        >
          <Image source={backwardArrow} style={stylesheet.arrow} />
        </Pressable>
        <View style={stylesheet.view3}>
          {item.other_user_found == "true" ? (
            <Image
              source={
                process.env.EXPO_PUBLIC_URL +
                "/VibeChat/Avatar_Images/" +
                item.mobile +
                ".png"
              }
              style={stylesheet.image1}
            />
          ) : (
            <Text style={stylesheet.text5}>
              {item.other_user_avatar_letters}
            </Text>
          )}
        </View>

        <View>
          <Text style={stylesheet.text1}>{item.other_user_name}</Text>
          <Text style={stylesheet.text2}>
            {item.other_user_status == 1 ? "Online" : "Offline"}
          </Text>
        </View>
      </View>

      <View style={stylesheet.mainView}>
        <FlashList
          ref={chatListRef}
          data={getChatAray}
          renderItem={({ item }) => (
            <View
              style={
                item.side == "right" ? stylesheet.view5_1 : stylesheet.view5_2
              }
            >
              <Text style={stylesheet.text3}>{item.message}</Text>
              <View style={stylesheet.view6}>
                <Text style={stylesheet.text4}>{item.datetime}</Text>

                {item.side == "right" ? (
                  <FontAwesome6
                    name={"check"}
                    color={item.status == 1 ? "green" : "grey"}
                    size={12}
                  />
                ) : null}
              </View>
            </View>
          )}
          estimatedItemSize={200}
          onContentSizeChange={() => scrollToEnd()} 
        />
      </View>

      <View style={stylesheet.view7}>
        <TextInput
          style={stylesheet.input2}
          placeholder="Type your message here..."
          value={getChatText}
          onChangeText={(text) => {
            setChatText(text);
          }}
        />
        <Pressable
          style={stylesheet.pressable2}
          onPress={async () => {
            if (getChatText.length == 0) {
              Alert.alert("Error", "Please Enter Your Message");
            } else {
              let userJson = await AsyncStorage.getItem("user");
              let user = JSON.parse(userJson);
              let response = await fetch(
                process.env.EXPO_PUBLIC_URL +
                  "/VibeChat/SendChat?log_user_id=" +
                  user.id +
                  "&other_user_id=" +
                  item.other_user_id +
                  "&message=" +
                  getChatText
              );

              if (response.ok) {
                let json = response.json();
                setChatText("");
                console.log("Message Sent");
              }
            }
          }}
        >
          <Image source={sendArrow} style={stylesheet.sendarrow} />
        </Pressable>
      </View>
    </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const stylesheet = StyleSheet.create({
  view1: {
    flex: 1,
  },
  view2: {
    height: 50,
    backgroundColor: "#337A71",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    columnGap: 10,
  },
  view3: {
    width: 35,
    height: 35,
    borderRadius: 30,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  image1: {
    width: 34,
    height: 34,
    borderRadius: 33,
  },
  text1: {
    fontSize: 20,
    fontFamily: "Roboto-Regular",
    color: "white",
  },
  text2: {
    fontSize: 13,
    fontFamily: "Roboto-light",
    color: "white",
  },
  text3: {
    fontSize: 15,
    fontFamily: "Roboto-Regular",
  },
  text4: {
    fontSize: 12,
    fontFamily: "Roboto-light",
  },
  text5: {
    fontSize: 20,
    fontFamily: "Roboto-Bold",
    color: "#8659A8",
  },
  arrow: {
    width: 15,
    height: 15,
    marginLeft: 15,
  },
  view5_1: {
    backgroundColor: "white",
    borderColor: "#8659A8",
    borderWidth: 2,
    borderStyle: "solid",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderEndStartRadius: 15,
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 10,
    justifyContent: "center",
    alignSelf: "flex-end",
    rowGap: 5,
  },
  view5_2: {
    backgroundColor: "white",
    borderColor: "#337A71",
    borderWidth: 2,
    borderStyle: "solid",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderEndEndRadius: 15,
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 10,
    justifyContent: "center",
    alignSelf: "flex-start",
    rowGap: 5,
  },
  view6: {
    flexDirection: "row",
    columnGap: 10,
  },
  view7: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    columnGap: 10,
    paddingHorizontal: 20,
  },
  input2: {
    height: 50,
    borderRadius: 10,
    borderColor: "#337A71",
    borderStyle: "solid",
    borderWidth: 2,
    fontFamily: "Roboto-Regular",
    fontSize: 15,
    flex: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  pressable2: {
    backgroundColor: "white",
    borderColor: "#337A71",
    borderWidth: 2,
    borderStyle: "solid",
    width: 30,
    height: 50,
    borderRadius: 15,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  mainView: {
    flex: 1,
  },
  sendarrow: {
    width: 25,
    height: 25,
  },
});
