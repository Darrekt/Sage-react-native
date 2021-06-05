import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import Card from "../layout/Card";
import { globalStyles } from "../../../styles";
import { ProjectEntity, ProjectFromEntity } from "../../models/Project";
import { useNavigation } from "@react-navigation/native";
import { List } from "immutable";
import { Screens } from "../../screens/navConstants";
import { AntDesign, Foundation } from "@expo/vector-icons";
import { UNCATEGORISED_TODO_PROJID } from "../../util/constants";

const styles = StyleSheet.create({
  cardStyle: {
    width: Dimensions.get("window").width * 0.7,
    marginHorizontal: 15,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  emojiFont: { color: "black", fontSize: 25, margin: 5 },
  blackFont: {
    color: "black",
  },
  redFont: {
    color: "red",
  },
});

export default function ProjectCard({ project }: { project: ProjectEntity }) {
  const navigation = useNavigation();
  const now = new Date().valueOf();
  const deadlineNumber = ProjectFromEntity(project).closestDeadline()?.due;
  const ddlString = deadlineNumber
    ? new Date(deadlineNumber).toDateString()
    : undefined;
  const dueDateFont =
    List(project.deadlines).first(0).valueOf() > now
      ? styles.blackFont
      : styles.redFont;

  return project.id === UNCATEGORISED_TODO_PROJID ? (
    <Card
      style={styles.cardStyle}
      onPress={() => navigation.navigate(Screens.AddProject)}
    >
      <Text>Get started by adding a project!</Text>
      <Foundation name="pencil" size={35} color="grey" />
    </Card>
  ) : (
    <Card
      elevation={16}
      style={styles.cardStyle}
      onPress={() =>
        navigation.navigate(Screens.ViewProject, { projID: project.id })
      }
    >
      <View style={globalStyles.column}>
        <View
          style={{
            ...globalStyles.row,
            justifyContent: "flex-start",
            paddingHorizontal: 10,
          }}
        >
          <Text style={styles.emojiFont}>{project.emoji}</Text>
          <View style={globalStyles.column}>
            <Text
              style={{
                alignSelf: "stretch",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: "500",
                marginHorizontal: 10,
              }}
            >
              {project.name}
            </Text>
          </View>
        </View>
        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: StyleSheet.hairlineWidth,
            alignSelf: "stretch",
          }}
        />
        <View
          style={{
            ...globalStyles.row,
            justifyContent: "center",
            alignContent: "center",
            height: "35%",
          }}
        >
          <AntDesign name="calendar" size={30} color="black" />
          <View style={{ ...globalStyles.column, marginHorizontal: 20 }}>
            <Text style={dueDateFont}>
              {ddlString ?? "No upcoming deadlines"}
            </Text>
            <Text>
              {List(project.todos).isEmpty()
                ? "Done for today!"
                : `${project.todos.length} task${
                    project.todos.length > 1 ? "s" : ""
                  } remaining`}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}
