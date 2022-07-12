function verification(){
	fetch('/login_user',{
		method:'POST',
		body:JSON.stringify({
			'email':document.querySelector('#exampleInputEmail1').value,
			'password':document.querySelector('#exampleInputPassword1').value
		}),
		headers:{
			'Accept':'application/json',
			'Content-Type':'application/json'
		}
	})
}
document.querySelector('form').onsubmit=function(event){
	event.preventDefault();
	verification();
}
