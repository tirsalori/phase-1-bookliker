document.addEventListener("DOMContentLoaded", function() {
    fetch("http://localhost:3000/books")
    .then((response) => response.json())
    .then((data) => data.forEach(bookObj => createBookList(bookObj)))
})

function createBookList(bookObj) {
    const div = document.getElementById("show-panel")
    const ul = document.getElementById("list")
    const span = document.createElement("span")
    const li = document.createElement("li")
    const img = document.createElement("img")
    const title = document.createElement("h2")
    const subtitle = document.createElement("h3")
    const author = document.createElement("h3")
    const desc = document.createElement("p")
    const users = document.createElement("ul")
    const btn = document.createElement("button")
    span.setAttribute("id", bookObj.title)
    img.setAttribute("src", bookObj.img_url)
    btn.setAttribute("id", bookObj.id)
    li.innerText = bookObj.title
    title.innerText = bookObj.title
    subtitle.innerText = bookObj.subtitle
    author.innerText = bookObj.author
    desc.innerText = bookObj.description
    btn.innerText = "LIKE"
    bookObj.users.forEach(userObj => {
        const user = document.createElement("li")
        user.innerText = userObj.username
        users.appendChild(user)
    })
    ul.appendChild(li)
    span.append(img, title, subtitle, author, desc, users, btn)
    span.style.display = "none"
    div.appendChild(span)
    li.addEventListener("click", showBookInfo)
    btn.addEventListener("click", fetchUsers)
}

let priorClickedTitle
function showBookInfo(e) {
    if (priorClickedTitle !== e.target.textContent && priorClickedTitle !== undefined) {
        document.getElementById(priorClickedTitle).style.display = "none"
    } 
    document.getElementById(e.target.textContent).style.display = ""
    priorClickedTitle = e.target.textContent
} 

const newUserArray = []
async function fetchUsers(e){
    const response = await fetch(`http://localhost:3000/books/${e.target.attributes.id.value}`)
    const userObj = await response.json()
    userObj.users.forEach(element => {
        newUserArray.push({"id": element.id, "username": element.username})
    })
    const ul = document.getElementById(e.target.attributes.id.value).previousSibling
    const li = document.createElement("li")
    if (newUserArray.pop().username === 'tirsmode'){
        newUserArray.pop()
        ul.removeChild(ul.lastChild)
    } else {
        newUserArray.push({"id": 12, "username": "tirsmode"})
        li.innerText = "tirsmode"
        ul.appendChild(li)
    }
    fetch(`http://localhost:3000/books/${e.target.attributes.id.value}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({"users": newUserArray})
    })
}

