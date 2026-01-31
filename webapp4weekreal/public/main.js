
const todoForm = document.getElementById('todoForm')

const message = document.getElementById('addMessage')

todoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('userInput').value


    const todo = document.getElementById('todoInput').value

    const response = await fetch('/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, todo })
    });




    const text = await response.text()

    message.textContent = text
});

const search = document.getElementById('search')
const todoList = document.getElementById('todoList')
const searchMessage = document.getElementById('searchMessage')
const deleteContainer = document.getElementById('deleteContainer')
let currentSearchedUser = ""

search.addEventListener('click', async () => {
    const name = document.getElementById('searchInput').value
    currentSearchedUser = name
    
    
    todoList.innerHTML = ''
    searchMessage.textContent = ''
    deleteContainer.innerHTML = ''

    const response = await fetch(`/todos/${name}`)

    if (response.status === 404) {
        searchMessage.textContent = "User not found"
        return
    }

    const todos = await response.json()


    todos.forEach(todo => {
        const li = document.createElement('li');
        
        const a = document.createElement('a');
        a.textContent = todo;
        a.className = 'delete-task'
        
     
        a.addEventListener('click', () => deleteTodo(todo))

        li.appendChild(a)
        todoList.appendChild(li)
    });


    const delete1 = document.createElement('button')
    delete1.id = 'deleteUser'
    delete1.textContent = 'Delete User'
    delete1.onclick = deleteUser
    deleteContainer.appendChild(delete1)
})


async function deleteUser() {
    const response = await fetch('/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: currentSearchedUser })
    })

    const text = await response.text()
    searchMessage.textContent = text
    
  
    if (response.ok) {
        todoList.innerHTML = ''
        deleteContainer.innerHTML = ''
    }
}


async function deleteTodo(todoText) {
    const response = await fetch('/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: currentSearchedUser, todo: todoText })
    });

    const text = await response.text();
    searchMessage.textContent = text;

    if (response.ok) {
        search.click()
    }
}