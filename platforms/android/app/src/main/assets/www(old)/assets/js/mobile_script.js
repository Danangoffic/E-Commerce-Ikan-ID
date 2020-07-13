var sukses_login = window.localStorage.getItem('sukses_login');
var username  = window.localStorage.getItem('username');
var usergroup = window.localStorage.getItem('usergroup');
$(".logged-name").html(username);
console.log('sukses_login' + window.localStorage.getItem('sukses_login'));


// if(sukses_login == 1) {
// 	window.location.href = "../dashboard/index.html";
// }
// if(username == ""){
// 	window.location.href = "../dashboard/index.html";
// }
var nav = '';
if(usergroup == 'penjual'){
	nav = "<a href=\"#\" class=\"br-menu-link\">"+
          "<div class=\"br-menu-item\">"+
            "<i class=\"fa fa-bank tx-22\"></i>"+
            "<span class=\"menu-item-label\">Usaha</span>"+
            "<i class=\"menu-item-arrow fa fa-angle-down\"></i>"+
          "</div>"+
        "</a>"+
        "<ul class=\"br-menu-sub nav flex-column\">"+
          "<li class=\"nav-item\"><a href=\"accordion.html\" class=\"nav-link\">Usaha Saya</a></li>"+
          "<li class=\"nav-item\"><a href=\"alerts.html\" class=\"nav-link\">Produk</a></li>"+
          "<li class=\"nav-item\"><a href=\"buttons.html\" class=\"nav-link\">Kurir</a></li>"+
          "<li class=\"nav-item\"><a href=\"cards.html\" class=\"nav-link\">Kendaraan</a></li>"+
        "</ul>"+
        "<!-- TRANSAKSI -->"+
        "<a href=\"#\" class=\"br-menu-link\">"+
          "<div class=\"br-menu-item\">"+
            "<i class=\"fa fa-dollar tx-22\"></i>"+
            "<span class=\"menu-item-label\">Transaksi</span>"+
          "</div>"+
        "</a>"+
        "<a class=\"br-menu-link\" href=\"../login/logout.html\">"+
	          "<div class=\"br-menu-item\">"+
	            "<i class=\"fa fa-power-offer tx-22\"></i>"+
	            "<span class=\"menu-item-label\">logout</span>"+
	          "</div>"+
	        "</a>";
}
else if(usergroup == "pembeli"){
	nav = "<a href=\"../penjual/profil.html\" class=\"br-menu-link\">"+
          "<div class=\"br-menu-item\">"+
            "<i class=\"fa fa-user tx-22\"></i>"+
            "<span class=\"menu-item-label\">Profil</span>"+
          "</div>"+
        "</a>"+
        "<a class=\"br-menu-link\" href=\"../login/logout.html\">"+
	          "<div class=\"br-menu-item\">"+
	            "<i class=\"fa fa-power-offer tx-22\"></i>"+
	            "<span class=\"menu-item-label\">logout</span>"+
	          "</div>"+
	        "</a>";
}else{
	nav = "<a class=\"br-menu-link\" href=\"../login\">"+
	          "<div class=\"br-menu-item\">"+
	            "<i class=\"fa fa-power-off tx-22\"></i>"+
	            "<span class=\"menu-item-label\">Sign In</span>"+
	          "</div>"+
	        "</a>"+
	        "<a class=\"br-menu-link\" href=\"../login/logout.html\">"+
	          "<div class=\"br-menu-item\">"+
	            "<i class=\"fa fa-power-offer tx-22\"></i>"+
	            "<span class=\"menu-item-label\">logout</span>"+
	          "</div>"+
	        "</a>";
}

$("#NavUser").prepend(nav);


$('#signout').click(signout);
function signout() {
	window.localStorage.setItem('sukses_login', 0);
	window.localStorage.setItem('usergroup', '');
	window.localStorage.setItem('usergroup', '');
	window.location.href = "../login/index.html";
}