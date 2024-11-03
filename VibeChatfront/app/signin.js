import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { registerRootComponent } from "expo";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

const mainImagePath = require("../assets/images/logo.png");

export default function SignIn() {
  const [getimage, setImage] = useState(null);

  const [getMobile, setMobile] = useState("");

  const [getPassword, setPassword] = useState("");

  const [loaded, error] = useFonts({
    "Roboto-light": require("../assets/fonts/Roboto-Light.ttf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-thinitalic": require("../assets/fonts/Roboto-ThinItalic.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <LinearGradient colors={["white", "white"]}>
      <Image source={mainImagePath} style={styleSheet.image1} />
      <ScrollView style={styleSheet.scrollview1}>
        <View style={styleSheet.container}>
          <Text style={styleSheet.text1}>
            Welcome to VibeChat! Sign In your account.
          </Text>
          <Text style={styleSheet.text2}>Mobile</Text>
          <TextInput
            style={styleSheet.input1}
            inputMode={"tel"}
            onChangeText={(text) => {
              setMobile(text);
            }}
          />

          <Text style={styleSheet.text2}>Password</Text>
          <TextInput
            style={styleSheet.input1}
            secureTextEntry={true}
            onChangeText={(text) => {
              setPassword(text);
            }}
          />
          <View style={styleSheet.view1}>
            <Pressable
              style={styleSheet.pressable1}
              onPress={() => {
                router.push("/");
              }}
            >
              <Text style={styleSheet.text3}>Sign Up</Text>
            </Pressable>
            <Pressable
              style={styleSheet.pressable1}
              onPress={async () => {
                let response = await fetch(
                  process.env.EXPO_PUBLIC_URL+"/VibeChat/SignIn",
  
                  {
                    method: "POST",
                    body: JSON.stringify({
                      mobile: getMobile,
                      password: getPassword,
                    }),
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );
  
                if (response.ok) {
                  let json = await response.json();
                  if (json.success) {
                    //signin sucess
                    let user = json.user;
                    try {
                      console.log(user);
                      await AsyncStorage.setItem("user", JSON.stringify(user));
                      router.replace("/home");
                    } catch (e) {
                      Alert.alert("Error", "Unable to process your request");
                    }
                  } else {
                    //problem
                    Alert.alert("Error", json.message);
                  }
                }
              }}
            >
              <Text style={styleSheet.text3}>Sign In</Text>
            </Pressable>
          </View>
         
        </View>
      </ScrollView>
      <View style={styleSheet.view3}>
      <Text style={styleSheet.text4}>Powered By VibeChat</Text>
      </View>
     
    </LinearGradient>
  );
}

const styleSheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 10,
    rowGap: 10,
  },
  view3:{
    justifyContent:"flex-start",
    alignItems:'center'
  },
  image1: {
    width: 160,
    height: 160,
    alignSelf: "center",
  },
  image2: {
    width: 80,
    height: 80,
    borderRadius: 100,
    alignSelf: "center",
    marginBottom: 7,
    borderColor: "#337A71",
    borderWidth: 2,
  },
  text1: {
    fontFamily: "Roboto-thinitalic",
    fontSize: 18,
  },
  text2: {
    fontFamily: "Roboto-Regular",
    fontSize: 17,
  },
  text3: {
    color: "white",
    fontFamily: "Roboto-Bold",
    fontSize: 20,
  },
  text4: {
    fontFamily: "Roboto-light",
    fontSize: 17,
  },
  input1: {
    borderStyle: "solid",
    borderWidth: 2,
    height: 50,
    borderColor: "#337A71",
    borderRadius: 17,
    fontFamily: "Roboto-Regular",
    paddingHorizontal: 10,
  },
  view1: {
    flexDirection: "row",
    columnGap: 10,
  },
  view2: {
    flex: 1,
    rowGap: 10,
  },
  pressable1: {
    flex: 1,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#337A71",
    borderRadius: 17,
    marginTop: 10,
    borderColor: "#244d47",
    borderWidth: 2,
  },
});
