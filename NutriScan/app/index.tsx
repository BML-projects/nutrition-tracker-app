import React, { useEffect } from "react";
import { View, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import { Images } from "./constants/images";
import { styles } from "./styles/splash";

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace("/src/onboarding");
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Image source={Images.logo} style={[styles.logo,]} />

            <Text style={styles.tagline}>Data Behind Every Bite</Text>
        </View>
    );
}
