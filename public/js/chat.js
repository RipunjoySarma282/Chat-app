const socket=io()

// Elements
const $messageform=document.querySelector('#sub')
const $messageformInput = document.querySelector("input");
const $messageformButton = document.querySelector("button");
const $locationButton=document.querySelector('#send-location');
const $messages=document.querySelector('#messages');

// Template
const messageTemplate=document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector("#Lecation-message-template").innerHTML;


socket.on("show_msg", (message) => {
  console.log(message);
  const html=Mustache.render(messageTemplate,{
      message:message.text,
      createdAt:moment(message.createdAt).format('h:mm a')
  });
  $messages.insertAdjacentHTML('beforeend',html);
});

socket.on('LocationMessage',(url)=>
{
    console.log(url);
    const html = Mustache.render(locationMessageTemplate, {
      url
    });
    $messages.insertAdjacentHTML("beforeend", html);
});

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
