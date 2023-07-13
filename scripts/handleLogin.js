const url_log = 'https://zone01normandie.org/api/auth/signin';

let form = document.getElementById("login-form");
let username = "";
let password = "";

form.addEventListener("submit", (e) => {
    e.preventDefault();
    username = document.getElementById("username").value;
    password = document.getElementById("password").value;

    localStorage.setItem("Username", username)

    const auth = btoa(`${username}:${password}`); // Conversion des credentials en b64 


    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`
        },
    };

    fetch(url_log, options)
        .then(response => {
            if (!response.ok) {
                let valid = document.createElement("div");
                valid.innerHTML += "Wrong Password or Username"
                valid.style.color = "red";
                form.appendChild(valid);
                throw Error("WRONG")
            } 
            return response.json()

        })
        .then(data => {
            localStorage.setItem("Token", data);
            location.href = "../templates/home.html";
        })
        .catch(error => {
            console.error('Error:', error);
        });
})

function getBase(r) {
    let url = "https://zone01normandie.org/api/graphql-engine/v1/graphql";

    let resp = fetch(url, {
        'Content-Type': 'application/json',
        headers: {
            'Content-Type': 'application/json',
            Authentication: `Bearer ${localStorage.getItem("Token")}`
        },
        body: JSON.stringify(r)
    })
    console.log(resp.json())
    return resp.json()
}
