import 'react-native-url-polyfill/auto';
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, LogBox, Text, View } from "react-native";
import { Images } from "../src/constants/images";
import { styles } from "../src/styles/splash";



const a = 'hello';
console.log(a);

// Suppress the blob URL warning
LogBox.ignoreLogs([
  'No suitable URL request handler found for blob',
]);




export default function Index() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace("/onboarding"); // relative to app/
        }, 2000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <View style={styles.container}>
<Image source={Images.logo} style={styles.logo} />


            <Text style={styles.tagline}>Data Behind Every Bite</Text>
        </View>
    );
}
