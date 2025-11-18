import { Link } from "expo-router";
import { View, Text, Image, TouchableOpacity } from "react-native";
import categoriesData from "../../constants/categoriesData"; 

export default function HomeScreen() {
  return (
    <View style={{ padding: 20 }}>
      {categoriesData.map((cat) => (
        <Link
          href={`/category/${cat.id}`}
          key={cat.id}
          asChild
        >
          <TouchableOpacity style={{ marginBottom: 20 }}>
            <Image
              source={cat.image ?? require("../../assets/live.jpeg")}
              style={{ width: 60, height: 60 }}
            />
            <Text>{cat.name}</Text>
          </TouchableOpacity>
        </Link>
      ))}
    </View>
  );
}
