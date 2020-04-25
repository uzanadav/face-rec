import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Ragister from './components/Ragister/Ragister';
import Rank from './components/Rank/Rank';

import './App.css';



const ParticlesOptions = {
      "particles": {
          "number": {
              "value": 160,
              "density": {
              "enable": true,
              value_ares:800
              }
          },
          "size": {
              "value": 3,
              "random": true,
              "anim": {
                  "speed": 4,
                  "size_min": 0.3
              }
          },
          "line_linked": {
              "enable": false
          },
          "move": {
              "random": true,
              "speed": 1,
              "direction": "top",
              "out_mode": "out"
          }
      },
      "interactivity": {
          "events": {
              "onhover": {
                  "enable": true,
                  "mode": "bubble"
              },
              "onclick": {
                  "enable": true,
                  "mode": "repulse"
              }
          },
          "modes": {
              "bubble": {
                  "distance": 250,
                  "duration": 2,
                  "size": 0,
                  "opacity": 0
              },
              "repulse": {
                  "distance": 400,
                  "duration": 4
              }
          }
      }
}

const initalState ={
      input:'',
      imageUrl:'',
      box:{},
      route: 'signin',
      isSignedIn: false,
      user: {
          id:'123',
          name:'',
          email:'',
          entries:0,
          joined:''
      }
    }

class App extends Component {
  constructor() {
    super();
    this.state = {
      input:'',
      imageUrl:'',
      box:{},
      route: 'signin',
      isSignedIn: false,
      user: {
          id:'123',
          name:'',
          email:'',
          entries:0,
          joined:''
      }
    }
  }

  loadUser=(data)=>{
    this.setState({user: {
          id:data.id,
          name:data.name,
          email:data.email,
          entries:data.entries,
          joined:data.joined
    }})
  }


  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image =document.getElementById('inputimage');
    const width=Number(image.width);
    const height=Number(image.height);
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width-(clarifaiFace.right_col * width),
      bottomRow: height-(clarifaiFace.bottom_row * height),
    }
  }

  displayFaceBox = (box) => {
    this.setState({box:box});
  }


  onInputChange = (event) => {
  this.setState({input: event.target.value});
  }

  onButtonSubmit= () => {
    this.setState({imageUrl: this.state.input});
     fetch('https://face-rec-nu.herokuapp.com/imageurl', {
          method:'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            input:this.state.input
      })
    })
    .then(response =>response.json())
    .then(response =>{
    if(response)  {
      fetch('https://face-rec-nu.herokuapp.com/image', {
          method:'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id:this.state.user.id
      })
    })
      .then(response =>response.json())
      .then(count=>{
          this.setState(Object.assign(this.state.user, {entries:count}))
      })
      .catch(console.log)
    }
    this.displayFaceBox(this.calculateFaceLocation(response))
  })
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route==='signout'){
      this.setState(initalState)
    } else if (route==='home'){
      this.setState({isSignedIn:true})
    }
      this.setState({route: route});
  }
  
  render(){
   const  { isSignedIn, imageUrl, route, box }=this.state;
    return (
      <div className="App">
      <Particles className='particles'
      params={ParticlesOptions} 
      />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route==='home'
        ? <div>
            <Logo/>
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm 
            onInputChange={this.onInputChange}
            onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box= {box} imageUrl={imageUrl}/>
          </div>
        : (
            this.state.route==='signin'
            ?<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            :<Ragister loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          ) 
      }
      </div>
    );
  }
}

export default App;


