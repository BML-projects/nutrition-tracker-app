import React from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { styles } from "../../src/styles/fooddetails";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

/* ---------------- Types ---------------- */

type Ingredient = {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
};

/* ---------------- Screen ---------------- */

export default function FoodDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    /**
     * Expo Router params come as string | string[]
     * We MUST safely parse them to avoid crashes
     */

    const imageUri = params.imageUri as string;

    const foodName =
        (params.foodName as string) ?? "Food Analysis";

    const calories = Number(params.calories ?? 0);
    const protein = Number(params.protein ?? 0);
    const carbs = Number(params.carbs ?? 0);
    const fat = Number(params.fat ?? 0);

    const analysis =
        (params.analysis as string) ??
        "AI analysis will appear here after scanning the food image.";

    const ingredients: Ingredient[] = params.ingredients
        ? JSON.parse(params.ingredients as string)
        : [];

    const onUpdatePress = () => {
        console.log("UPDATE CLICKED");
        // TODO: send data to backend or save in global store
    };

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            {/* Image */}
            <View style={styles.imageWrapper}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                    <View
                        style={[
                            styles.image,
                            { justifyContent: "center", alignItems: "center" },
                        ]}
                    >
                        <Text>No image selected</Text>
                    </View>
                )}

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Feather name="arrow-left" size={22} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Title */}
            <Text style={styles.title}>{foodName}</Text>

            {/* Nutrition */}
            <View style={styles.card}>
                <NutritionRow label="Calories (kcal)" value={calories} />
                <NutritionRow
                    label="Protein (g)"
                    value={protein}
                    icon="arm-flex"
                />
                <NutritionRow
                    label="Carbs (g)"
                    value={carbs}
                    icon="bread-slice"
                />
                <NutritionRow
                    label="Fat (g)"
                    value={fat}
                    icon="oil"
                />
            </View>

            {/* Analysis */}
            <Text style={styles.analysisText}>{analysis}</Text>

            {/* Ingredients */}
            <Text style={styles.sectionTitle}>Ingredients</Text>

            {ingredients.length > 0 ? (
                ingredients.map((item, index) => (
                    <View key={index} style={styles.ingredientCard}>
                        <Text style={styles.ingredientTitle}>
                            {item.name} ({item.calories} Kcal)
                        </Text>

                        <View style={styles.macroRow}>
                            <MacroItem
                                icon="arm-flex"
                                value={`${item.protein}g`}
                            />
                            <MacroItem
                                icon="bread-slice"
                                value={`${item.carbs}g`}
                            />
                            <MacroItem
                                icon="oil"
                                value={`${item.fat}g`}
                            />
                        </View>
                    </View>
                ))
            ) : (
                <Text style={{ opacity: 0.6, marginTop: 8 }}>
                    Ingredients will appear after analysis.
                </Text>
            )}

            {/* Update Button */}
            <TouchableOpacity
                style={styles.updateButton}
                onPress={onUpdatePress}
            >
                <Text style={styles.updateText}>UPDATE</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

/* ---------------- Components ---------------- */

function NutritionRow({
    label,
    value,
    icon,
}: {
    label: string;
    value: number;
    icon?: string;
}) {
    return (
        <View style={styles.nutritionRow}>
            <View style={styles.rowLeft}>
                {icon && (
                    <MaterialCommunityIcons
                        name={icon as any}
                        size={18}
                        color="#4CAF50"
                    />
                )}
                <Text style={styles.rowLabel}>{label}</Text>
            </View>
            <Text style={styles.rowValue}>{value}</Text>
        </View>
    );
}

function MacroItem({
    icon,
    value,
}: {
    icon: string;
    value: string;
}) {
    return (
        <View style={styles.macroItem}>
            <MaterialCommunityIcons
                name={icon as any}
                size={16}
                color="#FFA726"
            />
            <Text style={styles.macroText}>{value}</Text>
        </View>
    );
}
