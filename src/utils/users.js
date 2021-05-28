const users=[]

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({id,username,room}) =>
{
    // Clean the data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase();

    // Validate the data
    if(!username || !room)
        {
            return{
                    error:'Username and room are required!'
                }
        }
    
    // Check for existing User
    const existingUser=users.find((user)=>
        {
            return user.room===room && user.username===username
        })
    
        // validate username
        if(existingUser)
            {
                return{
                        error:"Username is in use!"
                    }
            }
        
        // Store User
        const user={ id,username,room }
        users.push(user)
        return {user}
        
}

// remove a user by searching its id
const removeUser=(id)=>
{
    const index=users.findIndex((user)=>user.id===id)
    if(index!==-1)
        {
            return users.splice(index,1)[0]
        }
}

// getUser -> Accept id and return user object (or undefined)
const getUser=(id)=>
    {
        const user=users.find((user)=>user.id===id)
        if(!user)
            {
                return{
                    error:'undefined'
                }
            }
        return {user};
    }

// 2nd method
    // const getUser=(id)=>
    // {
    //     return users.find((user)=>user.id===id);
    // }

// getUsersInRoom ->Accept room name and return an array of users (or empty array)
const getUserInRoom=(roomname)=>
{
    const userinroom=[]
    users.find((user)=>
    {
        if(user.room===roomname)
            {
                userinroom.push(user)
            }
    })
    return userinroom
} 

// 2nd Method
    // const getUserInRoom=(room)=>
    // {
    //     return users.filter((user)=>user.room===room)
    // }

module.exports={
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}