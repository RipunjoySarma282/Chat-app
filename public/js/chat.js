const socket=io()

// Elements
const $messageform=document.querySelector('#sub')
const $messageformInput = document.querySelector("input");
const $messageformButton = document.querySelector("button");
const $locationButton=document.querySelector('#send-location');


$messageform.addEventListener('submit',(e)=>
{
    e.preventDefault();

    // Disable the button to prevent sending the same message again and again
    $messageformButton.setAttribute('disabled','disabled')

    const msg=e.target.elements.message.value
    
    socket.emit('message',msg,(error)=>{
        $messageformButton.removeAttribute('disabled')
        $messageformInput.value=''
        $messageformInput.focus();

        if(error)
            {
                return console.log(error);
            }
        console.log('The message was delivered!');
    });
})


$locationButton.addEventListener('click',()=>
{
    if(!navigator.geolocation)
        {
            return alert('Geolocatiion is not supported by your browser');
        }
        // Disable the button
        $locationButton.setAttribute('disabled','disabled');
        navigator.geolocation.getCurrentPosition((position)=>
        {
            // console.log(position);
            socket.emit('sendLocation',{
                lati:position.coords.latitude,
                longi:position.coords.longitude
            },(error)=>
            {
                $locationButton.removeAttribute('disabled')
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
