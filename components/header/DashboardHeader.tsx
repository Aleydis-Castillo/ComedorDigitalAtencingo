import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/colors";

export default function DashboardHeader() {

  const hour = new Date().getHours();

  let greeting = "Buenos días ☀️";

  if (hour >= 12 && hour < 19) {
    greeting = "Buenas tardes 🌤️";
  }

  if (hour >= 19) {
    greeting = "Buenas noches 🌙";
  }

  return (

    <View style={styles.container}>

      <Text style={styles.greeting}>
        {greeting}
      </Text>

      <Text style={styles.name}>
        Paola Suárez
      </Text>

      <Text style={styles.date}>
        {new Date().toLocaleDateString("es-MX", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      </Text>

    </View>

  );

}

const styles = StyleSheet.create({

  container:{

    marginTop:45,
    marginBottom:25,

  },

  greeting:{
    fontSize:18,
    color:COLORS.gray
  },

  name:{
    fontSize:32,
    fontWeight:"bold",
    color:COLORS.primary,
    marginTop:5
  },

  date:{
    marginTop:10,
    fontSize:15,
    color:COLORS.gray
  }

});