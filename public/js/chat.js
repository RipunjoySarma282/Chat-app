const socket=io()


document.querySelector("#sub").addEventListener('click',(e)=>
{
    e.preventDefault();
    const msg=document.querySelector('input').value;
    socket.emit('message',msg);
})
socket.on('show_msg',(value)=>
{
    console.log(value);
})
