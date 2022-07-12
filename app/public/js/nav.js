// console.log('nav.js');
document.querySelector('.close-nav').onclick = closeNav;
document.querySelector('.show-nav').onclick = showNav;

function closeNav() {
    document.querySelector('.site-nav').style.left = '-300px';
}
function showNav() {
    document.querySelector('.site-nav').style.left = '200px';
}

function getCategoryList() {
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
		showCategoryList(JSON.parse(body))
		// showCategoryList2(JSON.parse(body))

	})
}
function showCategoryList(data){
	// console.log(data[0]['category']);
let out = '<ul class="category-list"><li><a href="/">Main</a></li>';
// let out = '<a class="nav-link active" aria-current="page" href="/">Mains</a>';
// let out = '<h1>GGGGGGGGG</h1>';
for (let i = 0;i < data.length; i++){
	out += `<li><a href="/cat?id=${data[i]['id']}">${data[i]['category']}</a></li>`;
}
out += '</ul>';
//   в nav.pug
// let proba=document.querySelector('#category-list');
// console.dir(proba);
document.querySelector('#category-list').innerHTML = out;

// document.querySelector('#proba1').innerHTML ='<a>fffff</a>';
}


getCategoryList();
