import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    TextInput,
    Image,
} from 'react-native'
import PropTypes from 'proptypes'

const { width, height } = Dimensions.get("window")

export default class ToDo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isEditing: false,
            toDoValue: props.text
        };
    }

    static propTypes = {
        text: PropTypes.string.isRequired,
        isCompleted: PropTypes.bool.isRequired,
        deleteToDo: PropTypes.func.isRequired,
        id: PropTypes.string.isRequired,
        unCompleteToDo: PropTypes.func.isRequired,
        completeToDo: PropTypes.func.isRequired,
        updateToDo: PropTypes.func.isRequired
    }

    status = () => {
        if (this.props.isCompleted) {
            return <Image style={styles.complete} source={require('../assets/images/complete-icon.png')} />;
        } else {
            return <Image style={styles.incomplete} source={require('../assets/images/incomplete-icon.png')} />;
        }
    }

    render() {
        const { isEditing, toDoValue } = this.state
        const { text, id, deleteToDo, isCompleted } = this.props
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this._toggleComplete}>
                    <View style={styles.column}>
                        <View>
                            {this.status()}
                        </View>
                        {isEditing ? (<TextInput
                            style={[styles.text, styles.input, isCompleted ? styles.completedText : styles.unCompletedText]}
                            value={toDoValue} multiline={true} onChangeText={this._controlInput} returnKeyType={"done"}
                            onBlur={this._finishEditing}
                            underlineColorAndroid={"transparent"} />) :
                            (<Text style={[styles.text, isCompleted ?
                                styles.completedText :
                                styles.unCompletedText]}>{text}
                            </Text>)}
                    </View>
                </TouchableOpacity>
                {isEditing ? (
                    <View style={styles.actions}>
                        <TouchableOpacity onPressOut={this._finishEditing}>
                            <View style={styles.actionContainer}>
                                <Text style={styles.actionText}>✅</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : (
                        <View style={styles.actions}>
                            <TouchableOpacity onPressOut={this._startEditing}>
                                <View style={styles.actionContainer}>
                                    <Text style={styles.actionText}>✏️</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPressOut={(event) => {
                                event.stopPropagation
                                deleteToDo(id)
                            }}>
                                <View style={styles.actionContainer}>
                                    <Text style={styles.actionText}>❌</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    )
                }
            </View>
        )
    }

    _toggleComplete = (event) => {
        event.stopPropagation()
        const { isCompleted, unCompleteToDo, completeToDo, id } = this.props
        isCompleted ? unCompleteToDo(id) : completeToDo(id)
    }

    _startEditing = (event) => {
        event.stopPropagation()
        this.setState({
            isEditing: true
        })
    }

    _finishEditing = (event) => {
        event.stopPropagation()
        const { toDoValue } = this.state
        const { id, updateToDo } = this.props
        updateToDo(id, toDoValue)
        this.setState({
            isEditing: false
        })
    }

    _controlInput = (text) => {
        this.setState({
            toDoValue: text
        })
    }
}

const styles = StyleSheet.create({
    container: {
        width: width - 50,
        borderBottomColor: "#bbb",
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    status: {
        width: 50,
        height: 50,
    },
    complete: {
        width: 30,
        height: 30,
        margin: 5,
    },
    incomplete: {
        width: 30,
        height: 30,
        opacity: .90,
        margin: 5,
    },
    text: {
        fontWeight: "600",
        fontSize: 20,
        marginVertical: 20
    },
    completedText: {
        color: "#bbb",
        textDecorationLine: "line-through"
    },
    unCompletedText: {
        color: "#353839"
    },
    column: {
        flexDirection: "row",
        alignItems: "center",
        width: width / 2
    },
    actions: {
        flexDirection: "row"
    },
    actionContainer: {
        marginVertical: 10,
        marginHorizontal: 10
    },
    input: {
        marginVertical: 15,
        width: width / 2,
        paddingBottom: 5
    }
});