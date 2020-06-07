import React, { useState, useEffect } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import {
    View,
    ImageBackground,
    StyleSheet,
    Image,
    Text,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

interface Select {
    label: string;
    value: string;
}

const Home = () => {
    const [ufs, setUfs] = useState<Select[]>([]);
    const [citys, setCitys] = useState<Select[]>([]);
    const [selectedUF, setSelectedUF] = useState("0");
    const [selectedCity, setSelectedCity] = useState("0");
    const navigation = useNavigation();

    // Pegando as UF da api do IBGE
    useEffect(() => {
        axios
            .get<IBGEUFResponse[]>(
                "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
            )
            .then((response) => {
                const ufInitials = response.data.map((uf) => {
                    return {
                        label: uf.sigla,
                        value: uf.sigla,
                    };
                });

                setUfs(ufInitials);
                console.log(ufs);
            });
    }, []);

    // Pegando as cidades da api do IBGE baseada na UF selecionada
    useEffect(() => {
        axios
            .get<IBGECityResponse[]>(
                `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`
            )
            .then((response) => {
                const cityNames = response.data.map((city) => {
                    return {
                        label: city.nome,
                        value: city.nome,
                    };
                });

                setCitys(cityNames);
            });
    }, [selectedUF]);

    function handleSelectUF(uf: string) {
        setSelectedUF(uf);
    }

    function handleSelectCity(city: string) {
        setSelectedCity(city);
    }

    function handleNavigateToPoints() {
        navigation.navigate("Points", { uf: selectedUF, city: selectedCity });
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ImageBackground
                source={require("../../assets/home-background.png")}
                imageStyle={{
                    width: 274,
                    height: 368,
                }}
                style={styles.container}
            >
                <View style={styles.main}>
                    <Image source={require("../../assets/logo.png")} />
                    <View>
                        <Text style={styles.title}>
                            Seu marketplace de coleta de resíduos
                        </Text>
                        <Text style={styles.description}>
                            Ajudamos pessoas a encontrarem pontos de coleta de
                            forma eficiente.
                        </Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <RNPickerSelect
                        onValueChange={(value) => setSelectedUF(value)}
                        items={ufs}
                        useNativeAndroidPickerStyle={false}
                        style={{
                            inputAndroid: styles.input,
                            inputIOS: styles.input,
                        }}
                        placeholder={{
                            label: "Digite a UF",
                            value: null,
                        }}
                    />

                    <RNPickerSelect
                        onValueChange={(value) => setSelectedCity(value)}
                        items={citys}
                        useNativeAndroidPickerStyle={false}
                        style={{
                            inputAndroid: styles.input,
                            inputIOS: styles.input,
                        }}
                        placeholder={{
                            label: "Digite a cidade",
                            value: null,
                        }}
                    />

                    <RectButton
                        style={styles.button}
                        onPress={handleNavigateToPoints}
                    >
                        <View style={styles.buttonIcon}>
                            <Text>
                                <Icon
                                    name="arrow-right"
                                    color="#FFF"
                                    size={24}
                                />
                            </Text>
                        </View>
                        <Text style={styles.buttonText}>Entrar</Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
    },

    main: {
        flex: 1,
        justifyContent: "center",
    },

    title: {
        color: "#322153",
        fontSize: 32,
        fontFamily: "Ubuntu_700Bold",
        maxWidth: 260,
        marginTop: 64,
    },

    description: {
        color: "#6C6C80",
        fontSize: 16,
        marginTop: 16,
        fontFamily: "Roboto_400Regular",
        maxWidth: 260,
        lineHeight: 24,
    },

    footer: {},

    input: {
        height: 60,
        backgroundColor: "#FFF",
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },

    button: {
        backgroundColor: "#34CB79",
        height: 60,
        flexDirection: "row",
        borderRadius: 10,
        overflow: "hidden",
        alignItems: "center",
        marginTop: 8,
    },

    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
    },

    buttonText: {
        flex: 1,
        justifyContent: "center",
        textAlign: "center",
        color: "#FFF",
        fontFamily: "Roboto_500Medium",
        fontSize: 16,
    },
});
