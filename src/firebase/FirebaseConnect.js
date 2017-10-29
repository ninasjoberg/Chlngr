import React, { Component } from "react";

const db = firebase.database(); //to avoid write firebase.database() all the time in the code, now we can write db instead


export default class FirebaseConnect extends Component {

  state = {
    currentUser: '',
    currentPage: 'home',
    challengesList: [],
  }


  //function that sets the currentUser state (the one who is logged in)
  onUserReady = (user) => {    

    if(user && user.displayName) {
      const newUser = {
          email: user.email,
          username: user.displayName,
          userId: user.uid
      }
      this.setState({currentUser: newUser});
    }
    else{
      this.setState({currentUser: ''});
      
    }
  }

  //built in function "componentDidMount" that runs when the website reloads
  componentDidMount() {

    firebase.auth().onAuthStateChanged(this.onUserReady);


    //Listens for when new values/objects adds to the database Firebase. callback returns the added object
    db.ref('challenges').on('child_added', (snapshot) => {

      const newChallenge = {
        value: snapshot.val(),
        key: snapshot.key
      }
      this.setState({challengesList: [...this.state.challengesList, newChallenge]})
    })


    //Listens for when a value/object deletes from the database Firebase. callback returns the deleted object
    db.ref('challenges').on('child_removed', (snapshot) => {
      let challenges = this.state.challengesList.filter((item) => {
        return item.key !== snapshot.key;
      })
      this.setState({challengesList: challenges})
    })

    //Listens for when values/objects updates/changes in the database Firebase. callback returns the updated object
    db.ref('challenges').on('child_changed', (snapshot) => {
      let updateChallenges = this.state.challengesList.map((item) => {
        if(item.key === snapshot.key){ 
          return Object.assign({}, item, {value: snapshot.val()}) //Object assign === merge the old object with the new object.
        }else
          return item;
      })
      this.setState({challengesList: updateChallenges})
    })
  }

  render () {
      return

  }
}