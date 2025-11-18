import { ImageSourcePropType } from "react-native";

export type CategoryItem = {
  id: string;
  name: string;
  image: ImageSourcePropType | null; // <-- pour éviter ton erreur
};

const categoriesData: CategoryItem[] = [
  {
    id: "1",
    name: "Technologie",
    image: require("../assets/ad1.jpeg"),
  },
  {
    id: "2",
    name: "Mode",
    image: require("../assets/ad2.jpeg"),
  },
  {
    id: "3",
    name: "Autres",
    image: null, // <-- autorisé maintenant
  },
];

export default categoriesData;
