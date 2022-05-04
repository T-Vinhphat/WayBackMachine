import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
  Button,
} from "react-native";
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { AntDesign } from "@expo/vector-icons";
import { WebView } from "react-native-webview";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function LoginPage({ navigation }) {
  const [text, onChangeText] = React.useState("");
  const [password, onChangePassword] = React.useState("");

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Image
          style={styles.logo}
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Wayback_Machine_logo_2010.svg/2560px-Wayback_Machine_logo_2010.svg.png",
          }}
        ></Image>
        <Text style={styles.mainTitle}>Se connecter</Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.formCase}
            onChangeText={onChangeText}
            value={text}
            placeholder="Votre email"
          ></TextInput>
          <TextInput
            style={styles.formCase}
            type="password"
            onChangeText={onChangePassword}
            value={password}
            placeholder="Votre mot de passe"
            secureTextEntry={true}
          ></TextInput>
        </View>

        <TouchableOpacity
          style={styles.button}
          title="Envoyer"
          onPress={() => navigation.navigate("Main")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SearchScreen() {
  const [text, onChangeText] = React.useState("");
  const [selecteur, setSelecteur] = useState(false);
  const [date, setDate] = useState(new Date(Date.now()));
  const [timestamp, setTimestamp] = useState("");
  const [link, setLink] = useState("");
  const [result, setResult] = useState(null);

  let replace = timestamp.replaceAll("-", "");

  let slice = replace.slice(0, 8);

  const _handlePressButtonAsync = async () => {
    let result = await WebBrowser.openBrowserAsync(link);
    setResult(result);
  };

  const calendrier = () => {
    setSelecteur(true);
  };

  const onChange = (event, value) => {
    setDate(value);
    if (Platform.OS === "android") {
      setSelecteur(false);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", marginTop: 30 }}>
      <SafeAreaView></SafeAreaView>
      <Text style={styles.titleTabs}>Page d'accueil</Text>
      <TextInput
        style={styles.formCase}
        onChangeText={onChangeText}
        value={text}
        placeholder="http://..."
      ></TextInput>
      <View style={styles.pickedDateContainer}>
        <Text style={styles.pickedDate}>{date.toLocaleDateString()}</Text>
      </View>

      {!selecteur && (
        <View style={styles.btnContainer}>
          <Button
            title="Selectionner une date"
            color="black"
            onPress={calendrier}
          />
        </View>
      )}

      {selecteur && (
        <DateTimePicker
          value={date}
          mode={"date"}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          is24Hour={true}
          onChange={onChange}
          style={styles.datePicker}
        />
      )}
      <TouchableOpacity
        style={styles.button}
        title="Rechercher"
        onPress={() =>
          fetch(
            `http://archive.org/wayback/available?url=${text}&timestamp=${slice}`
          )
            .then((response) => response.json())
            .then((data) => {
              console.log(data.archived_snapshots.closest);
              setLink(data.archived_snapshots.closest.url);
              setTimestamp(date.toJSON());
            })
        }
      >
        <Text style={styles.buttonText}>Rechercher</Text>
      </TouchableOpacity>
      <Text style={{ marginTop: 20, fontSize: 20 }}>Votre lien :</Text>
      <Text
        style={{ marginTop: 20, fontSize: 20 }}
        onPress={_handlePressButtonAsync}
      >
        {link}
      </Text>
    </View>
  );
}

function PreviewScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", marginTop: 30 }}>
      <SafeAreaView></SafeAreaView>
      <Text style={styles.titleTabs}>Resultat</Text>
    </View>
  );
}

function HistoryScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", marginTop: 30 }}>
      <SafeAreaView></SafeAreaView>
      <Text style={styles.titleTabs}>Historique</Text>
    </View>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#065a5a",
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Preview"
        component={PreviewScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Fontisto name="preview" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="profile" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Main" component={MyTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    flex: 0.5,
    width: 250,
    resizeMode: "center",
  },

  mainTitle: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 80,
    color: "black",
  },

  titleTabs: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 80,
    color: "#971919",
    marginTop: 50,
  },

  form: {
    flexDirection: "column",
    alignItems: "center",
  },

  formCase: {
    backgroundColor: "#fff",
    height: 40,
    width: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },

  button: {
    flexDirection: "column",
    alignItems: "center",
    width: 200,
    borderRadius: 20,
    backgroundColor: "#dfdfdf",
  },

  buttonText: {
    fontSize: 30,
    padding: 10,
    color: "black",
  },

  inputView: {
    marginBottom: 30,
  },

  pickedDateContainer: {
    padding: 20,
  },
  pickedDate: {
    fontSize: 24,
    color: "black",
  },
  btnContainer: {
    padding: 30,
  },

  datePicker: {
    width: 320,
    height: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
});
