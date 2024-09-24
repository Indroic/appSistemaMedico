import React from "react";
import { useFormik } from "formik";
import { Layout, Text, Input, Button, Avatar, Icon } from "@ui-kitten/components";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Pressable } from "react-native";
import * as yup from "yup";
import * as FileSystem from "expo-file-system";

import { useRouter, Link } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import * as ImagePicker from "expo-image-picker";

import { ScrollView } from "react-native";

const ImageViewer = ({ selectedImage }) => {
  const imageSource = selectedImage
    ? { uri: selectedImage }
    : require("../../../assets/avatar-placeholder.png");

  return (
    <Avatar
      source={imageSource}
      size="giant"
      style={{ width: 90, height: 90 }}
    />
  );
};

export default function Register() {
  const router = useRouter();
  const { onRegister } = useAuth();
  const { top, bottom, left, right } = useSafeAreaInsets();
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);

  const validator = yup.object().shape({
    username: yup
      .string()
      .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
      .required("El nombre de usuario es requerido"),
    password: yup
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .required("La contraseña es requerida"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Las contraseñas no coinciden")
      .required("La confirmación de la contraseña es requerida"),
    first_name: yup
      .string()
      .min(3, "El primer nombre debe tener al menos 3 caracteres")
      .required("El primer nombre es requerido"),
    last_name: yup
      .string()
      .min(3, "El primer apellido debe tener al menos 3 caracteres")
      .required("El primer apellido es requerido"),
    email: yup
      .string()
      .email("El correo electrónico debe ser válido")
      .required("El correo electrónico es requerido"),
    ci: yup
      .number()
      .min(7, "El CI debe tener al menos 3 caracteres")
      .required("El CI es requerido"),
  });

  const cacheAvatar = async (uri: string) => {
    const cacheDirectory = FileSystem.cacheDirectory;
    const fileName = uri.split("/").pop();
    const filePath = `${cacheDirectory}${fileName}`;
    await FileSystem.copyAsync({ from: uri, to: filePath });
    return filePath;
  }

  const selectAavatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      aspect: [3, 4],
    });

    if (!result.canceled) {
      const filePath = await cacheAvatar(result.assets[0].uri);
      formik.setFieldValue("avatar", filePath);
    }
  };

  const toggleSecureEntry = (): void => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = (props): React.ReactElement => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? "eye-off" : "eye"} />
    </TouchableWithoutFeedback>
  );

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
      avatar: null,
      first_name: "",
      last_name: "",
      email: "",
      ci: "",
    },
    onSubmit: (values) => {
      const register = async () => {
        const result = await onRegister({
          username: values.username,
          password: values.password,
          avatar: values.avatar,
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          ci: parseInt(values.ci),
        });
        if (result.error) {
          const errors: { [key: string]: string } = result.message;
          Object.keys(errors).forEach((key) => {
            formik.setFieldError(key, errors[key]);
          })
          return
        }
        return router.replace("/(tabs)/medicos");
      };
      register();
    },
    validationSchema: validator,
  });

  return (
    <ScrollView>
      <Layout
        style={{
          ...styles.container,
          paddingTop: top,
          paddingBottom: bottom,
          paddingLeft: left,
          paddingRight: right,
        }}
      >
        <Text category="h1">Registrarse</Text>

        <Layout style={styles.form}>
          <Pressable
            onPress={selectAavatar}
            style={{ width: "auto", height: "auto", alignItems: "center" }}
          >
            <ImageViewer selectedImage={formik.values.avatar} />
            <Text category="h6">Avatar</Text>
          </Pressable>
          <Input
            label="Nombre"
            placeholder="Ingrese su Nombre"
            value={formik.values.first_name}
            onChange={(e) =>
              formik.setFieldValue("first_name", e.nativeEvent.text)
            }
            status={formik.errors.first_name ? "danger" : "default"}
            caption={formik.errors.first_name}
          />
          <Input
            label={"Apellido"}
            placeholder={"Ingrese su Apellido"}
            value={formik.values.last_name}
            onChange={(e) =>
              formik.setFieldValue("last_name", e.nativeEvent.text)
            }
            status={formik.errors.last_name ? "danger" : "default"}
            caption={formik.errors.last_name}
          />
          <Input
            value={formik.values.username}
            label="Usuario"
            placeholder="Ingrese su Usuario"
            onChangeText={(nextValue) =>
              formik.setFieldValue("username", nextValue)
            }
            status={formik.errors.username ? "danger" : "default"}
            caption={formik.errors.username}
          />
          <Input
            label="Cédula de Identidad"
            placeholder="Ingrese su Cédula de Identidad"
            value={formik.values.ci}
            onChangeText={(nextValue) => formik.setFieldValue("ci", nextValue)}
            status={formik.errors.ci ? "danger" : "default"}
            caption={formik.errors.ci}
          />
          <Input
            label={"Email"}
            placeholder={"Ingrese su Email"}
            value={formik.values.email}
            onChangeText={(nextValue) =>
              formik.setFieldValue("email", nextValue)
            }
            status={formik.errors.email ? "danger" : "default"}
            caption={formik.errors.email}
          />
          <Input
            label={"Contraseña"}
            placeholder={"Ingrese su contraseña"}
            value={formik.values.password}
            onChangeText={(nextValue) =>
              formik.setFieldValue("password", nextValue)
            }
            status={formik.errors.password ? "danger" : "default"}
            caption={formik.errors.password}
            accessoryRight={renderIcon}
            secureTextEntry={secureTextEntry}
          />
          <Input
            label={"Confirmar Contraseña"}
            placeholder={"Repita su contraseña"}
            value={formik.values.confirmPassword}
            onChangeText={(nextValue) =>
              formik.setFieldValue("confirmPassword", nextValue)
            }
            status={formik.errors.confirmPassword ? "danger" : "default"}
            caption={formik.errors.confirmPassword}
            accessoryRight={renderIcon}
            secureTextEntry={secureTextEntry}
          />
        </Layout>

        <Layout style={styles.buttonLayout}>
          <Button
            onPress={() => formik.handleSubmit()}
            size="large"
            style={{ width: "100%" }}
          >
            Registrarme
          </Button>
          <Text>O</Text>
          <Link href="/auth/login" asChild>
            <Text status="primary" category="h6">
              Iniciar Sesion
            </Text>
          </Link>
        </Layout>
      </Layout>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  captionContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  captionIcon: {
    width: 10,
    height: 10,
    marginRight: 5,
  },
  captionText: {
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "opensans-regular",
    color: "#8F9BB3",
  },
  form: {
    width: "100%",
    gap: 20,
    paddingHorizontal: 20,
  },
  buttonLayout: {
    flexDirection: "column",
    width: "100%",
    padding: 20,
    alignContent: "center",
    gap: 12,
    alignItems: "center",
  },
});
