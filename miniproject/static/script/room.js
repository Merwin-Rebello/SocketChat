// user and room data 
let user = window.location.pathname.split('/')[1]
let room = window.location.pathname.split('/')[2]
let avatar = ["https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp", "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp", "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp", "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp", "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp", "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"]

// page elements
let form = document.querySelector('#chat-message')
let text = document.querySelector('#exampleFormControlInput2')
let userMessage = document.querySelector('.User_Message')
let incomingMessage = document.querySelector('.Incoming_Message')
let messageDisplay = document.querySelector('.messageDisplay')
let userTemplate = document.querySelector('.user')
let userContainer = document.querySelector('.userList')

// websockets url pattern
let url = `ws://${window.location.host}/ws/socket-server${window.location.pathname}`

// connection to websocket
const chatsocket = new WebSocket(url)

chatsocket.onmessage = e => {
    let data = JSON.parse(e.data)
    if (data.inRoom) {
        let string = data.inRoom.replaceAll('\'', '\"')
        let usersInRoom = JSON.parse(string)
        usersInRoom.forEach(userlocal => {
           user.toLowerCase() == userlocal.user_name.toLowerCase() ? true :helper(userTemplate, userlocal, true)
        });
    }
    if (data.type.toLowerCase() === 'chat') {
        user.toLowerCase() == data.user.toLowerCase() ? helper(userMessage, data) : helper(incomingMessage, data)
    }
    else if (data.type.toLowerCase() === 'new_user') {
        helper(userTemplate, data, 'user')
        info(data)
    }
    else if (data.type.toLowerCase() === 'user_left') {
        let lis = userContainer.querySelectorAll('li')
        lis.forEach(li => {
            user = li.querySelector('p').textContent
            if (user.toLowerCase() === data.user.toLowerCase()) {
                li.remove()
            }
        })
        info(data)
    }
    else {
        info(data)
    }
    console.log(data);
}

form.addEventListener('submit', e => {
    e.preventDefault()
    let message = text.value
    chatsocket.send(JSON.stringify({
        'message': message
    }))
    text.value = ''
})

function helper(template, data, extra) {
    if (extra) {
        console.log(">>>data", data);
        domElem = document.importNode(template.content, true)
        message = domElem.querySelector('p')
        if (data.user_name) {
            message.textContent = data.user_name.charAt(0).toUpperCase() + data.user_name.slice(1)
        } else {
            message.textContent = data.user.charAt(0).toUpperCase() + data.user.slice(1)
        }
        userContainer.appendChild(domElem)
    }
    else {
        domElem = document.importNode(template.content, true)
        message = domElem.querySelector('p')
        message.textContent = data.message
        messageDisplay.appendChild(domElem)
    }
}

function info(data) {
    div = document.createElement('div')
    div.appendChild(document.createElement('p'))
    div.querySelector('p').textContent = data.message
    messageDisplay.appendChild(div)
}