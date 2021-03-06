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
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;


//Options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll=()=>
{
    // New message Element
    const $newMessage=$messages.lastElementChild

    // Height of the new message
    const newMessageStyle=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyle.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight+newMessageMargin

    // Visible Height
    const visibleHeight=$messages.offsetHeight

    // Height of messages container
    const containerHeight=$messages.scrollHeight

    // How far have I scrolled
    const scrollOffset=$messages.scrollTop+visibleHeight

    if(containerHeight-newMessageHeight<=scrollOffset)
        {
            $messages.scrollTop=$messages.scrollHeight
        }
}


socket.on("show_msg", (message) => {
  console.log(message);
  const html=Mustache.render(messageTemplate,{
      username:message.username,
      message:message.text,
      createdAt:moment(message.createdAt).format('h:mm a D/M/YYYY')
  });
  $messages.insertAdjacentHTML('beforeend',html);
  autoscroll();
});

socket.on('LocationMessage',(message)=>
{
    console.log(message);
    const html = Mustache.render(locationMessageTemplate, {
      username:message.username,
      url: message.url,
      createdAt: moment(message.createdAt).format("h:mm a D/M/YYYY"),
    });
    $messages.insertAdjacentHTML("beforeend", html);
    autoscroll();
});

socket.on('roomData',({room,users})=>
{
    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html
})

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

socket.emit('join',{username,room},(error)=>
{
    if(error)
        {
            alert(error)
            location.href="/"
        }
});