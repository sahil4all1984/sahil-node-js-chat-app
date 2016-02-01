module.exports = function(io, rooms) {

	var chatrooms = io.of('/roomlist').on('connection', function(socket){
		console.log('connection eshtablished on the server');
		
		// when we refresh page the room update event will still persist
		// the active socket will recieve stringify version of the room's array
		socket.emit('roomupdate', JSON.stringify(rooms));

		socket.on('newroom', function(data) {
			rooms.push(data); 
			socket.broadcast.emit('roomupdate', JSON.stringify(rooms));
			socket.emit('roomupdate', JSON.stringify(rooms));
		})

	});

	// creating handler for messages namespace
	var messages = io.of('/messages').on('connection', function(socket) {
		console.log("connected to the chatrooms");

		socket.on('joinroom', function(data) {
			socket.username = data.user;
			socket.userPic = data.userPic;
			socket.join(data.room);
			updateUserList(data.room, true);
		})

		socket.on('newMessage', function(data) {
			console.log(data.message);
			 socket.broadcast.to(data.room_number).emit('messagefeed', JSON.stringify(data));
		})

		
		function updateUserList(room, updateAll){

			
			//var getUsers = io.of('/messages').clients(room); // used before socket.io 1.x
			//var getUsers = Object.keys(io.sockets.adapter.rooms[room]);
			/*var getUsers = io.of('/messages').in('general').clients(function(error, clients){
    							if (error) throw error;
    							console.log(Object.keys(clients)); // => [Anw2LatarvGVVXEIAAAD]
    							return clients;
  							});
			console.log("get Users " + Object.keys(getUsers.name));*/
			//var getUsers =  get_users_by_room('/messages', room);
			//var getUsers = io.of('/messages').in(room).clients(function(error, clients){
    							//if (error) throw error;
    							//console.log(Object.keys(clients)); // => [Anw2LatarvGVVXEIAAAD]
    							//return clients;
  							//});


			//console.log("ids : " + Object.keys(getUsers.ids[0].username));
			//console.log("name : " + Object.keys(getUsers.name[0].username));
			//console.log("server : " + Object.keys(getUsers.server[0].username));
			/*console.log("connected : " + Object.keys(getUsers.connected[0].username));
			console.log("fns : " + Object.keys(getUsers.fns[0].username));
			console.log("adapter : " + Object.keys(getUsers.adapter[0].username));
			console.log("namespace : " + Object.keys(io.of('/messages').adapter.rooms[room].sockets));
			console.log("room : " + Object.keys(io.of('/messages').adapter.rooms[room]));
			console.log("room2 : " + io.of('/messages').adapter.rooms[room].sockets);
			console.log("clients " + io.sockets.clients(room));

			var clients_in_the_room = io.sockets.adapter.rooms[room]; 
			for (var clientId in io.of('/messages').adapter.rooms[room].sockets ) {
			  console.log('client:' + io.of('/messages').adapter.rooms[room].sockets[clientId]); //Seeing is believing 
			  var client_socket = io.sockets.connected[clientId];//Do whatever you want with this
			  console.log("client_socket " + client_socket);
			}*/

			//var clientsArray = io.of('/messages').adapter.rooms[room];
			//for (var id in clientsArray)
			//{
			//	console.log(getUsers.nsp.connected[id]);
			//}

			//console.log("clients " + Object.keys(io.nsps['/messages'].adapter.rooms[room]));
			getUsers = {};
			getUsers['user'] = {username : 'sahil', userPic : 'img'};


			var userList = [];

			for (var i in getUsers){
				userList.push({user : getUsers[i].username, userPic: getUsers[i].userPic })
			}
			socket.to(room).emit('updateUserList', JSON.stringify(userList));

			if(updateAll) {
				// we will broadcast. it will forcefully update
				socket.broadcast.to(room).emit('updateUserList', JSON.stringify(userList));
			} 
		}

		socket.on('updateList', function(data) {
			//console.log("at updateList event " + data.room); // working
			updateUserList(data.room)
		})
	})

}