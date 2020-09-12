// var base_url = "http://10.0.1.182/backendikan/";
const SERVER = "http://103.195.90.35:3300";
const LOCAL = "http://localhost";
// var base_url = "http://192.168.100.103/backendikan/";
var base_url = `${SERVER}/backendikan/`;
// console.log("App IN : " + navigator.appCodeName);
//  var base_url = "http://localhost/backendikan/";
// var base_url = "http://192.168.43.71/backendikan/";

var storage = window.localStorage;

if (storage.sukses_login == null || storage.sukses_login == "") {
  storage.sukses_login = 0;
}
var sukses_login = window.localStorage.getItem('sukses_login');

if (storage.username == null) {
  storage.username = "";
}
var username = window.localStorage.getItem('username');


if (storage.getItem('usergroup') == null) {
  storage.usergroup = "";
} else if (storage.usergroup == "pembeli") {


  if (storage.getItem('keranjang') == null || storage.getItem('keranjang') == "") {
    var stor_keranjang = [];
    storage.setItem('keranjang', JSON.stringify(stor_keranjang));
  }
  if (storage.getItem('keranjang') == "" || storage.getItem('keranjang') == null) {
    var stor_keranjang = [];
    storage.setItem('keranjang', JSON.stringify(stor_keranjang));
  }

  var keranjang = storage.getItem('keranjang');
  var parse_keranjang = JSON.parse(keranjang);
  var total_keranjang = (JSON.parse(keranjang).length) ? JSON.parse(keranjang).length : 0;
  if (total_keranjang > 0) {
    $(".krjg, #status_keranjang").addClass('tx-danger');
    $("#status_keranjang").html(JSON.parse(keranjang).length);
  } else {
    $("#status_keranjang").html("0");
  }
}
var usergroup = storage.getItem('usergroup');


if (storage.id_akun == null) {
  storage.id_akun = "";
}
var id_akun = window.localStorage.getItem('id_akun');


if (storage.jenis_petani == null) {
  storage.jenis_petani = "";
}
var jenis_petani = window.localStorage.getItem('jenis_petani');


$(".logged-name").html(username);
console.log('sukses_login' + sukses_login);
console.log('usergroup' + usergroup);
console.log('username' + username);
console.log('id_akun: ' + id_akun);

if(localStorage.total_item_keranjang=="undefined"){
  var total_item_keranjang = 0;
  localStorage.setItem("total_item_keranjang", total_item_keranjang);
}
if(localStorage.keranjang=="undefined"){
  var keranjang = "[]";
  localStorage.setItem("keranjang", keranjang);
}
if (usergroup == "pembeli") {
  $("#totalBasket").text(localStorage.total_item_keranjang);
}
// if(sukses_login == 1) {
//  window.location.href = "../dashboard/index.html";
// }
// if(username == ""){
//  window.location.href = "../dashboard/index.html";
// }


$('#signout').click(signout);
function signout() {
  window.localStorage.setItem('sukses_login', 0);
  window.localStorage.setItem('username', '');
  window.localStorage.setItem('usergroup', '');
  window.location.href = "../login/index.html";
}

function openBasket() {
  return window.location.href = "../pembeli/keranjang.html";
}

$(function () {

  // showing modal with effect
  $('.modal-effect').on('click', function () {
    var effect = $(this).attr('data-effect');
    $('#modaldemo8').addClass(effect, function () {
      $('#modaldemo8').modal('show');
    });
    return false;
  });

  // hide modal with effect
  $('#modaldemo8').on('hidden.bs.modal', function (e) {
    $(this).removeClass(function (index, className) {
      return (className.match(/(^|\s)effect-\S+/g) || []).join(' ');
    });
  });
});

function checkConnection() {
  var networkState = navigator.connection.type;

  var states = {};
  states[Connection.UNKNOWN] = 'Unknown connection';
  states[Connection.ETHERNET] = 'Ethernet connection';
  states[Connection.WIFI] = 'WiFi connection';
  states[Connection.CELL_2G] = 'Cell 2G connection';
  states[Connection.CELL_3G] = 'Cell 3G connection';
  states[Connection.CELL_4G] = 'Cell 4G connection';
  states[Connection.CELL] = 'Cell generic connection';
  states[Connection.NONE] = 'No network connection';

  alert('Connection type: ' + states[networkState]);
  console.log('Connection type: ' + states[networkState]);
}

// URL API's READY TO CALL
var API_GET_PRODUK_DASHBOARD = base_url + "api/produk";
var API_DETAIL_PRODUK = API_GET_PRODUK_DASHBOARD + "/detail";
var API_GET_VARIASI_PRODUK = API_GET_PRODUK_DASHBOARD + "/variasi";
var API_CREATE_PRODUK = API_GET_PRODUK_DASHBOARD + "/add";
var API_UPDATE_PRODUK = API_GET_PRODUK_DASHBOARD + "/update";
var API_UPDATE_VARIASI_PRODUK = API_GET_PRODUK_DASHBOARD + "/variasi/update";
var API_ACTIVATE_PRODUK = API_GET_PRODUK_DASHBOARD + "/aktifkan";
var API_DISABLE_PRODUK = API_GET_PRODUK_DASHBOARD + "/non-aktifkan";
var API_SEARCH_PRODUK = API_GET_PRODUK_DASHBOARD + "/search";
var API_FILTERED_PRODUK = API_GET_PRODUK_DASHBOARD + "/filtered";
var API_GET_ALL_VARIASI = API_GET_PRODUK_DASHBOARD + "/all-variasi";

var API_USER_INSTANCE = base_url + "api/user";
var API_SIGN_UP_PENJUAL = API_USER_INSTANCE + "/signup/penjual";
var API_SIGN_UP_USAHA = API_USER_INSTANCE + "/signup/usaha";
var API_SIGN_UP_PEMBELI = API_USER_INSTANCE + "/signup/pembeli";
var API_ROLLBACK_SIGN_UP_PENJUAL = API_USER_INSTANCE + "/signup/rollback";
var API_LOGIN = API_USER_INSTANCE + "/login";
var API_LOGIN_KURIR = API_LOGIN + "-kurir";

var API_PENJUAL = API_USER_INSTANCE + "/penjual";
var API_PENJUAL_LOKASI = API_PENJUAL + "/lokasi";
var API_DETAIL_PENJUAL = API_PENJUAL + "/detail";
var API_UPDATE_PENJUAL = API_PENJUAL + "/update";
var API_GET_USAHA_BY_AKUN = API_PENJUAL + "/usaha/detail-by-akun";
var API_UPDATE_USAHA = API_PENJUAL + "/usaha/update";
var API_DETAIL_USAHA = API_PENJUAL + "/usaha/detail";

var API_KELOMPOK_TANI = API_PENJUAL + "/kelompok-tani";
var API_UPDATE_KELOMPOK_TANI = API_KELOMPOK_TANI + "/update";

var API_JAM_PENGIRIMAN = API_PENJUAL + "/jam-pengiriman";
var API_CREATE_JAM_PENGIRMAN = API_JAM_PENGIRIMAN + "/create";
var API_DETAIL_JAM_PENGIRIMAN = API_JAM_PENGIRIMAN + "/detail";
var API_UPDATE_JAM_PENGIRIMAN = API_JAM_PENGIRIMAN + "/update";
var API_DELETE_JAM_PENGIRIMAN = API_JAM_PENGIRIMAN + "/delete";

var API_KURIR = API_USER_INSTANCE + "/kurir";
var API_DETAIL_KURIR = API_KURIR + "/detail";
var API_CREATE_KURIR = API_KURIR + "/create";
var API_UPDATE_KURIR = API_KURIR + "/update";
var API_DELETE_KURIR = API_KURIR + "/delete";

var API_KENDARAAN_PENJUAL = API_PENJUAL + "/kendaraan";
var API_CREATE_KENDARAAN = API_KENDARAAN_PENJUAL + "/create";
var API_DETAIL_KENDARAAN = API_KENDARAAN_PENJUAL + "/detail";
var API_UPDATE_KENDARAAN = API_KENDARAAN_PENJUAL + "/update";
var API_DELETE_KENDARAAN = API_KENDARAAN_PENJUAL + "/delete";

var API_PEMBELI = API_USER_INSTANCE + "/pembeli";
var API_PEMBELI_UPDATE_ALAMAT = API_PEMBELI + "/update-alamat";
var API_PEMBELI_UPDATE = API_PEMBELI + "/update";
// var API_DETAIL_PEMBELI = API_PEMBELI + "/detail";


var API_REKENING = base_url + "api/rekening";
var API_REKENINIG_USAHA = API_REKENING + "-usaha"
var API_DETAIL_REKENING = API_REKENING + "/detail";
var API_CREATE_REKENING = API_REKENING + "/add";
var API_UPDATE_REKENING = API_REKENING + "/update";
var API_DELETE_REKENING = API_REKENING + "/delete";
var API_BANK_REKENING = API_REKENING + "/bank";

var API_PAYMENT_INSTANCE = base_url + "api/payment";
var API_UPLOAD_PAYMENT = API_PAYMENT_INSTANCE + "/upload";
var API_DETAIL_REKENING_PAYMENT_IN_HTML = API_PAYMENT_INSTANCE + "/rekening/detail/html";
var API_DETAIL_STRUK_PAYMENT = API_PAYMENT_INSTANCE + "/struk";
var API_VERIFY_PAYMENT = API_PAYMENT_INSTANCE + "/verify";

var API_PESANAN = base_url + "api/pesanan";
var API_PESANAN_PENJUAL = API_PESANAN + "/penjual";
var API_CREATE_PESANAN = API_PESANAN + "/create";
var API_PRODUK_TO_DELIVERY_PESANAN = API_PESANAN + "/produk-to-delivery";
var API_PESANAN_PRIORITY = API_PESANAN + "/pesanan-priority";
var API_PRODUK_NON_PRIORITY = API_PESANAN + "/pesanan-non-priority";
var API_PRODUK_TO_VERIFY_WEIGHT_PESANAN = API_PESANAN + "/produk-to-verify";
var API_VERIFY_PRODUK_PESANAN_PESANAN = API_PESANAN + "/verify-produk-weight";
var API_DETAIL_PESANAN_PENJUAL = API_PESANAN + "/detail-transaksi-by-id";
var API_DETAIL_PESANAN_PEMBELI = API_PESANAN + "/detail-pesanan-by-id";
var API_DETAIL_PESANAN_IN_HTML = API_PESANAN + "/detail-in-html";
var API_DETAIL_PESANAN_WITH_PAYMENT_IN_HTML = API_PESANAN + "/detail-with-payment/";
var API_PESANAN_SELESAI = API_PESANAN + '/complete';

var API_KERANJANG = base_url + "api/keranjang";
var API_UBAH_KERANJANG = API_KERANJANG + "/update";
var API_HAPUS_KERANJANG = API_KERANJANG + "/delete";