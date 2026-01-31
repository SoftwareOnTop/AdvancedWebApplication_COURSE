
document.getElementById("submit").addEventListener("click", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value
    const email = document.getElementById("email").value

    fetch("/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email })
    })
    alert("User successfully added");



})


document.getElementById("getUsers").addEventListener("click", async () => {
    const res = await fetch("/users")
    const users = await res.json()

    const list = document.getElementById("userList");

    list.innerHTML = "";

    users.foreach((user) => {
        const li = document.createElement("li")
        li.textContent = `${user.name} - ${user.email}`
        list.appendChild(li)
    })


})


