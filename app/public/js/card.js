console.log('работает кардюж-card.js');
let cart = {};
let myCookie=document.cookie;
// console.log(myCookie);
//для получения личн.данных Лена..
function getPersonaly(){
fetch('/get-pers',{
  method:'POST'
}
).then(function(response){
    // console.log(response);
    return response.text()
}
).then(function(body){
    // console.log(body);
    showPerson(JSON.parse(body));
    // console.log(lklkg[0]['name']);
  })
}
getPersonaly();
function showPerson(body){
let bhj=document.getElementById('myBody');
bhj.childNodes[0].nodeValue=body[0]['name'];
}
// let bhj=document.getElementById('myBody');
// bhj.childNodes[0].nodeValue=myCookie;
// console.log(bhj.childNodes[0].nodeValue);
// console.log(bhj);
// bhj.value="klklklklklklklkl";

// вешаем событие на кнопку;урок 12
document.querySelectorAll('.add-to-card').forEach(function(element){
element.onclick	= addToCart;
});
if (localStorage.getItem('cart')){
  cart = JSON.parse(localStorage.getItem('cart'));
  // console.log(cart);
  ajaxGetGoodsInfo();
}

function addToCart(){
	// получаем id тоаара из data-goods_id card.pug 
	let goodsId = this.dataset.goods_id;
	// далее добавляем количество товаров если cart[goodsId]сущ,то..
	// console.log(goodsId);
	if (cart[goodsId]) {
		cart[goodsId]++;
	}else{
		cart[goodsId] = 1;
	}
	// { 5: 2, 6: 1 }например
	console.log(cart);
	// console.log(Object.keys(cart));
	ajaxGetGoodsInfo();
}
// Посылаем запрос методом фетч на сервер
function ajaxGetGoodsInfo(){
  updateLocalStorageCart();
	fetch('/get-goods-info',{ 
		method: 'POST',
		body: JSON.stringify({key: Object.keys(cart)}),
		headers:{
			'Accept':'application/json',
			'Content-Type':'application/json'
		}
	})
	.then(function(response){
		// console.log(response);
		return response.text();
	})
	.then(function(body){
		// console.log(JSON.parse(body));
    // console.log(body);
    showCart(JSON.parse(body));
	})
}
// Data-то что влетело в body
function showCart(data) {
let out = '<table class="table table-striped table-cart"><tbody>';
let total = 0;
// cart берется из 19 строки функции addToCart
  for (let key in cart){
  	// console.log(data[key]['cost']);
  out +=`<tr><td colspan="4"><a href="/goods?id=${key}">${data[key]['name']}</a></td></tr>`;
  out += `<tr><td><i class="far fa-minus-square cart-minus" data-goods_id="${key}">-</i></td>`;
  // cart[key]-количество
  out += `<td>${cart[key]}</td>`;
  out += `<td><i class="far fa-plus-square cart-plus" data-goods_id="${key}">+</i></td>`;
  out +=`<td>${data[key]['cost']*cart[key] } rub </td>`
  out +=`</tr>`
  total += cart[key]*data[key]['cost'];
}
  out += `<tr><td colspan="3">Total: </td><td>${formatPrice(total)} rub</td></tr>`;
  out += '</tbody></table>';
  document.querySelector('#cart-nav').innerHTML = out;
  document.querySelectorAll('.cart-minus').forEach(function(element){
  	element.onclick = cartMinus;
  })
  document.querySelectorAll('.cart-plus').forEach(function(element){
  	element.onclick = cartPlus;
  })
}
// start showCart2//////////////////////////

// end  showCart2///////////////////////////
function cartPlus() {
  let goodsId = this.dataset.goods_id;
  cart[goodsId]++;
  // И обновляем карзину
  ajaxGetGoodsInfo();
}
function cartMinus() {
  let goodsId = this.dataset.goods_id;
  if (cart[goodsId] -1 > 0){
    cart[goodsId]--;
    // cart = {};
    // localStorage.clear();
  }
  else {
    delete(cart[goodsId]);
    // localStorage.clear();
    // и тогда key: из запроса строки 28 будет пустая!!!
  }
  // console.log(cart[goodsId]);
  // И обновляем карзину
  ajaxGetGoodsInfo();
}
// Выводим в nav.pug

// LocalStorage позволяют хранить пары ключ/значение в браузере.
function updateLocalStorageCart(){
  localStorage.setItem('cart', JSON.stringify(cart));
}
// Из card.pug 9 line 
function formatPrice(price) {
  return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ');
}



