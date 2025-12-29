export const calculateBMI = (heightCm: number, weightKg: number) => {
      const heightM = heightCm / 100;
      const bmi = weightKg / (heightM * heightM);
      return parseFloat(bmi.toFixed(2));
    };
    
    export const calculateBMR = (heightCm: number, weightKg: number, age: number, gender: "male" | "female" | "other") => {
      if (gender === "male") {
        return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
      } else if (gender === "female") {
        return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
      } else {
        // For "other", use average of male/female
        const maleBMR = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
        const femaleBMR = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
        return Math.round((maleBMR + femaleBMR) / 2);
      }
    };
    
    export const calculateDailyCalories = (bmr: number, goal: "lose" | "maintain" | "gain") => {
      if (goal === "lose") return Math.round(bmr * 0.8); // 20% deficit
      if (goal === "gain") return Math.round(bmr * 1.2); // 20% surplus
      return bmr; // maintain
    };
    