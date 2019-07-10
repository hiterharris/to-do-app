import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    TextInput,
    Dimensions,
    Platform,
    ScrollView,
    AsyncStorage,
    Button,
} from 'react-native';
import Todo from './src/screens/ToDo';
import { AppLoading } from 'expo';
import uuidv1 from 'uuid/v1';
import { LinearGradient } from 'expo';
import { primaryGradientArray } from './src/assets/Colors';
import { gradientStart, gradientEnd } from './src/assets/Colors';

const { height, width } = Dimensions.get("window");

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newToDo: "",
            loadedToDos: false,
            toDos: {},
        }
    }

    componentDidMount = () => {
        this._loadToDos()
    }

    render() {
        const { newToDo, loadedToDos, toDos } = this.state;
        if (!loadedToDos) {
            return <AppLoading />
        }
        return (
            <LinearGradient colors={primaryGradientArray} style={styles.container}>
                <StatusBar barStyle="light-content" />
                <Text style={styles.title}>To Do</Text>
                <View style={styles.card}>
                    <View style={styles.inputContainer}>
                        <Image style={styles.addNew} source={require('./src/assets/images/add-button-grey.png')} />
                        <TextInput style={styles.input} placeholder={"New Note"}
                            value={newToDo} onChangeText={this._controlNewTodo}
                            placeholderTextColor={"#999"} returnKeyType={"done"} autoCorrect={false}
                            onSubmitEditing={this._addToDo}
                            autoFocus={true} />
                    </View>
                    <ScrollView contentContainerStyle={styles.toDos}>
                        {Object.values(toDos).reverse().map(toDo => (
                            <Todo key={toDo.id}
                                deleteToDo={this._deleteToDo}
                                unCompleteToDo={this._unCompleteToDo}
                                completeToDo={this._completeToDo}
                                updateToDo={this._updateToDo}
                                underlineColorAndroid={"transparent"}
                                {...toDo}
                            />))}
                    </ScrollView>
                </View>
            </LinearGradient>
        );
    }

    _controlNewTodo = text => {
        this.setState({
            newToDo: text
        })
    }

    _loadToDos = async () => {
        try {
            const toDos = await AsyncStorage.getItem("toDos")
            const parsedToDos = JSON.parse(toDos)
            this.setState({
                loadedToDos: true,
                toDos: parsedToDos || {}
            })
        } catch (err) {
            console.log(err)
        }
    }

    _addToDo = () => {
        const { newToDo } = this.state

        if (newToDo !== "") {
            this.setState(prevState => {
                const ID = uuidv1()
                const newToDoObject = {
                    [ID]: {
                        id: ID,
                        isCompleted: false,
                        text: newToDo,
                        createdAt: Date.now()
                    }
                }

                const newState = {
                    ...prevState,
                    newToDo: '',
                    toDos: {
                        ...prevState.toDos,
                        ...newToDoObject
                    }
                }
                this._saveToDos(newState.toDos)
                return { ...newState }
            }
            )
        }
    }

    _deleteToDo = (id) => {
        this.setState(prevState => {
            const toDos = prevState.toDos
            delete toDos[id]
            const newState = {
                ...prevState,
                ...toDos
            }
            this._saveToDos(newState.toDos)
            return { ...newState }
        })
    }

    _unCompleteToDo = (id) => {
        this.setState(prevState => {
            const newState = {
                ...prevState,
                toDos: {
                    ...prevState.toDos,
                    [id]: {
                        ...prevState.toDos[id],
                        isCompleted: false
                    }
                }
            }
            this._saveToDos(newState.toDos)
            return { ...newState }
        })
    }

    _completeToDo = (id) => {
        this.setState(prevState => {
            const newState = {
                ...prevState,
                toDos: {
                    ...prevState.toDos,
                    [id]: {
                        ...prevState.toDos[id],
                        isCompleted: true
                    }
                }
            }
            this._saveToDos(newState.toDos)
            return { ...newState }
        })
    }

    _updateToDo = (id, text) => {
        this.setState(prevState => {
            const newState = {
                ...prevState,
                toDos: {
                    ...prevState.toDos,
                    [id]: {
                        ...prevState.toDos[id],
                        text: text
                    }
                }
            }
            this._saveToDos(newState.toDos)
            return { ...newState }
        })
    }

    _saveToDos = (newToDos) => {
        const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newToDos))

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        color: "white",
        fontSize: 42,
        marginTop: 50,
        fontWeight: "300",
        marginBottom: 10,
    },
    card: {
        backgroundColor: "white",
        flex: 1,
        width: width - 25,
        marginBottom: 75,
        borderRadius: 10,
        ...Platform.select({
            ios: {
                shadowColor: "rgb(50, 50, 50)",
                shadowOpacity: 0.5,
                shadowRadius: 5,
                shadowOffset: {
                    height: -1,
                    width: 0
                }
            },
            android: {
                elevation: 3
            }
        })
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        margin: 20,
    },
    addNew: {
        width: 40,
        height: 40,
    },
    input: {
        fontSize: 25,
        paddingTop: 5,
        paddingLeft: 10,
    },
    toDos: {
        height: 500,
        borderTopColor: 'lightgrey',
        borderTopWidth: 1,
    },
});
