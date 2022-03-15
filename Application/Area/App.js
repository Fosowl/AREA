import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";
import {
  Roboto_400Regular,
  Roboto_700Bold,
  Roboto_500Medium,
} from "@expo-google-fonts/roboto";
import Home from "./pages/Home";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import ChangePassword from "./pages/ChangePassword";
import Settings from "./pages/Settings";
import Profil from "./pages/Profil";
import AppletLogin from "./pages/AppletLogin";
import ChooseAction from "./pages/ChooseAction";
import ChooseService from "./pages/ChooseService";
import Services from "./pages/Services";
import CreateApplet from "./pages/CreateApplet";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import FillInputs from "./pages/FillInputs";

const Stack = createNativeStackNavigator();
export default function App() {
  let [fontsLoaded] = useFonts({
    Roboto_700Bold,
    Roboto_400Regular,
    Roboto_500Medium,
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Group
            screenOptions={{ headerShown: false, gestureEnabled: false }}
          >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="AppletLogin" component={AppletLogin} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="ChooseAction" component={ChooseAction} />
            <Stack.Screen name="ChooseService" component={ChooseService} />
            <Stack.Screen name="CreateApplet" component={CreateApplet} />
            <Stack.Screen name="Profil" component={Profil} />
            <Stack.Screen name="Services" component={Services} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="FillInputs" component={FillInputs} />
            <Stack.Screen
              name="Navbar"
              component={Navbar}
              options={{
                animationEnabled: false,
              }}
            />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
