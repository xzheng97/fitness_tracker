import React from 'react';
import { View,TextInput, Alert, Text, StyleSheet, ScrollView, Platform} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card } from 'react-native-paper';
import Button from './Button'
import base64 from 'base-64';
import DatePicker from 'react-native-datepicker';
import Food from './Food'

class Meal extends React.Component {


    constructor(props) {
        super(props);
        this.editList = {};
        this.state={
            mealsAggr:{},
            times:{},
            editMeal:{},
        }
    }

    render() {
        return (
            <ScrollView style={[styles.container,{flex: 1}]} contentContainerStyle={{flexGrow: 1, justifyContent: 'flex', alignItems: 'center' }}>
              
              <View style={{flexDirection:'row'}}>
              <Ionicons name={Platform.OS === "ios"?"ios-arrow-back":"md-arrow-back" } style={{left:-40}}
                position='absolute' size={40} color='rgb(129,150,143)' onPress={() => {
                    this.props.hide();
                    this.props.refresh();}}/>
                 <Text style={[styles.sectionHeading, { color: 'tomato' }]}>
                Today's Meal Details
              </Text>
             
              </View>
            
              {this.renderMeal()}

            
            </ScrollView>
        );
    }


    // do the render for each meal
    renderMeal() {
        let listMeal = [];
        this.props.userMeal.forEach(meal => {
          if(!this.state.editMeal[meal.id]){
            listMeal.push(
              <Card style={styles.story} key={meal.id}>
                <Button buttonStyle={{alignItems: 'center', justifyContent: 'center', 
                        width: 70, height: 70, position: 'absolute',zIndex:1, top:-15, right: -10}} 
                        textStyle={{fontSize: 25, color:'rgb(129,150,143)'}} text={'x'} 
                        onPress={() => this.handleDeleteMeal(meal.id)}/>
                <View style={{padding:20}}>
                  <View style={{flexDirection:'row', height:30}}>
                    <Text style={[styles.storyHeading,{fontSize:14, width:150, color:'rgb(129,150,143)'}]}>Name: {meal.name}</Text>
                    <Text style={{margin: 8, marginLeft:80, textAlign:'center', color:'rgb(129,150,143)'}}>Id: {meal.id}</Text>
                  </View>
                  <View style={{flexDirection:'row', height:25, top: 5}}>
                    <Text style={{alignSelf:'center', color:'rgb(129,150,143)'}}>Time: {
                        new Date(meal.date).getFullYear() + "/"+ 
                        parseInt(new Date(meal.date).getMonth()+1) +"/"+ 
                        new Date(meal.date).getDate() + "  " + 
                        new Date(meal.date).getHours() + ":" + 
                        new Date(meal.date).getMinutes()}
                        </Text>
                  </View>
                  <View style={{flexDirection:'row', marginTop:10}}>
                    <Text style={{width:150, color:'rgb(129,150,143)'}}>Aggr Cal:  
                    {this.state.mealsAggr[meal.id]?this.state.mealsAggr[meal.id].aggrCal:0}</Text>
                    <Text style={{marginLeft:80,color:'rgb(129,150,143)'}}>Aggr Protein:  
                    {this.state.mealsAggr[meal.id]?this.state.mealsAggr[meal.id].aggrProtein:0}</Text>
                  </View>
                  <View style={{flexDirection:'row', marginTop:10}}>
                    <Text style={{width:150, color:'rgb(129,150,143)'}}>Aggr Carbohydrates:  
                    {this.state.mealsAggr[meal.id]?this.state.mealsAggr[meal.id].aggrCarbo:0}</Text>
                    <Text style={{marginLeft:80,color:'rgb(129,150,143)'}}>Aggr Fat: 
                    {this.state.mealsAggr[meal.id]?this.state.mealsAggr[meal.id].aggrFat:0}</Text>
                  </View>
                  <View style={{marginTop:10}}>
                    <Button textStyle={{color: 'tomato', alignSelf:'center', textDecorationLine:'underline'}} 
                        text={'edit meal'} onPress={() => this.handleEdit(meal.id)}/>
                  </View>
                  <Food 
                    mealId = {meal.id}
                    userName = {this.props.userName}
                    password = {this.props.password}
                    callbackfromFood = {this.foodCallback}
                  />
                </View>
                
              </Card>
            )
          }
          else {
            listMeal.push(
              <Card style={styles.story} key={meal.id}>
                <Button buttonStyle={{alignItems: 'center', justifyContent: 'center', 
                        width: 70, height: 70, position: 'absolute',zIndex:1, top:-15, right: -10}} 
                        textStyle={{fontSize: 25,color:'rgb(129,150,143)'}} text={'x'} 
                        onPress={() => this.handleDeleteMeal(meal.id)}/>
                <View style={{padding:20}}>
                  <View style={{flexDirection:'row', height:30}}>
                    <TextInput placeholder={"Name: "+meal.name}
                      style={[styles.storyHeading,{fontSize:14, marginTop:3,marginBottom:5, width: 150,color:'rgb(129,150,143)'}]}
                      onChangeText = {(text)=>this.editList[meal.id].name=text}/>
                    <Text style={{margin: 8, marginLeft:80, textAlign:'center',color:'rgb(129,150,143)'}}>Id: {meal.id}</Text>
                  </View>   
                  <View style={{flexDirection:'row',height:25, top: 5}}>
                    <DatePicker
                      style={{width:200}}
                      date={this.state.times[meal.id]}
                      mode="datetime"
                      placeholder={new Date(meal.date).getFullYear() + "/"+ 
                                    parseInt(new Date(meal.date).getMonth()+1) +"/"+ 
                                    new Date(meal.date).getDate()+ "  " + 
                                    new Date(meal.date).getHours() + ":" + 
                                    new Date(meal.date).getMinutes()} 
                      format="DD MMMM YYYY h:mm a"
                      minDate= {this.props.today.getFullYear()-1 + '-' + parseInt(this.props.today.getMonth()+1) + '-' + this.props.today.getDate()}
                      maxDate= {this.props.today}
                      customStyles={{
                        dateIcon: {
                          display:'none'
                        },
                        dateInput: {
                          top:-8,
                          left:-2
                        }
                      }}
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      onDateChange={(date) => {
                        let newDate = new Date(date);
                        this.editList[meal.id].date=newDate;
                        let new_times = JSON.parse(JSON.stringify(this.state.times));
                        new_times[meal.id] = date;
                        this.setState({times: new_times});
                      }}/>
                  </View>
                  <View style={{flexDirection:'row', marginTop:10}}>
                    <Text style={{width:150, color:'rgb(129,150,143)'}}>Aggr Cal:  
                    {this.state.mealsAggr[meal.id]?this.state.mealsAggr[meal.id].aggrCal:0}</Text>
                    <Text style={{marginLeft:80,color:'rgb(129,150,143)'}}>Aggr Protein:  
                    {this.state.mealsAggr[meal.id]?this.state.mealsAggr[meal.id].aggrProtein:0}</Text>
                  </View>
                  <View style={{flexDirection:'row', marginTop:10}}>
                    <Text style={{width:150, color:'rgb(129,150,143)'}}>Aggr Carbohydrates:  
                    {this.state.mealsAggr[meal.id]?this.state.mealsAggr[meal.id].aggrCarbo:0}</Text>
                    <Text style={{marginLeft:80,color:'rgb(129,150,143)'}}>Aggr Fat: 
                    {this.state.mealsAggr[meal.id]?this.state.mealsAggr[meal.id].aggrFat:0}</Text>
                  </View>
                  <View style={{marginTop:10}}>
                    <Button textStyle={{color: 'tomato', alignSelf:'center', textDecorationLine:'underline'}} 
                        text={'save'} onPress={() => this.handleSave(meal.id)}/>
                  </View>
                  <Food 
                    mealId = {meal.id}
                    userName = {this.props.userName}
                    password = {this.props.password}
                    callbackfromFood = {this.foodCallback}
                  />
                </View>
                
              </Card>
            )
          }
        });
        return (listMeal);
      }
    
    
    handleEdit(id) {
        let new_editMeal = JSON.parse(JSON.stringify(this.state.editMeal));
        new_editMeal[id] = true;
        this.setState({editMeal:new_editMeal});
        this.editList[id] = {};
    }
  
    handleSave(id) {
      let obj = this.editList[id];
      if(Object.keys(obj).length !== 0){
        let tempHeader = new Headers();
        tempHeader.append('Authorization', 'Basic ' + base64.encode(this.props.userName + ":" + this.props.password));
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
            fetch('https://mysqlcs639.cs.wisc.edu/meals/' + id, {
              method: 'PUT',
              headers: newHeader,
              body: JSON.stringify(obj),
              redirect:"follow"
              })
              .then(newresponse => newresponse.json())
              .then(newresult =>{
                this.props.refresh();
                Alert.alert(newresult.message)
              })
          })
          .catch((error) => {
              console.error(error);
              return;
          });
      }    
      let new_editMeal = JSON.parse(JSON.stringify(this.state.editMeal));
      new_editMeal[id] = false;
      this.setState({editMeal:new_editMeal});
    }

    handleDeleteMeal(id) {
        let tempHeader = new Headers();
        tempHeader.append('Authorization', 'Basic ' + base64.encode(this.props.userName+ ":" + this.props.password));
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
            fetch('https://mysqlcs639.cs.wisc.edu/meals/' + id, {
              method: 'DELETE',
              headers: newHeader,
              redirect:"follow"
              })
              .then(newresponse => newresponse.json())
              .then(newresult =>{
                if(newresult.message) {
                  this.props.refresh();
                  let new_editMeal = JSON.parse(JSON.stringify(this.state.editMeal));
                  new_editMeal[id] = false;
                  this.setState({editMeal:new_editMeal});
                  Alert.alert(newresult.message)
                }
              })
          })
          .catch((error) => {
              console.error(error);
              return;
          });
    }

    foodCallback = (id, data)=>{
        let new_mealsAggr = Object.assign({}, this.state.mealsAggr);
        new_mealsAggr[id] = data;
        this.setState({mealsAggr:new_mealsAggr});
    }


    calculateDailyAggr() {
        let dailyCal = 0;
        let dailyProtein = 0;
        let dailyCarbo = 0;
        let dailyFat = 0;
        Object.values(this.state.mealsAggr).forEach(value => {
            dailyCal += parseFloat(value.aggrCal);
            dailyProtein += parseFloat(value.aggrProtein);
            dailyCarbo += parseFloat(value.aggrCarbo);
            dailyFat += parseFloat(value.aggrFat);
        });
        let dailyAggr = {
            dailyCal: dailyCal,
            dailyProtein: dailyProtein,
            dailyCarbo: dailyCarbo,
            dailyFat: dailyFat,
        };
        this.props.callbackfromFood(dailyAggr);

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



export default Meal;