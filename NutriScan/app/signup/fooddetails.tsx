import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
    StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";

// ----------------- Replace with your FastAPI host -----------------
const FASTAPI_HOST = "http://127.0.0.1:8000/predict"; // use PC LAN IP for physical device

// ----------------- Types -----------------
type Ingredient = {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
};

type Prediction = {
    class: string;
    confidence: number;
};

// ----------------- Main Screen -----------------
export default function FoodDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const imageUri = params.imageUri as string;

    const [foodName, setFoodName] = useState(
        (params.foodName as string) ?? "Food Analysis"
    );
    const [calories, setCalories] = useState(Number(params.calories ?? 0));
    const [protein, setProtein] = useState(Number(params.protein ?? 0));
    const [carbs, setCarbs] = useState(Number(params.carbs ?? 0));
    const [fat, setFat] = useState(Number(params.fat ?? 0));
    const [analysis, setAnalysis] = useState(
        (params.analysis as string) ?? "AI analysis will appear here after scanning the food image."
    );
    const [ingredients, setIngredients] = useState<Ingredient[]>(
        params.ingredients ? JSON.parse(params.ingredients as string) : []
    );
    const [loading, setLoading] = useState(false);
    const [top5, setTop5] = useState<Prediction[]>([]);

    const onUpdatePress = () => {
        console.log("UPDATE CLICKED");
        // TODO: save data to backend or global store
    };

    // ----------------- Upload Image -----------------
    const uploadImage = async () => {
        if (!imageUri) return;
        setLoading(true);

        try {
            // Convert blob URI to a real file
            const responseBlob = await fetch(imageUri);
            const blob = await responseBlob.blob();

            const formData = new FormData();
            formData.append("image", blob, "food.jpg");

            const response = await axios.post(FASTAPI_HOST, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Update top-1 prediction only
            setFoodName(response.data.top1.class);
            setAnalysis(
                `AI Prediction Confidence: ${Math.round(response.data.top1.confidence * 100)}%`
            );
            setTop5(response.data.top5 ?? []);

        } catch (err) {
            console.error(err);
            setAnalysis("Prediction failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* ----------------- Image ----------------- */}
            <View style={styles.imageWrapper}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                    <View style={[styles.image, { justifyContent: "center", alignItems: "center" }]}>
                        <Text>No image selected</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={22} color="#000" />
                </TouchableOpacity>

                {imageUri && (
                    <TouchableOpacity style={styles.scanButton} onPress={uploadImage}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.scanText}>SCAN FOOD</Text>}
                    </TouchableOpacity>
                )}
            </View>

            {/* ----------------- Title ----------------- */}
            <Text style={styles.title}>{foodName}</Text>


            {/* ----------------- Nutrition ----------------- */}
            <View style={styles.card}>
                <NutritionRow label="Calories (kcal)" value={calories} />
                <NutritionRow label="Protein (g)" value={protein} icon="arm-flex" />
                <NutritionRow label="Carbs (g)" value={carbs} icon="bread-slice" />
                <NutritionRow label="Fat (g)" value={fat} icon="oil" />
            </View>

            {/* ----------------- Analysis ----------------- */}
            <Text style={styles.analysisText}>{analysis}</Text>

            {/* ----------------- Top-5 Predictions ----------------- */}
            {top5.length > 0 && (
                <View style={{ marginVertical: 12 }}>
                    <Text style={styles.sectionTitle}>Top 5 Predictions</Text>
                    <FlatList
                        data={top5}
                        keyExtractor={(item) => item.class}
                        renderItem={({ item }) => (
                            <View style={styles.predictionRow}>
                                <Text style={{ flex: 1 }}>{item.class}</Text>
                                <View style={styles.barBackground}>
                                    <View style={[styles.barFill, { width: `${item.confidence * 100}%` }]} />
                                </View>
                                <Text style={{ width: 50, textAlign: "right" }}>{Math.round(item.confidence * 100)}%</Text>
                            </View>
                        )}
                    />
                </View>
            )}

            {/* ----------------- Ingredients ----------------- */}
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {ingredients.length > 0 ? (
                ingredients.map((item, index) => (
                    <View key={index} style={styles.ingredientCard}>
                        <Text style={styles.ingredientTitle}>{item.name} ({item.calories} Kcal)</Text>
                        <View style={styles.macroRow}>
                            <MacroItem icon="arm-flex" value={`${item.protein}g`} />
                            <MacroItem icon="bread-slice" value={`${item.carbs}g`} />
                            <MacroItem icon="oil" value={`${item.fat}g`} />
                        </View>
                    </View>
                ))
            ) : (
                <Text style={{ opacity: 0.6, marginTop: 8 }}>
                    Ingredients will appear after analysis.
                </Text>
            )}

            <TouchableOpacity style={styles.updateButton} onPress={onUpdatePress}>
                <Text style={styles.updateText}>UPDATE</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

// ----------------- Components -----------------
function NutritionRow({ label, value, icon }: { label: string; value: number; icon?: string }) {
    return (
        <View style={styles.nutritionRow}>
            <View style={styles.rowLeft}>
                {icon && <MaterialCommunityIcons name={icon as any} size={18} color="#4CAF50" />}
                <Text style={styles.rowLabel}>{label}</Text>
            </View>
            <Text style={styles.rowValue}>{value}</Text>
        </View>
    );
}

function MacroItem({ icon, value }: { icon: string; value: string }) {
    return (
        <View style={styles.macroItem}>
            <MaterialCommunityIcons name={icon as any} size={16} color="#FFA726" />
            <Text style={styles.macroText}>{value}</Text>
        </View>
    );
}

// ----------------- Styles -----------------
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 12 },
    imageWrapper: { position: "relative" },
    image: { width: "100%", height: 250, borderRadius: 12 },
    backButton: { position: "absolute", top: 20, left: 20, backgroundColor: "#fff", padding: 6, borderRadius: 20 },
    scanButton: { position: "absolute", bottom: 10, right: 10, backgroundColor: "#4CAF50", padding: 10, borderRadius: 8 },
    scanText: { color: "#fff", fontWeight: "bold" },
    title: { fontSize: 22, fontWeight: "bold", marginTop: 12 },
    card: { backgroundColor: "#f7f7f7", borderRadius: 12, padding: 12, marginVertical: 12 },
    nutritionRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 4 },
    rowLeft: { flexDirection: "row", alignItems: "center" },
    rowLabel: { marginLeft: 6 },
    rowValue: { fontWeight: "bold" },
    analysisText: { marginVertical: 8, fontStyle: "italic" },
    sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 12 },
    ingredientCard: { backgroundColor: "#f2f2f2", padding: 8, borderRadius: 8, marginVertical: 4 },
    ingredientTitle: { fontWeight: "bold" },
    macroRow: { flexDirection: "row", marginTop: 4, justifyContent: "space-between" },
    macroItem: { flexDirection: "row", alignItems: "center" },
    macroText: { marginLeft: 4 },
    updateButton: { backgroundColor: "#2196F3", padding: 12, borderRadius: 8, marginVertical: 12, alignItems: "center" },
    updateText: { color: "#fff", fontWeight: "bold" },
    predictionRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
    barBackground: { height: 8, backgroundColor: "#e0e0e0", flex: 1, marginHorizontal: 6, borderRadius: 4 },
    barFill: { height: 8, backgroundColor: "#4CAF50", borderRadius: 4 },
});
