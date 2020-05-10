/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text,ActivityIndicator,StatusBar,KeyboardAvoidingView,View, ImageBackground} from 'react-native';

import { fetchLocationId, fetchWeather} from './utils/api';
import getImageForWeather from './utils/getImageForWeather';

import SearchInput from './components/searchInput';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  constructor(props){
    super(props);
    this.state={
      loading: false,
      error: false,
      location: '',
      temperature: 0,
      weather: '',
    };
  }

  componentDidMount(){
    console.log('Component has mounted!');
    this.handleUpdateLocation('San Francisco');
  }

  handleUpdateLocation = async city =>{
    if (!city) return;

    this.setState({loading: true}, async ()=>{
      try{
        const locationId= await fetchLocationId(city);
        const { location, weather, temperature }=await fetchWeather(locationId,);

        this.setState({
          loading: false,
          error: false,
          location: location,
          weather: weather,
          temperature: temperature,
        });

      }catch(e){
        this.setState({
          loading: false,
          error: true,
        });
      }
    });

    


  };

  render() {
    const {loading, error,location, weather, temperature}=this.state;

    return (
      
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <StatusBar barStyle="light-content" />
          <ImageBackground
          source={getImageForWeather(weather)}
          style={styles.imageContainer}
          imageStyle={styles.image}>
         <View style={styles.detailsContainer}>
           <ActivityIndicator animating={loading} color="white" size="large"/>
        {!loading && (
          <View>
            { error && (
              <Text style={[styles.smallText, styles.textStyle]}>
                Could not load weather, please try a different city.
              </Text>
            )}
            {!error && (
              <View>
                <Text style={[styles.largeText, styles.textStyle]}>
                  {location}
                </Text>
                <Text style={[styles.smallText, styles.textStyle]}>
                  {weather}
                </Text>
                <Text style={[styles.largeText, styles.textStyle]}>
                  {`${Math.round(temperature)}°`}
                </Text>
              </View>
            )}
            <SearchInput placeholder="Search any city here" onSubmit={this.handleUpdateLocation}/>
          </View>
        
        )}
        </View>
        </ImageBackground>
        </KeyboardAvoidingView>
      
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#34495E'
  },
  imageContainer:{
    flex:1,
  },
  image:{
    flex:1,
    width:null,
    height:null,
    resizeMode:'cover',
  },  
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  textStyle:{
    textAlign:'center',
    fontFamily: Platform.OS === 'ios'? 'AvenirNext-Regular' : 'Roboto',
  },
  largeText:{
    fontSize:44,
  },
  smallText:{
    fontSize:18,
  },
  textInput:{
    backgroundColor:'#666',
    color:'white',
    height:40,
    width: 300,
    marginTop: 30,
    marginHorizontal: 20,
    paddingHorizontal:10,
    alignSelf:'center',
  }
});
