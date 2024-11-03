import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

const mainImagePath = require("../assets/images/logo.png");

export default function Index() {
  const [getimage, setImage] = useState(null);

  const [getMobile, setMobile] = useState("");
  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");
  const [getPassword, setPassword] = useState("");

  const [loaded, error] = useFonts({
    "Roboto-light": require("../assets/fonts/Roboto-Light.ttf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-thinitalic": require("../assets/fonts/Roboto-ThinItalic.ttf"),
  });

  useEffect(()=>{
    async function checkAsyncUser(){
      
      try {
        let user = await AsyncStorage.getItem("user");

      if(user != null){
         router.replace("/home");
      }

      } catch (e) {
        console.log(e);
      }
    }
  
    checkAsyncUser();

  },[]
)

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  
  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"} 
    keyboardVerticalOffset={150}
     >
    <LinearGradient colors={["white", "white"]}>
      <Image source={mainImagePath} style={styleSheet.image1} />
      <ScrollView style={styleSheet.scrollview1}>
        <View style={styleSheet.container}>
          <Text style={styleSheet.text1}>
            Welcome to VibeChat! Create your account.
          </Text>
          <Text style={styleSheet.text2}>Select your profile picture</Text>
          <Pressable
            onPress={async () => {
              let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1,
              });

              if (!result.canceled) {
                setImage(result.assets[0].uri);
              }
            }}
          >
            <Image
              source={getimage}
              style={styleSheet.image2}
              contentFit={"fill"}
            />
          </Pressable>
          <Text style={styleSheet.text2}>Mobile</Text>
          <TextInput
            style={styleSheet.input1}
            inputMode={"tel"}
            onChangeText={(text) => {
              setMobile(text);
            }}
          />
          <View style={styleSheet.view1}>
            <View style={styleSheet.view2}>
              <Text style={styleSheet.text2}>First Name</Text>
              <TextInput
                style={styleSheet.input1}
                onChangeText={(text) => {
                  setFirstName(text);
                }}
              />
            </View>
            <View style={styleSheet.view2}>
              <Text style={styleSheet.text2}>Last Name</Text>
              <TextInput
                style={styleSheet.input1}
                onChangeText={(text) => {
                  setLastName(text);
                }}
              />
            </View>
          </View>
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
              onPress={async () => {
                let formData = new FormData();
                formData.append("mobile", getMobile);
                formData.append("firstName", getFirstName);
                formData.append("lastName", getLastName);
                formData.append("password", getPassword);
  
                if (getimage != null) {
                  formData.append("avatarImage", {
                    name: "avatar",
                    type: "image/png",
                    uri: getimage,
                  });
                }
  
                let response = await fetch(
                  process.env.EXPO_PUBLIC_URL+"/VibeChat/SignUp",
                  {
                    method: "POST",
                    body: formData,
                  }
                );
  
                if (response.ok) {
                  let json = await response.json();
                  if (json.success) {
                    //user registration complete
                    Alert.alert("Success", json.message);
                    router.replace("/signin");
                  } else {
                    //problem
                    Alert.alert("Error", json.message);
                  }
                }
              }}
            >
              <Text style={styleSheet.text3}>Sign Up</Text>
            </Pressable>
            <Pressable style={styleSheet.pressable1} onPress={()=>{
              router.push("/signin")
            }}>
              <Text style={styleSheet.text3}>Sign In</Text>
            </Pressable>
          </View>
          <Text style={styleSheet.text4}>Powered By VibeChat</Text>
        </View>
      </ScrollView>
    </LinearGradient>
    </KeyboardAvoidingView>
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
  image1: {
    width: 148,
    height: 148,
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
    fontSize: 18,
  },
  text4: {
    fontFamily: "Roboto-light",
    fontSize: 17,
    alignSelf: "center",
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
