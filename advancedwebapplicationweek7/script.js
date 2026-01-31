let emaillist = []

async function registerUser(email, password) {
    try {
        const response = await fetch('http://localhost:3000/api/user/register', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        const result = await response.json()
        alert(result.message)
    } catch (error) {
        console.error("virhe kirjautumisessa:", error)
    }
}

document.getElementById("button").addEventListener('click', () => {
    const emailname = document.getElementById("email").value
    const password = document.getElementById("password").value

    registerUser(emailname, password)

})