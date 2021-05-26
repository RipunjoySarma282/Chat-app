const socket=io()

socket.on('countUpdated',(count)=>
{
    console.log('The count has been updated ',count)
})

document.querySelector('#incrementcount').addEventListener('click',(count)=>
    {
        console.log('clicked');
        socket.emit('increment');
    })