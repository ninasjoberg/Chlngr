import firebase from "firebase";

//Register user
export function registerFirebase(email, password, username) {
    return (dispatch) => {
        dispatch({
            type: "REGISTER_USER",
        })
        return firebase.auth()
            .createUserWithEmailAndPassword(email, password)//creates a user in firebase Authentication
            .then((user) => {
                user.updateProfile({ //sets the displayName in Firebase to the username provided by the user during register
                    displayName: username,
                }).then(() => {
                    firebase.database() //store the user (email, uid and username) data in Firebase database
                    .ref(`users/${user.uid}`)
                    .set({email: user.email, uid: user.uid, username: user.displayName}); //om ett värde inte finns komer det bli null i firebase
                    return user;
                }).then((user) => {
                    dispatch({
                        type: "REGISTER_USER_SUCCESS",
                        payload: {
                            email: user.email,
                            username: user.displayName,
                            userId: user.uid,
                        }
                    })
                })
            .catch(error => {
                dispatch({
                    type: "REGISTER_USER_ERROR",
                    payload: error,
                })
            });
        });
    }
}

//Login user
export function loginFirebase(email, password) {
    return (dispatch) => {
        dispatch({
            type: "LOGIN_USER",
        })
        return firebase.auth() //logging in a user in firebase Authentication
            .signInWithEmailAndPassword(email, password)
            .then((user) => {
                if(user){
                    dispatch({
                        type: "LOGIN_USER_SUCCESS",
                        payload: {
                            email: user.email,
                            username: user.displayName,
                            userId: user.uid,
                        }
                    });
                }
            })
            .catch(error => {
                dispatch({
                    type: "LOGIN_USER_ERROR",
                    payload: error,
                });
            });
    }
}

//Logout user
export function logoutFirebase() {
    return (dispatch) => {
        //signout Firebase
        firebase
        .auth()
        .signOut()
        .then(() => {
            dispatch({
                type: "LOGOUT_USER",
            })
        })
        .catch(error => {
            dispatch({
                type: "LOGOUT_USER_ERROR",
                payload:  error,
            })
        });
    }
}
