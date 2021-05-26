const socket=io()


document.querySelector("#sub").addEventListener('click',(e)=>
{
    e.preventDefault();
    const msg=document.querySelector('input').value;
    socket.emit('message',msg);
})

document.querySelector("#send-location").addEventListener('click',()=>
{
    if(!navigator.geolocation)
        {
            return alert('Geolocatiion is not supported by your browser');
        }
        navigator.geolocation.getCurrentPosition((position)=>
        {
            // console.log(position);
            socket.emit('sendLocation',{
                lati:position.coords.latitude,
                longi:position.coords.longitude
            });
        })
})

socket.on('show_msg',(value)=>
{
    console.log(value);
})
