import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, Text, View } from "react-native";
import { Images } from "../src/constants/images";
import { styles } from "../src/styles/splash";



const a = 'hello';
console.log(a);




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
