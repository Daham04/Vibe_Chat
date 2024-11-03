import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Cancellable } from "@shopify/flash-list";

SplashScreen.preventAutoHideAsync();

const backwardArrow = require("../assets/images/left-arrow.png");
const userImagePath = require("../assets/images/profile-user.png");
const logout = require("../assets/images/logout.png");

export default function Profile() {
  const [getImage, setImage] = useState(null);
  const [getUser, setUser] = useState({});
  const [getImageError, setImageError] = useState(false);

  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");

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

  useEffect(() => {
    async function checkAsyncUser() {
      let userJson = await AsyncStorage.getItem("user");
      let user = JSON.parse(userJson);
      if (user) {
        setUser(user);
        setFirstName(user.first_name);
        setLastName(user.last_name);
      }
    }
    checkAsyncUser();
  }, []);

  return (
    <LinearGradient colors={["white", "white"]} style={stylesheet.view1}>
      <View style={stylesheet.view2}>
        <Pressable
          onPress={() => {
            router.back();
          }}
        >
          <Image source={backwardArrow} style={stylesheet.image1} />
        </Pressable>
        <Text style={stylesheet.text1}>Profile</Text>
        <Pressable
          onPress={() => {
            Alert.alert(
              "Confirmation",
              "Are you sure want to log out?",
              [
                 {
                  text:"No",
                  onPress:()=>{
                    router.replace("/profile");
                  }
                 },{
                  text:"Yes",
                  onPress:()=>{
                    AsyncStorage.removeItem("user");
                    router.replace("/signin");
                  },
                 },
              ],{ cancelable: false } 
            );

            
          }}
          style={stylesheet.pressable3}
        >
          <Image source={logout} style={stylesheet.image3} />
        </Pressable>
      </View>

      <View style={stylesheet.view4}>
        <View style={stylesheet.view3}>
          <Image
            source={
              getImage
                ? { uri: getImage } 
                : !getImageError
                ? {
                    uri:
                      process.env.EXPO_PUBLIC_URL +
                      "/VibeChat/Avatar_Images/" +
                      getUser.mobile +
                      ".png",
                  }
                : userImagePath
            }
            onError={() => setImageError(true)}
            style={stylesheet.image2}
          />
        </View>

        <Pressable
          style={stylesheet.pressable1}
          onPress={async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 4],
              quality: 1,
            });
        
            if (!result.canceled) {
              setImage(result.assets[0].uri); 
              setImageError(false); 
            }
          }}
        >
          <Text style={stylesheet.text2}>Change Your Picture</Text>
        </Pressable>

        <View style={stylesheet.view5}>
          <Text style={stylesheet.text3}>First Name</Text>
          <TextInput
            style={stylesheet.input1}
            value={getFirstName}
            onChangeText={(text) => setFirstName(text)}
          />
        </View>

        <View style={stylesheet.view6}>
          <Text style={stylesheet.text3}>Last Name</Text>
          <TextInput
            style={stylesheet.input1}
            value={getLastName}
            onChangeText={(text) => setLastName(text)}
          />
        </View>

        <View style={stylesheet.view6}>
          <Text style={stylesheet.text3}>Mobile</Text>
          <TextInput
            style={stylesheet.input1}
            value={getUser.mobile}
            editable={false}
          />
        </View>

        <View style={stylesheet.view6}>
          <Text style={stylesheet.text3}>Joined Date Time</Text>
          <TextInput
            style={stylesheet.input1}
            value={getUser.registration_date_time}
            editable={false}
          />
        </View>

        <Pressable
          style={stylesheet.pressable2}
          onPress={async () => {
            let formData = new FormData();
            formData.append("firstName", getFirstName);
            formData.append("lastName", getLastName);
            formData.append("mobile", getUser.mobile);

            if (getImage != null) {
              formData.append("avatarImage", {
                name: "avatar",
                type: "image/png",
                uri: getImage,
              });
            }

            try {
              let response = await fetch(
                process.env.EXPO_PUBLIC_URL + "/VibeChat/Update",
                {
                  method: "POST",
                  body: formData,
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );

              if (response.ok) {
                let json = await response.json();
                if (json.success) {
                  console.log(json.user);
                  await AsyncStorage.setItem("user", JSON.stringify(json.user));
                  Alert.alert("Success", json.message);
                  if (getImage) {
                    setImage(getImage); 
                  }
                } else {
                  Alert.alert("Error", json.message);
                }
              } else {
                Alert.alert(
                  "Error",
                  "Something went wrong while updating your profile."
                );
              }
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to update profile: " + error.message
              );
            }
          }}
        >
          <Text style={stylesheet.text4}>Update Profile</Text>
        </Pressable>
      </View>

      <View style={stylesheet.view7}>
        <Text style={stylesheet.text5}>VibeChat</Text>
      </View>
    </LinearGradient>
  );
}

const stylesheet = StyleSheet.create({
  view1: {
    flex: 1,
  },
  view2: {
    height: 50,
    flexDirection: "row",
    columnGap: 10,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  image1: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  text1: {
    fontFamily: "Roboto-Bold",
    fontSize: 25,
    flex: 1,
  },
  image2: {
    width: 100,
    height: 100,
    borderRadius: 90,
  },
  view3: {
    width: 110,
    height: 110,
    borderStyle: "solid",
    borderRadius: 100,
    borderColor: "#57a197",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  view4: {
    flex: 1,
  },
  pressable1: {
    height: 50,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 5,
  },
  pressable2: {
    height: 50,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  text2: {
    fontSize: 20,
    fontFamily: "Roboto-Regular",
    color: "#b091c7",
  },
  view5: {
    flexDirection: "row",
    columnGap: 5,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  view6: {
    flexDirection: "row",
    columnGap: 5,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 10,
  },
  text3: {
    fontSize: 15,
    fontFamily: "Roboto-Bold",
    flex: 1,
  },
  text4: {
    fontFamily: "Roboto-Bold",
    fontSize: 20,
    flex: 1,
    marginTop: 20,
  },
  input1: {
    borderWidth: 2,
    borderStyle: "solid",
    borderRadius: 15,
    height: 50,
    borderColor: "#57a197",
    fontFamily: "Roboto-light",
    fontSize: 15,
    paddingHorizontal: 10,
    flex: 4,
  },
  view7: {
    height: 50,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  text5: {
    fontFamily: "Roboto-light",
    fontSize: 20,
    color: "#337A71",
  },
  pressable3: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  image3: {
    width: 20,
    height: 20,
    marginRight: 10,
    alignSelf: "flex-end",
  },
});
