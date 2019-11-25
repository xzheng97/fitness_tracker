import React from 'react';
import { View, TextInput, Alert, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card } from 'react-native-paper';
import Button from './Button'
import base64 from 'base-64';

class Food extends React.Component {
    constructor(props) {
        super(props);
        this.editList = {};
        this.addFood = {};
        this.foodName = React.createRef();
        this.foodProtein = React.createRef();
        this.foodCal = React.createRef();
        this.foodCarbo = React.createRef();
        this.foodFat = React.createRef();
        this.state = {
            userFood: [],
            editFood: {},
        }
    }

    componentDidMount() {
        let tempHeader = new Headers();
        tempHeader.append('Authorization', 'Basic ' + base64.encode(this.props.userName + ":" + this.props.password));
        tempHeader.append('x-access-token', "");
        tempHeader.append('Content-Type', 'application/json');
        fetch('https://mysqlcs639.cs.wisc.edu/login', {
            method: 'GET',
            headers: tempHeader,
            redirect: "follow"
        })
            .then(response => response.json())
            .then(result => {
                let newHeader = new Headers();
                newHeader.append('x-access-token', result.token);
                newHeader.append('Content-Type', 'application/json');
                fetch('https://mysqlcs639.cs.wisc.edu/meals/' + this.props.mealId + '/foods', {
                    method: 'GET',
                    headers: newHeader,
                    redirect: "follow"
                })
                    .then(newresponse => newresponse.json())
                    .then(newresult => {
                        if (newresult.message) {
                            Alert.alert(newresult.message)
                        }
                        else {
                            this.setState({ userFood: newresult.foods }, () => this.calculateAggr());
                        }
                    })
            })
            .catch((error) => {
                console.error(error);
                return;
            });
    }

    render() {
        return (
            <View style={{ marginTop: 10 }}>
                <Text style={[styles.storyHeading, { alignSelf: "center" }]}>New food for this meal?</Text>
                <View style={{ marginTop: 10, marginBottom: 10 }}>
                    <Card>
                        <View style={{ padding: 20 }}>
                            <TextInput ref={this.foodName} placeholder='enter food name' style={[styles.storyHeading, { fontSize: 14, marginTop: 5 }]}
                                onChangeText={(text) => this.addFood.name = text} />
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <TextInput ref={this.foodCal} placeholder='enter calories' style={{ width: 150 }} onChangeText={(text) => this.addFood.calories = parseFloat(text)} />
                                <TextInput ref={this.foodProtein} placeholder='enter protein' style={{ marginLeft: 50 }} onChangeText={(text) => this.addFood.protein = parseFloat(text)} />
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <TextInput ref={this.foodCarbo} placeholder='enter carbohydrates' style={{ width: 150 }} onChangeText={(text) => this.addFood.carbohydrates = parseFloat(text)} />
                                <TextInput ref={this.foodFat} placeholder='enter fat' style={{ marginLeft: 50 }} onChangeText={(text) => this.addFood.fat = parseFloat(text)} />
                            </View>
                        </View>
                    </Card>
                    <Ionicons name={Platform.OS === "ios" ? "ios-add-circle" : "md-add-circle"} style={{ alignSelf: 'center', top: -20 }}
                        position='absolute' size={40} color='tomato' onPress={() => this.handleAddFood()} />
                    <Text style={[styles.storyHeading, { alignSelf: "center", marginBottom: 20 }]}>Foods Entered</Text>
                    {this.renderFood()}
                </View>
            </View>
        );
    }


    // do the render for each meal
    renderFood() {
        let listFood = [];
        this.state.userFood.forEach(food => {
            if (!this.state.editFood[food.id]) {
                listFood.push(
                    <Card style={{ backgroundColor: "rgb(129,150,143)", marginBottom: 20 }} key={food.id}>
                        <Button buttonStyle={{
                            alignItems: 'center', justifyContent: 'center',
                            width: 70, height: 70, position: 'absolute', zIndex: 1, top: -15, right: -10
                        }}
                            textStyle={{ fontSize: 25, color: 'white' }} text={'x'}
                            onPress={() => this.handleDeleteFood(food.id)} />
                        <View style={{ padding: 20 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ width: 150, color: 'white' }}>Name: {food.name}</Text>
                                <Text style={{ marginLeft: 50, textAlign: 'center', color: 'white' }}>Id: {food.id}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Text style={{ width: 150, color: 'white' }}>Cal: {food.calories}</Text>
                                <Text style={{ marginLeft: 50, textAlign: 'center', color: 'white' }}>Protein: {food.protein}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Text style={{ width: 150, color: 'white' }}>Carbohydrates: {food.carbohydrates}</Text>
                                <Text style={{ marginLeft: 50, textAlign: 'center', color: 'white' }}>Fat: {food.fat}</Text>
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Button textStyle={{ color: 'tomato', alignSelf: 'center', textDecorationLine: 'underline' }}
                                    text={'edit food'} onPress={() => this.handleEdit(food.id)} />
                            </View>
                        </View>

                    </Card>
                )
            }
            else {
                listFood.push(
                    <Card style={{ backgroundColor: "rgb(129,150,143)", marginBottom: 20 }} key={food.id}>
                        <Button buttonStyle={{
                            alignItems: 'center', justifyContent: 'center',
                            width: 70, height: 70, position: 'absolute', zIndex: 1, top: -15, right: -10
                        }}
                            textStyle={{ fontSize: 25, color: 'white' }} text={'x'}
                            onPress={() => this.handleDeleteFood(food.id)} />
                        <View style={{ padding: 20 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <TextInput placeholder={"Name: " + food.name}
                                    style={{ width: 150, color: 'white' }}
                                    onChangeText={(text) => this.editList[food.id].name = text} />
                                <Text style={{ marginLeft: 50, textAlign: 'center', color: 'white' }}>Id: {food.id}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <TextInput placeholder={"Cal: " + food.calories}
                                    style={{ width: 150, color: 'white' }}
                                    onChangeText={(text) => this.editList[food.id].calories = text} />
                                <TextInput placeholder={"Protein: " + food.protein}
                                    style={{ marginLeft: 50, color: 'white' }}
                                    onChangeText={(text) => this.editList[food.id].protein = text} />
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <TextInput placeholder={"Carbohydrates: " + food.carbohydrates}
                                    style={{ width: 150, color: 'white' }}
                                    onChangeText={(text) => this.editList[food.id].carbohydrates = text} />
                                <TextInput placeholder={"Fat: " + food.fat}
                                    style={{ marginLeft: 50, color: 'white' }}
                                    onChangeText={(text) => this.editList[food.id].fat = text} />
                            </View>


                            <View style={{ marginTop: 10 }}>
                                <Button textStyle={{ color: 'tomato', alignSelf: 'center', textDecorationLine: 'underline' }}
                                    text={'save'} onPress={() => this.handleSave(food.id)} />
                            </View>
                        </View>

                    </Card>
                )
            }
        });
        return (listFood);
    }



    handleAddFood() {
        let tempHeader = new Headers();
        tempHeader.append('Authorization', 'Basic ' + base64.encode(this.props.userName + ":" + this.props.password));
        tempHeader.append('x-access-token', "");
        tempHeader.append('Content-Type', 'application/json');
        fetch('https://mysqlcs639.cs.wisc.edu/login', {
            method: 'GET',
            headers: tempHeader,
            redirect: "follow"
        })
            .then(response => response.json())
            .then(result => {
                let newHeader = new Headers();
                newHeader.append('x-access-token', result.token);
                newHeader.append('Content-Type', 'application/json');
                fetch('https://mysqlcs639.cs.wisc.edu/meals/' + this.props.mealId + '/foods/', {
                    method: 'POST',
                    headers: newHeader,
                    body: JSON.stringify(this.addFood),
                    redirect: "follow"
                })
                    .then(newresponse => newresponse.json())
                    .then(newresult => {
                        if (newresult.message) {
                            this.refresh();
                            this.addFood = {};
                            Alert.alert(newresult.message);
                        }
                    })
            })
            .catch((error) => {
                console.error(error);
                return;
            });

        this.foodName.current.clear();
        this.foodProtein.current.clear();
        this.foodCal.current.clear();
        this.foodFat.current.clear();
        this.foodCarbo.current.clear();
    }

    handleEdit(id) {
        let new_editFood = JSON.parse(JSON.stringify(this.state.editFood));
        new_editFood[id] = true;
        this.setState({ editFood: new_editFood });
        this.editList[id] = {};
    }

    handleSave(id) {
        let obj = this.editList[id];
        if (Object.keys(obj).length !== 0) {
            let tempHeader = new Headers();
            tempHeader.append('Authorization', 'Basic ' + base64.encode(this.props.userName + ":" + this.props.password));
            tempHeader.append('x-access-token', "");
            tempHeader.append('Content-Type', 'application/json');
            fetch('https://mysqlcs639.cs.wisc.edu/login', {
                method: 'GET',
                headers: tempHeader,
                redirect: "follow"
            })
                .then(response => response.json())
                .then(result => {
                    let newHeader = new Headers();
                    newHeader.append('x-access-token', result.token);
                    newHeader.append('Content-Type', 'application/json');
                    fetch('https://mysqlcs639.cs.wisc.edu/meals/' + this.props.mealId + '/foods/' + id, {
                        method: 'PUT',
                        headers: newHeader,
                        body: JSON.stringify(obj),
                        redirect: "follow"
                    })
                        .then(newresponse => newresponse.json())
                        .then(newresult => {
                            this.refresh();
                            Alert.alert(newresult.message)
                        })
                })
                .catch((error) => {
                    console.error(error);
                    return;
                });
        }
        let new_editFood = JSON.parse(JSON.stringify(this.state.editFood));
        new_editFood[id] = false;
        this.setState({ editFood: new_editFood });
    }

    handleDeleteFood(id) {
        let tempHeader = new Headers();
        tempHeader.append('Authorization', 'Basic ' + base64.encode(this.props.userName + ":" + this.props.password));
        tempHeader.append('x-access-token', "");
        tempHeader.append('Content-Type', 'application/json');
        fetch('https://mysqlcs639.cs.wisc.edu/login', {
            method: 'GET',
            headers: tempHeader,
            redirect: "follow"
        })
            .then(response => response.json())
            .then(result => {
                let newHeader = new Headers();
                newHeader.append('x-access-token', result.token);
                newHeader.append('Content-Type', 'application/json');
                fetch('https://mysqlcs639.cs.wisc.edu/meals/' + this.props.mealId + '/foods/' + id, {
                    method: 'DELETE',
                    headers: newHeader,
                    redirect: "follow"
                })
                    .then(newresponse => newresponse.json())
                    .then(newresult => {
                        if (newresult.message) {
                            this.refresh();
                            let new_editFood = JSON.parse(JSON.stringify(this.state.editFood));
                            new_editFood[id] = false;
                            this.setState({ editFood: new_editFood });
                            Alert.alert(newresult.message)
                        }
                    })
            })
            .catch((error) => {
                console.error(error);
                return;
            });
    }


    // refetch data
    refresh() {
        let tempHeader = new Headers();
        tempHeader.append('Authorization', 'Basic ' + base64.encode(this.props.userName + ":" + this.props.password));
        tempHeader.append('x-access-token', "");
        tempHeader.append('Content-Type', 'application/json');
        fetch('https://mysqlcs639.cs.wisc.edu/login', {
            method: 'GET',
            headers: tempHeader,
            redirect: "follow"
        })
            .then(response => response.json())
            .then(result => {
                let newHeader = new Headers();
                newHeader.append('x-access-token', result.token);
                newHeader.append('Content-Type', 'application/json');
                fetch('https://mysqlcs639.cs.wisc.edu/meals/' + this.props.mealId + '/foods', {
                    method: 'GET',
                    headers: newHeader,
                    redirect: "follow"
                })
                    .then(newresponse => newresponse.json())
                    .then(newresult => {
                        if (newresult.message) {
                            Alert.alert(newresult.message)
                        }
                        else {
                            this.setState({ userFood: newresult.foods }, () => this.calculateAggr());
                        }
                    })
            })
            .catch((error) => {
                console.error(error);
                return;
            });
    }

    calculateAggr() {
        let aggrCal = 0;
        let aggrProtein = 0;
        let aggrCarbo = 0;
        let aggrFat = 0;
        this.state.userFood.forEach(food => {
            aggrCal += parseFloat(food.calories);
            aggrProtein += parseFloat(food.protein);
            aggrCarbo += parseFloat(food.carbohydrates);
            aggrFat += parseFloat(food.fat);
        });
        let mealAggr = {
            aggrCal: aggrCal,
            aggrProtein: aggrProtein,
            aggrCarbo: aggrCarbo,
            aggrFat: aggrFat,
        };
        this.props.callbackfromFood(this.props.mealId, mealAggr);

    }


}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
    paragraph: {
        paddingBottom: 10,
    },
    story: {
        margin: 10,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        width: '100%',
        padding: 10,
    },
    sectionHeading: {
        margin: 8,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    storyHeading: {
        marginTop: 5,
        marginBottom: 5,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    button: {
        display: 'flex',
        flexDirection: 'column',
    },
});



export default Food;