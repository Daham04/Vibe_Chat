import { FontAwesome6 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

SplashScreen.preventAutoHideAsync();

const userImagePath = require("../assets/images/profile-user.png");
const homeChatIcon = require("../assets/images/bubble-chat.png");
const bottomChatIcon = require("../assets/images/bottomchat.png");
const bottomUserIcon = require("../assets/images/bottomuser.png");

export default function Home() {
  const [getChatAray, setChatArray] = useState([]);

  const [getallChats, setAllChats] = useState([]);
  const [getsearchQuery, setSearchQuery] = useState("");
  const [getUser, setUser] = useState("");

  const [getImageError, setImageError] = useState(false);

  const [loaded, error] = useFonts({
    "Roboto-light": require("../assets/fonts/Roboto-Light.ttf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-thinitalic": require("../assets/fonts/Roboto-ThinItalic.ttf"),
  });

  useEffect(() => {
    async function fetchData() {
      let userJson = await AsyncStorage.getItem("user");
      let user = JSON.parse(userJson);
      setUser(user);
      let response = await fetch(
        process.env.EXPO_PUBLIC_URL + "/VibeChat/LoadHomeData?id=" + user.id
      );

      if (response.ok) {
        let json = await response.json();

        if (json.success) {
          let chatArray = json.chatArray;
          setChatArray(chatArray);
          setAllChats(chatArray);
        }
      }
    }

    fetchData();
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text === "") {
      setChatArray(getallChats);
    } else {
      const filteredChats = getallChats.filter((item) =>
        item.other_user_name.toLowerCase().includes(text.toLowerCase())
      );
      setChatArray(filteredChats);
    }
  };

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <LinearGradient colors={["white", "white"]} style={stylesheet.view1}>
      <View style={stylesheet.view3}>
        <View style={stylesheet.view4}>
          <Text style={stylesheet.text2}>Users</Text>
            <Image source={bottomUserIcon} style={stylesheet.image3} />
        </View>
        <Pressable
          style={stylesheet.view5}
          onPress={() => {
            router.push("/profile");
          }}
        >
          <View style={stylesheet.view9}>
            <Image
              source={
                !getImageError
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
              style={stylesheet.image1}
            />
          </View>
        </Pressable>
      </View>
      <TextInput
        style={stylesheet.input1}
        placeholder="Search User"
        value={getsearchQuery}
        onChangeText={handleSearch}
      />

      <FlashList
        data={getChatAray}
        renderItem={({ item }) => (
          <Pressable
            style={stylesheet.pressable1}
            onPress={() => {
              router.push({
                pathname: "/chat",
                params: item,
              });
            }}
          >
            <View style={stylesheet.view7}>
              {item.other_user_found ? (
                <Image
                  source={
                    process.env.EXPO_PUBLIC_URL +
                    "/VibeChat/Avatar_Images/" +
                    item.mobile +
                    ".png"
                  }
                  contentFit="fill"
                  style={stylesheet.image2}
                />
              ) : (
                <Text style={stylesheet.text6}>
                  {item.other_user_avatar_letters}
                </Text>
              )}
            </View>
            <View style={stylesheet.view6}>
              <Text style={stylesheet.text3}>{item.other_user_name}</Text>
              <Text style={stylesheet.text5}>{item.registration_date_time} </Text>
            </View>
          </Pressable>
        )}
        estimatedItemSize={200}
      />
      <View style={stylesheet.view2}>
        <Pressable style={stylesheet.view10}  onPress={()=>{
          router.push("/home");
        }}>
          <Image source={bottomChatIcon} style={stylesheet.image4}/>
        </Pressable>
        <Pressable style={stylesheet.view11}>
        <Image source={bottomUserIcon} style={stylesheet.image4}/>
        </Pressable>

        {/* <Text style={stylesheet.text1}>VibeChat</Text> */}
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
    backgroundColor: "white",
    flexDirection:"row",
    borderBlockEndColor: "white",
    borderBlockStartColor:"#337A71",
    borderRightColor:"white",
    borderLeftColor:"white",
    borderStyle: "solid",
    borderWidth: 2,
  },
  view3: {
    height: 50,
    flexDirection: "row",
  },
  view4: {
    flex: 1,
    flexDirection:"row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  view5: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  view10:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    borderBlockEndColor: "white",
    borderBlockStartColor:"white",
    borderRightColor:"#b0d4cf",
    borderLeftColor:"white",
    borderStyle: "solid",
    borderWidth: 2,
  },
  view11:{
    flex:1,
   justifyContent:"center",
    alignItems:"center",
    borderBlockEndColor: "white",
    borderBlockStartColor:"white",
    borderRightColor:"white",
    borderLeftColor:"#b0d4cf",
  },
  image1: {
    width: 42,
    height: 42,
    borderRadius: 40,
  },
  image3: {
    width: 30,
    height: 30,
    marginTop: 5,
    marginLeft: 10,
  },
  image4: {
    width: 32,
    height: 32,
  },
  view9: {
    width: 45,
    height: 45,
    borderRadius: 42,
    marginTop: 5,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor:"#8659A8",
    borderWidth:1,
    borderStyle:"dotted"
  },
  image2: {
    width: 40,
    height: 40,
    borderRadius: 35,
  },
  text1: {
    fontFamily: "Roboto-light",
    fontSize: 20,
    color: "#337A71",
  },
  text2: {
    fontFamily: "Roboto-Bold",
    fontSize: 30,
    color: "#8659A8",
    alignItems: "flex-end",
    marginTop: 5,
    marginLeft: 10,
  },
  input1: {
    borderRadius: 15,
    height: 35,
    fontSize: 17,
    fontFamily: "Roboto-light",
    borderColor: "#337A71",
    borderStyle: "solid",
    borderWidth: 2,
    margin: 10,
    paddingStart: 10,
  },
  mainView: {
    flex: 1,
    marginVertical: 10,
  },
  pressable1: {
    borderBlockEndColor: "#b0d4cf",
    borderBlockStartColor:"white",
    borderRightColor:"white",
    borderLeftColor:"white",
    borderStyle: "solid",
    borderWidth: 2,
    flexDirection: "row",
    columnGap: 5,
    marginVertical: 5,
    margin: 10,
  },
  view6: {
    rowGap: 7,
    flex: 1,
  },
  view7: {
    width: 45,
    height: 45,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginLeft: 5,
    borderColor: "#57a197",
    borderWidth: 2,
    borderStyle: "solid",
    marginBottom:10
  },
  view8: {
    flexDirection: "row",
    columnGap: 5,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text3: {
    fontFamily: "Roboto-Regular",
    fontSize: 18,
    marginTop: 5,
  },
  text4: {
    fontFamily: "Roboto-light",
    fontSize: 15,
  },
  text5: {
    fontFamily: "Roboto-light",
    fontSize: 12,
  },
  icon: {
    marginRight: 10,
  },
  text6: {
    fontSize: 20,
    fontFamily: "Roboto-Bold",
    color: "#337A71",
  },
});
