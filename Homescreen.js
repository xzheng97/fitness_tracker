import React from 'react';
import {NavigationEvents } from 'react-navigation';
import { View,TextInput, Alert, Text, StyleSheet, ScrollView, Platform} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card } from 'react-native-paper';
import Button from './Button'
import base64 from 'base-64';
import DatePicker from 'react-native-datepicker';
import Activity from './Activity';
import Meal from './Meal';
import moment from 'moment';


class HomeScreen extends React.Component {
    constructor(props) {
      super(props);
      this._isMounted = false;
      this.actName = React.createRef();
      this.actDur = React.createRef();
      this.actCal = React.createRef();
      this.mealName = React.createRef();
      this.addActivity = {
        date: new Date()
      };
      this.addMeal = {
          date: new Date()
      }
      this.today = new Date();
      this.state = {
        backColor:'tomato',
        forwardColor:'grey',
        showDay:new Date(),
        dailyAggr: {},
        showActivity: false,
        showMeal: false,
        userActivity: [],
        userMeal: [],
        activityGoal: 0,
        calGoal: 0,
        carbonGoal: 0,
        fatGoal: 0,
        proteinGoal: 0,
      }
    }
    componentDidMount() {
      this._isMounted = true;
    }
    
    componentWillUnmount() {
      this._isMounted = false;
    }
  
    static navigationOptions = {
      title: 'Current Day',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons name={Platform.OS === "ios"?"ios-today":"md-today" } size={30} color={tintColor} style={{bottom:-10}}/>
      )
      
    };

    backOneDay(){
        if (this.today.getDate() - this.state.showDay.getDate() < 6 )
            this.setState({showDay:new Date(this.state.showDay.setDate(this.state.showDay.getDate()-1)),
                            forwardColor:'tomato'});
        else if (this.today.getDate() - this.state.showDay.getDate() === 6)
            this.setState({showDay:new Date(this.state.showDay.setDate(this.state.showDay.getDate()-1)),
                            backColor:'grey'});
        else
            this.setState({backColor:'grey'});
        
        this.refetchStates();
    }
    forwardOneDay() {
        if (this.today.getDate() - this.state.showDay.getDate() > 1)
            this.setState({showDay:new Date(this.state.showDay.setDate(this.state.showDay.getDate()+1)),
                            backColor:'tomato'});
        else if (this.today.getDate() - this.state.showDay.getDate() === 1)
            this.setState({showDay:new Date(this.state.showDay.setDate(this.state.showDay.getDate()+1)),
                            forwardColor:'grey'});
        else
            this.setState({forwardColor:'grey'});
        
        this.refetchStates();
    }

    isCurrentDay() {
        return this.state.showDay.getDate() === this.today.getDate();
    }

    render() {
      if(!this.state.showActivity && !this.state.showMeal){
        return (
            <ScrollView style={[styles.container,{flex: 1}]} contentContainerStyle={{flexGrow: 1, justifyContent: 'flex', alignItems: 'center' }}>
            
            <NavigationEvents onDidFocus={()=>this.refetchStates()}/>
            <View style={{flexDirection:'row'}}>
            <Ionicons name={Platform.OS === "ios"?"ios-arrow-dropleft":"md-arrow-dropleft" }
             size={30} color={this.state.backColor} style={{margin: 8,marginRight:40, textAlign:'center'}}
             onPress={()=>this.backOneDay()}/>

        <Text style={[styles.sectionHeading, { color: 'tomato' }]}>
            {this.state.showDay.getDate() === this.today.getDate()?"Current Day":moment(this.state.showDay).format("MMM Do YY")}
            </Text>

            <Ionicons name={Platform.OS === "ios"?"ios-arrow-dropright":"md-arrow-dropright" } 
             size={30} color={this.state.forwardColor} style={{margin: 8,marginLeft:40, textAlign:'center'}}
             onPress={()=>this.forwardOneDay()}/>
            </View>

            <Card style={[styles.story,this.isCurrentDay()?{display:''}:{display:'none'}]}>
                <Text style={[styles.storyHeading,{alignSelf:"center"}]}>New activity for today?</Text>
                <View style={{ marginTop:10, marginBottom:10}}>
                    <Card>
                    <View style={{padding:20}}>
                        <TextInput ref={this.actName} placeholder='enter meal name' style={[styles.storyHeading,{fontSize:14, marginTop:5}]}
                            onChangeText = {(text)=>this.addMeal.name=text}/>
                        <View style={{flexDirection:'row', marginTop:10}}>
                            <DatePicker
                                style={{width: 140, height:30}}
                                date={this.state.actdate}
                                mode="datetime"
                                placeholder="select time"
                                format="DD MMMM YYYY h:mm a"
                                minDate= {this.today.getFullYear()-1 + '-' + parseInt(this.today.getMonth()+1) + '-' + this.today.getDate()}
                                maxDate= {this.today}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 150,
                                    top: 4,
                                    marginLeft: 0
                                },
                                }}
                                onDateChange={(date) => {
                                let newDate = new Date(date);
                                this.addMeal.date=newDate;
                                this.setState({actdate: date});
                                }}/>
                            <View style={{marginLeft:60}}>
                                <Button buttonStyle={{backgroundColor: 'tomato', alignSelf:'center', padding:10, borderRadius: 10}} 
                                    textStyle={{color: '#ffffff', alignSelf:'center'}} 
                                    text={'use current time'} onPress={() => {
                                        let tempday = new Date();
                                        this.setState({actdate: tempday});
                                        this.addActivity.date = tempday;
                                    }} />
                            </View>
                        </View>
                        <View style={{flexDirection:'row', marginTop: 30}}>
                            <TextInput ref={this.actDur} placeholder='enter duration' style={{width:150}} onChangeText = {(text)=>this.addActivity.duration=parseFloat(text)}/>
                            <TextInput ref={this.actCal} placeholder='enter calories' style={{marginLeft:50}} onChangeText = {(text)=>this.addActivity.calories=parseFloat(text)}/>
                        </View>
                    </View>
                    </Card>
                <Ionicons name={Platform.OS === "ios"?"ios-add-circle":"md-add-circle" } style={{alignSelf:'center', top: -20}}
                position='absolute' size={40} color='rgb(129,150,143)' onPress={() => this.handleAdd('activities')}/>
                </View>

                <Text style={[styles.storyHeading,{alignSelf:"center"}]}>New Meal for today?</Text>
                <View style={{ marginTop:10, marginBottom:10}}>
                    <Card>
                    <View style={{padding:20}}>
                        <TextInput ref={this.mealName} placeholder='enter activity name' style={[styles.storyHeading,{fontSize:14, marginTop:5}]}
                            onChangeText = {(text)=>this.addMeal.name=text}/>
                        <View style={{flexDirection:'row', marginTop:10}}>
                            <DatePicker
                                style={{width: 140, height:30}}
                                date={this.state.mealdate}
                                mode="datetime"
                                placeholder="select time"
                                format="DD MMMM YYYY h:mm a"
                                minDate= {this.today.getFullYear()-1 + '-' + parseInt(this.today.getMonth()+1) + '-' + this.today.getDate()}
                                maxDate= {this.today}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 150,
                                    top: 4,
                                    marginLeft: 0
                                },
                                }}
                                onDateChange={(date) => {
                                let newDate = new Date(date);
                                this.addActivity.date=newDate;
                                this.setState({mealdate: date});
                                }}/>
                            <View style={{marginLeft:60}}>
                                <Button buttonStyle={{backgroundColor: 'tomato', alignSelf:'center', padding:10, borderRadius: 10}} 
                                    textStyle={{color: '#ffffff', alignSelf:'center'}} 
                                    text={'use current time'} onPress={() => {
                                        let tempday = new Date();
                                        this.setState({mealdate: tempday});
                                        this.addActivity.date = tempday;
                                    }} />
                            </View>
                        </View>
                    </View>
                    </Card>
                <Ionicons name={Platform.OS === "ios"?"ios-add-circle":"md-add-circle" } style={{alignSelf:'center', top: -20}}
                position='absolute' size={40} color='rgb(129,150,143)' onPress={() => this.handleAdd('meals')}/>
                </View>
            </Card>
            <Card style={styles.story}>
                <Text style={[styles.storyHeading,{alignSelf:"center"}]}>Activity Summary</Text>
                <View style={{ marginTop:10, marginBottom:10}}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{width:270}}>You have done activities for:</Text>
                        <Text>{this.calcActivity()} minutes</Text>
                    </View>
                    <View style={{flexDirection:'row', marginTop: 5}}>
                        <Text style={{width:270}}>Your Goal: </Text>
                        <Text>{this.state.activityGoal} minutes</Text>
                    </View>
                    {this.buttonHelper("showActivity")}
                </View>
            </Card>

            <Card style={styles.story}>
                <Text style={[styles.storyHeading,{alignSelf:"center"}]}>Nutrition Summary</Text>
                <View style={{ marginTop:10, marginBottom:10}}>
                    <Text style={[styles.storyHeading,{fontSize:14, marginTop:0}]}>Calories</Text>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{width:270}}>You have consumed:</Text>
                        <Text>{this.state.dailyAggr.calories} cals</Text>
                    </View>
                    <View style={{flexDirection:'row', marginTop: 5}}>
                        <Text style={{width:270}}>Your Goal: </Text>
                        <Text>{this.state.calGoal} cals</Text>
                    </View>
                    <Text style={[styles.storyHeading,{fontSize:14, marginTop:5}]}>Carbohydrates</Text>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{width:270}}>You have consumed:</Text>
                        <Text>{this.state.dailyAggr.carbohydrates} grams</Text>
                    </View>
                    <View style={{flexDirection:'row', marginTop: 5}}>
                        <Text style={{width:270}}>Your Goal: </Text>
                        <Text>{this.state.carbonGoal} grams</Text>
                    </View>
                    <Text style={[styles.storyHeading,{fontSize:14, marginTop:5}]}>Fat</Text>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{width:270}}>You have consumed:</Text>
                        <Text>{this.state.dailyAggr.fat} grams</Text>
                    </View>
                    <View style={{flexDirection:'row', marginTop: 5}}>
                        <Text style={{width:270}}>Your Goal: </Text>
                        <Text>{this.state.fatGoal} grams</Text>
                    </View>
                    <Text style={[styles.storyHeading,{fontSize:14, marginTop:5}]}>Protein</Text>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{width:270}}>You have consumed:</Text>
                        <Text>{this.state.dailyAggr.protein} grams</Text>
                    </View>
                    <View style={{flexDirection:'row', marginTop: 5}}>
                        <Text style={{width:270}}>Your Goal: </Text>
                        <Text>{this.state.proteinGoal} grams</Text>
                    </View>
                    {this.buttonHelper("showMeal")}
                </View>
            </Card>
    

            </ScrollView>
        );
      }
      else if(this.state.showActivity){
        return(
            <Activity
            userName = {this.props.screenProps.userName}
            password = {this.props.screenProps.password}
            userActivity = {this.state.userActivity}
            hide = {()=>this.hideActivity()}
            today = {this.today}
            refresh = {()=>this.refetchStates()}
            />
        );
      }
      else if (this.state.showMeal){
        return(
            <Meal
            userName = {this.props.screenProps.userName}
            password = {this.props.screenProps.password}
            userMeal = {this.state.userMeal}
            hide = {()=>this.hideMeal()}
            today = {this.today}
            refresh = {()=>this.refetchStates()}
            />
        );
      }
    }

    buttonHelper(param){
        if(this.isCurrentDay()){
        return(
            <Button buttonStyle={{backgroundColor:"tomato", borderRadius:10,height:25, marginTop:10}} 
                        textStyle={{color:'white',textAlign:'center',fontSize:16,top:2}} text={'view specifics'} 
                        onPress={() => this.setState({[param]:true})}/>
        )
        }
    }

  
    // add button clicked
    handleAdd(type) {
      let tempBody, tempURL;
      if (type === 'activities') {
          tempBody = JSON.stringify(this.addActivity);
          tempURL = 'https://mysqlcs639.cs.wisc.edu/activities/';
        }
      else if (type === 'meals') {
          tempBody = JSON.stringify(this.addMeal);
          tempURL = 'https://mysqlcs639.cs.wisc.edu/meals/';
      }
      let tempHeader = new Headers();
      tempHeader.append('Authorization', 'Basic ' + base64.encode(this.props.screenProps.userName+ ":" + this.props.screenProps.password));
      tempHeader.append('x-access-token', "");
      tempHeader.append('Content-Type', 'application/json');
      fetch('https://mysqlcs639.cs.wisc.edu/login', {
        method: 'GET',
        headers: tempHeader,
        redirect:"follow"
        })
        .then(response => response.json())
        .then(result =>{
          let newHeader = new Headers();
          newHeader.append('x-access-token', result.token);
          newHeader.append('Content-Type', 'application/json');
          fetch(tempURL, {
            method: 'POST',
            headers: newHeader,
            body: tempBody,
            redirect:"follow"
            })
            .then(newresponse => newresponse.json())
            .then(newresult =>{
              if(newresult.message) {
                this.refetchStates();
                Alert.alert(newresult.message)
                if(type === 'activities') 
                    this.addActivity = {};
                else if (type === 'meals')
                    this.addMeal = {};
              }
            })
        })
        .catch((error) => {
            console.error(error);
            return;
        });
        if(type === 'activities'){
            this.actName.current.clear();
            this.actCal.current.clear();
            this.actDur.current.clear();
            this.setState({actdate: null});
        }
        else if (type === 'meals') {
            this.mealName.current.clear();
            this.setState({mealdate: null});
        }
    }
  
    extractDate(objs) {
      let newObj = [];
      objs.forEach(obj => {
        let tempday = new Date(obj.date);
        if(tempday.getFullYear() === this.state.showDay.getFullYear() &&
          parseInt(tempday.getMonth()+1) === parseInt(this.state.showDay.getMonth()+1) &&
          tempday.getDate() === this.state.showDay.getDate()) {
            newObj.push(JSON.parse(JSON.stringify(obj)));
          }
      });
      return newObj;
    }
  
    // refetch data and refresh page
    refetchStates() {
        console.log('refetch')
      let tempHeader = new Headers();
      tempHeader.append('Authorization', 'Basic ' + base64.encode(this.props.screenProps.userName + ":" + this.props.screenProps.password));
      tempHeader.append('x-access-token', "");
      tempHeader.append('Content-Type', 'application/json');
      fetch('https://mysqlcs639.cs.wisc.edu/login', {
        method: 'GET',
        headers: tempHeader,
        redirect:"follow"
        })
        .then(response => response.json())
        .then(result =>{
          let newHeader = new Headers();
          newHeader.append('x-access-token', result.token);
          newHeader.append('Content-Type', 'application/json');
          fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
            method: 'GET',
            headers: newHeader,
            redirect:"follow"
            })
            .then(newresponse => newresponse.json())
            .then(newresult =>{
              if(newresult.message) {
              }
              else {
                if(this._isMounted){
                  let todayActivities = this.extractDate(newresult.activities);
                  this.setState({userActivity : todayActivities});
                }
                  
              }
            });
            fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
            method: 'GET',
            headers: newHeader,
            redirect:"follow"
            })
            .then(newresponse => newresponse.json())
            .then(newresult =>{
              if(newresult.message) {
                Alert.alert(newresult.message)
              }
              else {
                if(this._isMounted){
                  let todayMeals = this.extractDate(newresult.meals);
                  this.setState({userMeal : todayMeals},()=>this.calcMeals(newHeader));
                }
              }
            });
            fetch('https://mysqlcs639.cs.wisc.edu/users/'+this.props.screenProps.userName, {
            method: 'GET',
            headers: newHeader,
            redirect:"follow"
            })
            .then(newresponse => newresponse.json())
            .then(newresult =>{
              if(newresult.message) {
              }
              else {
                if(this._isMounted)
                  this.setState({
                    activityGoal : newresult.goalDailyActivity,
                    calGoal: newresult.goalDailyCalories,
                    carbonGoal: newresult.goalDailyCarbohydrates,
                    fatGoal: newresult.goalDailyFat,
                    proteinGoal: newresult.goalDailyProtein,
                    });
              }
            });
        })
        .catch((error) => {
            console.error(error);
            return;
        });
    }
  
    // calculate acvitiy aggregation
    calcActivity() {
        let total_time = 0;
        this.state.userActivity.forEach(act => {
          total_time = total_time + act.duration
        });
        return total_time;
    }
    // calculate meals aggregation
    calcMeals(headers) {
        let new_dailyAggr = {
            calories:0,
            carbohydrates:0,
            fat:0,
            protein:0,
        };
        this.state.userMeal.forEach(element => {
            fetch('https://mysqlcs639.cs.wisc.edu/meals/' + element.id + '/foods/', {
            method: 'GET',
            headers: headers,
            redirect:"follow"
            })
            .then(newresponse => newresponse.json())
            .then(newresult =>{
              if(newresult.message) {
              }
              else {
                  newresult.foods.forEach(food => {
                    new_dailyAggr.calories += parseFloat(food.calories);
                    new_dailyAggr.carbohydrates += parseFloat(food.carbohydrates);
                    new_dailyAggr.fat += parseFloat(food.fat);
                    new_dailyAggr.protein += parseFloat(food.protein);
                  });
                  this.setState({dailyAggr: new_dailyAggr});
              }
            });
        });
        
    }

    hideActivity() {
        this.setState({showActivity:false});
    }
    hideMeal() {
        this.setState({showMeal:false});
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

  export default HomeScreen;