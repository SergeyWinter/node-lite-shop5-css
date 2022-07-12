  function sendLogin() {
	// let dft = document.querySelector('#login').value;
	// console.log(dft);
	fetch('/login',{
	method:'POST',	
	body:JSON.stringify({
		'login':document.querySelector('#login').value,
		'password': document.querySelector('#password').value,
	}),
	headers:{
		'Accept': 'application/json',
		'Content-Type':'application/json'
	}	
	})
}
document.querySelector('form').onsubmit = function (event) {
	// отменяет перезагрузку
    event.preventDefault();
    sendLogin();
}