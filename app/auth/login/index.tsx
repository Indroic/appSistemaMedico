import React from "react";
import { Layout, Text, Input, Icon, Button } from "@ui-kitten/components";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import { useFormik } from "formik";
import { Link } from "expo-router";
import * as yup from "yup";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "../../context/AuthContext";

import { useRouter } from "expo-router";

export default function Login() {
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);

  const { top, bottom, left, right } = useSafeAreaInsets();

  const router = useRouter();

  const { onLogin } = useAuth();

  const validationSchema = yup.object().shape({
    username: yup.string().required("Este campo es obligatorio"),
    password: yup
      .string()
      .min(8, "Debe de Tener al Menos 8 Caracteres")
      .required("Este campo es obligatorio"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: (values) => {
      const login = async () => {
        const result = await onLogin(values.username, values.password);

        if (result.error) {
          formik.setFieldError("username", "Credenciales Invalidas");
          formik.setFieldError("password", "Credenciales Invalidas");
          return;
        }

        return router.replace("/(tabs)/medicos");
      };
      login();
    },
    validationSchema: validationSchema,
  });

  const toggleSecureEntry = (): void => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = (props): React.ReactElement => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? "eye-off" : "eye"} />
    </TouchableWithoutFeedback>
  );

  return (
    <Layout
      style={{
        ...styles.container,
        paddingTop: top,
        paddingBottom: bottom,
        paddingLeft: left,
        paddingRight: right,
      }}
    >
      <Text category="h1">Iniciar Sesion</Text>

      <Layout style={styles.form}>
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
          value={formik.values.password}
          label="Contraseña"
          placeholder="Ingrese su Contraseña"
          caption={formik.errors.password}
          accessoryRight={renderIcon}
          secureTextEntry={secureTextEntry}
          onChangeText={(nextValue) =>
            formik.setFieldValue("password", nextValue)
          }
          status={formik.errors.password ? "danger" : "default"}
        />
      </Layout>

      <Layout style={styles.buttonLayout}>
        <Button
          onPress={() => formik.handleSubmit()}
          size="large"
          style={{ width: "100%" }}
        >
          Iniciar Sesion
        </Button>
        <Text>O</Text>
        <Link href="/auth/register" asChild>
          <Text status="primary" category="h6">
            Registrarse
          </Text>
        </Link>
      </Layout>
    </Layout>
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
