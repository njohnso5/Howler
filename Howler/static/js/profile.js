import api from './APIClient.js';

let follow = document.querySelector("#follow");
follow.addEventListener("click", e => {
    if (follow.innerHTML == "Follow") {
        follow.className = "btn btn-secondary"
        follow.innerHTML = "Unfollow";
        const query = window.location.search;
        let parameters = new URLSearchParams(query);
        let id = parameters.get('id');
        console.log(id);
        api.getCurrentUser().then(currentUser => {
            api.getUsersFollowed(currentUser.id).then(users => {
                let value = users.find(user => user.id == id);
                if (!value) {
                    api.addToFollowed(id).then(newfollowed => {
                        console.log(newfollowed);
                    })
                }
            })
        })
    }
    else {
        follow.className = "btn btn-primary";
        follow.innerHTML = "Follow";
        const query = window.location.search;
        let parameters = new URLSearchParams(query);
        let id = parameters.get('id');
        console.log(id);
        api.getCurrentUser().then(currentUser => {
            api.getUsersFollowed(currentUser.id).then(users => {
                console.log(users);
                let value = users.find(user => user.id == id);
                console.log(value);
                if (value) {
                    api.removeFromFollowed(id).then(newfollowed => {
                        console.log(newfollowed);
                    })
                }
            })
        })
    }
});

let createHowlDisplay = function(user, howl) {
    let howls = document.querySelector("#howl_list");
    let post = document.createElement("div");
    post.className = "post border w-50";
    let accountdetails = document.createElement("div");
    accountdetails.className = "d-flex flex-row mb-3"
    let avatar = document.createElement("img");
    avatar.src = user.avatar;
    let name = document.createElement("p");
    name.innerHTML = user.first_name + " " + user.last_name;
    name.className = "mb-0 mx-1 align-middle";
    let username = document.createElement("p");
    let userlink = document.createElement("a");
    userlink.href = "/user?id=" + user.id;
    userlink.innerHTML = "@" + user.username;
    username.appendChild(userlink);
    username.className = "mx-1";
    accountdetails.appendChild(avatar);
    let namediv = document.createElement("div");
    namediv.className = "d-flex flex-column";
    namediv.appendChild(name);
    namediv.appendChild(username);
    accountdetails.appendChild(namediv);
    let date = document.createElement("p");
    let datemark = document.createElement("date");
    let postedDate = new Date(howl.datetime);
    datemark.innerHTML = postedDate.toLocaleString();
    date.appendChild(datemark);
    date.className = "text-end position-absolute top-0 end-0 w-25 px-1";
    let postText = document.createElement("p");
    postText.innerHTML = howl.text;
    post.appendChild(accountdetails);
    post.appendChild(date);
    post.appendChild(postText);
    howls.appendChild(post);
}

let getHowls = function(user) {
    console.log(user);
    api.getHowlsByUser(user.id).then(howls => {
        console.log(howls);
        let sortedhowls = howls.sort((a, b) => {
            let dateA = new Date(a.datetime);
            let dateB = new Date(b.datetime);
            if (dateA < dateB) {
                return 1;
            }
            if (dateA > dateB) {
                return -1;
            }
            return 0;
        });
        console.log(sortedhowls);
        sortedhowls.forEach(howl => {
            createHowlDisplay(user, howl);
        });
    });
}

let addUsersToList = function(users) {
    users.forEach(user => {
        let list = document.querySelector("#following");
        let useritem = document.createElement("div");
        let avatar = document.createElement("img");
        avatar.src = user.avatar;
        let name = document.createElement("p");
        name.innerHTML = user.first_name + " " + user.last_name;
        name.className = "mx-1 mb-0";
        let username = document.createElement("p");
        let userlink = document.createElement("a");
        userlink.href = "/user?id=" + user.id;
        userlink.innerHTML = "@" + user.username;
        username.appendChild(userlink);
        username.className = "mx-1";
        useritem.className = "d-flex justify-content-center border w-50 post"
        useritem.appendChild(avatar);
        let namediv = document.createElement("div");
        namediv.className = "d-flex flex-column";
        namediv.appendChild(name);
        namediv.appendChild(username);
        useritem.appendChild(namediv);
        list.appendChild(useritem);
    });
}

let getFollowed = function(user) {
    console.log(user);
    api.getUsersFollowed(user.id).then(users => {
        console.log(users);
        addUsersToList(users);
        getHowls(user);
    });
}

api.getCurrentUser().then(currentUser => {
    let yourAvatar = document.querySelector("#your-avatar");
    yourAvatar.src = currentUser.avatar;
    let yourName = document.querySelector("#your-name");
    yourName.innerHTML = currentUser.first_name + " " + currentUser.last_name;
    let yourUsername = document.querySelector("#your-username");
    yourUsername.innerHTML = "@" + currentUser.username;
}).catch((err) => {
    document.location = '/login';
})

const query = window.location.search;
let parameters = new URLSearchParams(query);
let id = parameters.get('id');

api.getUser(id).then(profileuser => {
    let avatar = document.querySelector("#avatar");
    avatar.src = profileuser.avatar;
    let profilename = document.querySelector("#profile_name");
    profilename.innerHTML = profileuser.first_name + " " + profileuser.last_name;
    let profileusername = document.querySelector("#profile_username");
    profileusername.innerHTML = "@" + profileuser.username;
    api.getCurrentUser().then(currentUser => {
        console.log(currentUser);
        if (currentUser.id == profileuser.id) {
            follow.hidden = true;
        }
        api.getUsersFollowed(currentUser.id).then(users => {
            console.log(users);
            let found = users.find(user => profileuser.id == user.id);
            console.log(found);
            if (found) {
                follow.className = "btn btn-secondary";
                follow.innerHTML = "Unfollow";
            }
        })
    });
    getFollowed(profileuser);
});

let logoutbutton = document.querySelector("#logout");
logoutbutton.addEventListener("click", e => {
    api.logOut().then(res => {
        document.location = '/login';
    })
});