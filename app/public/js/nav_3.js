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
		console.log(body);
		showCategoryList(JSON.parse(body))
		// showCategoryList2(JSON.parse(body))
	})

}
function showCategoryList(data){
	// console.log(data[0]['category']);
// let out = '<ul class="list-group"><li><a class="list-group-item" href="/">Main</a></li>';
let out = '<div class="accordion-item"><h2 class="accordion-header" id="panelsStayOpen-headingTwo"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">Main</h2><div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo"><div class="accordion-body">will be text</div></div></div>';
// let out = '<a class="nav-link active" aria-current="page" href="/">Mains</a>';
// let out = '<h1>GGGGGGGGG</h1>';
for (let i = 0;i < data.length; i++){
	// out += `<li><a class="list-group-item" href="/cat?id=${data[i]['id']}">${data[i]['category']}</a></li>`;
	out += `<div class="accordion-item">
	         <h2 class="accordion-header" id="${data[i]['id']}">
	          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${data[i]['category']}" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">${data[i]['category']}
	         </h2>
	         <div id="${data[i]['category']}" class="accordion-collapse collapse" aria-labelledby="${data[i]['id']}">
	          <div class="accordion-body">
	           <a class="list-group-item" href="/cat?id=${data[i]['id']}">wil be ssilka</a>
	          </div>
	         </div>
	        </div>`;
}
// out += '</ul>';
//   в nav.pug
// let proba=document.querySelector('#category-list');
// console.dir(proba);
document.querySelector('#category-list').innerHTML = out;

// document.querySelector('#proba1').innerHTML ='<a>fffff</a>';
}


getCategoryList();
// let scril=(document.body.scrollTop);
// if (scril>120) {
// alert('hjjkhfkjdhfjkdhfjk');	
// }
console.log(window.pageYOffset);
let MyHeaderTop = $('.navbar').offset().top;
// console.log(MyHeaderTop);
$(window).scroll(function(){
	let jhj = $(window).scrollTop();
  // console.log(jhj);
  // console.log(MyHeaderTop);
	let two = $('.navbar');
	if (jhj>=MyHeaderTop) {
		two.addClass('fixed-top');
	}else{
		two.removeClass('fixed-top');
	}
  // if (jhj<=jhj) {two.addClass('fixed-top collu');
// }	
})