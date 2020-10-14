// var base_url = "http://10.0.1.182/backendikan/";
const SERVER = "http://103.195.90.35:3300";
const LOCAL = "http://localhost";
// const LOCAL = "http://192.168.2.32";
var base_url = `${LOCAL}/backendikan/`;
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
const API_GET_PRODUK_DASHBOARD = base_url + "api/produk";
const API_DETAIL_PRODUK = API_GET_PRODUK_DASHBOARD + "/detail";
const API_GET_VARIASI_PRODUK = API_GET_PRODUK_DASHBOARD + "/variasi";
const API_CREATE_PRODUK = API_GET_PRODUK_DASHBOARD + "/add";
const API_UPDATE_PRODUK = API_GET_PRODUK_DASHBOARD + "/update";
const API_UPDATE_VARIASI_PRODUK = API_GET_PRODUK_DASHBOARD + "/variasi/update";
const API_ACTIVATE_PRODUK = API_GET_PRODUK_DASHBOARD + "/aktifkan";
const API_DISABLE_PRODUK = API_GET_PRODUK_DASHBOARD + "/non-aktifkan";
const API_SEARCH_PRODUK = API_GET_PRODUK_DASHBOARD + "-search";
const API_FILTERED_PRODUK = API_GET_PRODUK_DASHBOARD + "/filtered";
const API_GET_ALL_VARIASI = API_GET_PRODUK_DASHBOARD + "/all-variasi";

const API_USER_INSTANCE = base_url + "api/user";
const API_SIGN_UP_PENJUAL = API_USER_INSTANCE + "/signup/penjual";
const API_SIGN_UP_USAHA = API_USER_INSTANCE + "/signup/usaha";
const API_SIGN_UP_PEMBELI = API_USER_INSTANCE + "/signup/pembeli";
const API_ROLLBACK_SIGN_UP_PENJUAL = API_USER_INSTANCE + "/signup/rollback";
const API_LOGIN = API_USER_INSTANCE + "/login";
const API_LOGIN_KURIR = API_LOGIN + "-kurir";

const API_PENJUAL = API_USER_INSTANCE + "/penjual";
const API_PENJUAL_LOKASI = API_PENJUAL + "/lokasi";
const API_DETAIL_PENJUAL = API_PENJUAL + "/detail";
const API_UPDATE_PENJUAL = API_PENJUAL + "/update";
const API_GET_USAHA_BY_AKUN = API_PENJUAL + "/usaha/detail-by-akun";
const API_UPDATE_USAHA = API_PENJUAL + "/usaha/update";
const API_DETAIL_USAHA = API_PENJUAL + "/usaha/detail";

const API_KELOMPOK_TANI = API_PENJUAL + "/kelompok-tani";
const API_UPDATE_KELOMPOK_TANI = API_KELOMPOK_TANI + "/update";

const API_JAM_PENGIRIMAN = API_PENJUAL + "/jam-pengiriman";
const API_CREATE_JAM_PENGIRMAN = API_JAM_PENGIRIMAN + "/create";
const API_DETAIL_JAM_PENGIRIMAN = API_JAM_PENGIRIMAN + "/detail";
const API_UPDATE_JAM_PENGIRIMAN = API_JAM_PENGIRIMAN + "/update";
const API_DELETE_JAM_PENGIRIMAN = API_JAM_PENGIRIMAN + "/delete";

const API_KURIR = API_USER_INSTANCE + "/kurir";
const API_DETAIL_KURIR = API_KURIR + "/detail";
const API_CREATE_KURIR = API_KURIR + "/create";
const API_UPDATE_KURIR = API_KURIR + "/update";
const API_DELETE_KURIR = API_KURIR + "/delete";

const API_KENDARAAN_PENJUAL = API_PENJUAL + "/kendaraan";
const API_CREATE_KENDARAAN = API_KENDARAAN_PENJUAL + "/create";
const API_DETAIL_KENDARAAN = API_KENDARAAN_PENJUAL + "/detail";
const API_UPDATE_KENDARAAN = API_KENDARAAN_PENJUAL + "/update";
const API_DELETE_KENDARAAN = API_KENDARAAN_PENJUAL + "/delete";

const API_PEMBELI = API_USER_INSTANCE + "/pembeli";
const API_PEMBELI_UPDATE_ALAMAT = API_PEMBELI + "/update-alamat";
const API_PEMBELI_UPDATE = API_PEMBELI + "/update";
// var API_DETAIL_PEMBELI = API_PEMBELI + "/detail";


const API_REKENING = base_url + "api/rekening";
const API_REKENINIG_USAHA = API_REKENING + "-usaha"
const API_DETAIL_REKENING = API_REKENING + "/detail";
const API_CREATE_REKENING = API_REKENING + "/add";
const API_UPDATE_REKENING = API_REKENING + "/update";
const API_DELETE_REKENING = API_REKENING + "/delete";
const API_BANK_REKENING = API_REKENING + "/bank";

const API_PAYMENT_INSTANCE = base_url + "api/payment";
const API_UPLOAD_PAYMENT = API_PAYMENT_INSTANCE + "/upload";
const API_DETAIL_REKENING_PAYMENT_IN_HTML = API_PAYMENT_INSTANCE + "/rekening/detail/html";
const API_DETAIL_STRUK_PAYMENT = API_PAYMENT_INSTANCE + "/struk";
const API_VERIFY_PAYMENT = API_PAYMENT_INSTANCE + "/verify";

const API_PESANAN = base_url + "api/pesanan";
const API_PESANAN_PENJUAL = API_PESANAN + "/penjual";
const API_CREATE_PESANAN = API_PESANAN + "/create";
const API_PRODUK_TO_DELIVERY_PESANAN = API_PESANAN + "/produk-to-delivery";
const API_PESANAN_PRIORITY = API_PESANAN + "/pesanan-priority";
const API_PRODUK_NON_PRIORITY = API_PESANAN + "/pesanan-non-priority";
const API_PRODUK_TO_VERIFY_WEIGHT_PESANAN = API_PESANAN + "/produk-to-verify";
const API_VERIFY_PRODUK_PESANAN_PESANAN = API_PESANAN + "/verify-produk-weight";
const API_DETAIL_PESANAN_PENJUAL = API_PESANAN + "/detail-transaksi-by-id";
const API_DETAIL_PESANAN_PEMBELI = API_PESANAN + "/detail-pesanan-by-id";
const API_DETAIL_PESANAN_IN_HTML = API_PESANAN + "/detail-in-html";
const API_DETAIL_PESANAN_WITH_PAYMENT_IN_HTML = API_PESANAN + "/detail-with-payment/";
const API_PESANAN_SELESAI = API_PESANAN + '/complete';

const API_PENGIRIMAN = base_url + "api/pengiriman";

const API_TRACK = base_url + "api/track";
const API_END_TRACK = base_url + "api/detail-track";

const API_KERANJANG = base_url + "api/keranjang";
const API_UBAH_KERANJANG = API_KERANJANG + "/update";
const API_HAPUS_KERANJANG = API_KERANJANG + "/delete";
const API_HAPUS_PRODUK_KERANJANG = API_KERANJANG + "/delete-produk";
const API_DETAIL_KERANJANG = API_KERANJANG + "-detail";

function only_go_to(url_file="") {
  return location.replace(url_file);
}

function go_to(url_file="") {
  return location.href=url_file;
}

async function CALL_API(METHOD="GET", URL="", DATA=NULL) {
  return fetch(URL, {
    method: METHOD,
    body: DATA
  }).then(response=>{
    if(response.ok){
      response.json();
    }else{
      throw new Error("Failed");
    }
  });
}

async function GET_API(URL="", URL_PARAM) {
  return await fetch(URL + URL_PARAM).then(response=>response.json());
}

function POST_API(URL, DATA={}){
  return CALL_API("POST", URL, DATA);
}

function PUT_API(URL, DATA={}) {
  return CALL_API("PUT", URL, DATA);
}

function DELETE_API(URL, DATA={}) {
  return CALL_API("DELETE", URL, DATA);
}