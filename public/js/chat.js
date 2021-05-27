const socket=io()


document.querySelector("#sub").addEventListener('submit',(e)=>
{
    e.preventDefault();

    const msg=e.target.elements.message.value
    
    socket.emit('message',msg,(error)=>{
        if(error)
            {
                return console.log(error);
            }
        console.log('The message was delivered!');
    });
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
            },(error)=>
            {
                if(error)
                    {
                        console.log(error);
                    }
                console.log('Location Shared');
            });
        })
})

socket.on('show_msg',(value)=>
{
    console.log(value);
})
