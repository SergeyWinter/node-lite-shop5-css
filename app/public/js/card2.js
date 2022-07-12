// console.log('card2.js--работает');
// var old_patch = document.getElementById("proba1");
// console.log(old_patch);

function getCategoryList2() {
	fetch('/get-category-list',{
		method:'POST'
	}
	).then(function(responce){
		// console.log(responce);// для разработчика;проверяем статус сервера
		return responce.text()
	}
	// (body)что ответит сервер на запрос qon.query из app.js
	).then(function(body){
		// console.log(body);
		showCategoryList2(JSON.parse(body))
		// showCategoryList2(JSON.parse(body))

	})
}
function showCategoryList2(data){
	// console.log(data.length);
// let out = '<ul class="category-list"><li><a href="/">Main</a></li>';
let out2 = '<a class="nav-link show-nav active" aria-current="page" href="">Mains</a>';
// let out2 = '<button type="button" class="btn btn-primary show-nav">Каталог</button>';

// let out = '<h1>GGGGGGGGG</h1>';
for (let i = 0;i < data.length; i++){
	out2 += `<a class="nav-link" href="/cat?id=${data[i]['id']}">${data[i]['category']}</a>`;
}
document.querySelector('#proba1').innerHTML = out2;
}
getCategoryList2();
