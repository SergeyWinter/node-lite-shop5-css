// console.log("работает using_page.js");
console.log(localStorage.getItem('cart'));
if (localStorage.getItem('cart')){
  cart = JSON.parse(localStorage.getItem('cart'));
  // console.log(cart);
  ajaxGetFousingPage();
}
// function gitscart(){
// 	fetch('/using_page',{
// 		method:'POST',
// 		body:JSON.stringify({
// 			'email': "hhhhhhhh",
// 			'password':"kkkkkkk"
// 		}),
// 		headers:{
// 			'Accept':'application/json',
// 			'Content-Type':'application/json'
// 		}
// 	})
// }
//gitscart();
