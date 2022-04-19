let student = null;
let socket = null;

let input = document.getElementById("inputtext");
let parrafo = document.getElementById("contenedor_texto");
let button = document.getElementById("sendSocket");
let form_data_user = document.getElementById("data_user");
let container_chat = document.getElementById("container_chat");
let user_list = document.getElementById("user_list");
form_data_user.addEventListener("submit", e=>{
    e.preventDefault();
    let file = e.target[2].files[0];
    student = {
        name: e.target[0].value,
        email: e.target[1].value
    }
    if(student.name == "" || student.email == ""){
        window.location.reload();
    }
    socket = io();
    let reader = new FileReader();
    reader.onload = function(evt){
        student.photo = evt.target.result;
        socket.emit("addUser", student);
    }
    reader.readAsDataURL(file);
            
    container_chat.classList = "active";
    readSockets();
});

function readSockets(){
    loadChat();
    socket.on("listenserver", data =>{
        console.log("Recibiendo..", data);
        let inner = ``;
        data.forEach(element => {
            inner += `<b>${element.name}:</b> ${element.mensaje} </br>`;
        });
        parrafo.innerHTML = inner;
    });
}

function loadChat(){
    socket.on("init", data =>{
        let inner = ``;
        console.log("Recibiendo..", data);
        data.forEach(element => {
            inner += `<b>${element.name}:</b> ${element.mensaje} </br>`;
        });
        parrafo.innerHTML = inner;
    });

    socket.on("loadUsers", data =>{
        console.log("Nuevo usuario", data);
        let inner = ``;
        data.forEach(element => {
            let status = element.active ? "(conectado)" : "(desconectado)";
            let border_color = element.active ? "#13d586;" : "#afafaf";
            inner += `<li style='display: flex; align-items: center;'>
                        <div style="
                                    width 30px;
                                    height 30px;
                                    overflow: hidden;
                                    justify-content: center;
                                    align items: center;
                                    border-radius 50%;
                                    margin-right 10px;
                                    border: 4px solid ${border_color};
                                    
                                    ">
                                    <img style='width: auto;
                                                height 100%;
                                                max-width fit-content'
                                                scr=${element.photo}>
                                </div>
                                <b>${element.name}:</b> ${status}
                             </li>`;
        });
        user_list.innerHTML = inner;
    });
}
        
button.addEventListener("click", e =>{
    let sendMessagge = {
        ...student,
        mensaje: input.value
    }
    socket.emit("mensaje", sendMessagge);
    input.value = "";
})