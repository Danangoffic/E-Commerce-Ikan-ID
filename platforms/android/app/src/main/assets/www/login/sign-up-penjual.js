// $(document).ready(onDeviceReady);
function onBackKeyDown() {
    window.localStorage.removeItem("dataProfile");
    window.location.assign("akun.html");
}
function onLoad() {
    $(".modal").modal();
    $('.datepicker').datepicker({
        format: "yyyy-mm-dd"
    });
    document.addEventListener("deviceready", onDeviceReady, false);
}

// device APIs are available
//
function onDeviceReady() {

    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
    document.addEventListener("menubutton", onMenuKeyDown, false);
    document.getElementById("simpan").addEventListener("click", simpan, false);
    // $("#").click(simpan);
    // Add similar listeners for other events
}

function onPause() {
    // Handle the pause event
}

function onResume() {
    // Handle the resume event
}

function onMenuKeyDown() {
    // Handle the menubutton event
}

function simpan() {
    var nama_pj = $("[name=nama_pj]").val();
    var noktp_pj = $("[name=noktp_pj]").val();
    var jk_pj = $("[name=jk_pj]:radio:checked").val();
    var tgllahir_pj = $("[name=tgllahir_pj]").val();
    var telp_pj = $("[name=telp_pj]").val();
    var alamat_pj = $("[name=alamat_pj]").val();
    if (nama_pj == "" || nama_pj == null) {
        toasting("Nama");
        return false;
    }

    if (noktp_pj == "" || noktp_pj == null) {
        toasting("Nomot Ktp");
        return false;
    }

    if (tgllahir_pj == "" || tgllahir_pj == null) {
        toasting("Tanggal Lahir");
        return false;
    }

    if (telp_pj == "" || telp_pj == null) {
        toasting("Nomor Telepon");
        return false;
    }
    var formData = new FormData($("form")[0]);
    const URL_SIGN_UP_PENJUAL = base_url + "api/user/signup/penjual";
    $.ajax({
        url: URL_SIGN_UP_PENJUAL,
        data: formData,
        contentType: false,
        cache: false,
        processData: false,
        type: 'POST',
        dataType: 'json',
        success: function (resp) {
            if (resp.status == 'sukses') {
                localStorage.setItem("id_akun", resp.id_akun);
                // alert('Selamat, Anda Berhasil Mendaftar');
                M.toast({ html: "Berhasil Tambahkan Data Anda Sebagai Penjual" });
                setTimeout(function () { location.replace('form-usaha.html') }, 1000);
            } else {
                // alert('Data gagal disimpan');
                M.toast({ html: "Gagal Ubah Profile" });
            }
        },
        error: function (error) {
            M.toast({ html: "Gagal Ubah Profile" });
        }
    });

}

function toasting(item) {
    $("#modal1").modal("close");
    M.toast({ html: item + " anda kosong, mohon diisi" });
}