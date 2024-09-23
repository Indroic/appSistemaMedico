import React from "react"
import { Layout, Text, Button } from "@ui-kitten/components"
import { StyleSheet } from "react-native"

export default function Examenes() {
    return (
        <Layout style={styles.container} level="2">
            <Text>
                Este es el Area de Examenes
            </Text>
        </Layout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    }
})