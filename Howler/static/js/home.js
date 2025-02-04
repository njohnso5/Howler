import api from './APIClient.js';

let createHowlDisplay = function(user, howl) {
    console.log(howl);
            // console.log(user);
    let howls = document.querySelector("#howl_list");
    let post = document.createElement("div");
    post.className = "post border w-50";
    let accountdetails = document.createElement("div");
    accountdetails.className = "d-flex flex-row mb-3"
    let avatar = document.createElement("img");
    avatar.src = user.avatar;
    let name = document.createElement("p");
    name.innerHTML = user.first_name + " " + user.last_name;
    name.className = "my-0 mx-1 align-middle";
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
    postText.className = "px-1";
    post.appendChild(accountdetails);
    post.appendChild(date);
    post.appendChild(postText);
    howls.appendChild(post);
}

let getHowlsFollowed = function(users) {
    api.getAllHowlsFollowed().then(howls => {
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
            let user = users.find(user => user.id == howl.userId);
            createHowlDisplay(user, howl);
        });
    });
}

let clearHowls = function() {
    let howls = document.querySelectorAll(".post");
    howls.forEach(element => {
        console.log(element);
        element.parentNode.removeChild(element);
    });
}

let getFollowed = function() {
    clearHowls();
    api.getCurrentUser().then(currentUser => {
        api.getUsersFollowed(currentUser.id).then(users => {
            users.push(currentUser);
            getHowlsFollowed(users);
        });
    });
}

api.getCurrentUser().then(currentUser => {
    let yourAvatar = document.querySelector("#your-avatar");
    yourAvatar.src = currentUser.avatar;
    let yourName = document.querySelector("#your-name");
    yourName.innerHTML = currentUser.first_name + " " + currentUser.last_name;
    let yourUsername = document.querySelector("#your-username");
    yourUsername.innerHTML = "@" + currentUser.username;
    getFollowed();
}).catch((err) => {
    document.location = '/login';
})

let logoutbutton = document.querySelector("#logout");
logoutbutton.addEventListener("click", e => {
    api.logOut().then(res => {
        document.location = '/login';
    })
});

let howlinput = document.querySelector("#howltext");
let howlbutton = document.querySelector("#howl");
howlbutton.addEventListener("click", e => {
    api.getCurrentUser().then(currentUser => {
        let newhowl = {
            userId: currentUser.id,
            datetime: Date.now(),
            text: howlinput.value
        }
        api.addHowl(newhowl);
        getFollowed();
    })
});
