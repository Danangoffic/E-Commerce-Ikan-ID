function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
    onDeviceReady();
    $("#btnsubmit").click(kirim_data);
    // $("form").submit(kirim_data);
}

function onDeviceReady() {
    // $("#btn-submit").click(kirim_data);
    // document.querySelector(".submit").addEventListener("click", kirim_data, true);
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
    document.addEventListener("menubutton", onMenuKeyDown, false);
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
// $('#btn-submit').click(kirim_data);
function kirim_data() {
    event.preventDefault();
    var username = $('#username').val();
    var password = $('#password').val();
    // alert('button sign in diklik' +username+" pass : " +password);

    const ULR_LOGIN = base_url + 'api/user/login';
    $.ajax({
        url: ULR_LOGIN,
        // data: 'username=' + username + '&password=' + password, 
        data: { username: username, password: password },
        type: 'POST',
        dataType: 'json',
        success: function (resp) {
            console.log('muncul di console');
            console.log(resp.status);
            if (resp.status == 'berhasil') {
                M.toast({ html: 'Anda berhasil masuk!' });
                // alert('Anda berhasil masuk');
                window.localStorage.setItem('sukses_login', '1');
                window.localStorage.setItem('username', username);
                window.localStorage.setItem('usergroup', resp.usergroup);
                window.localStorage.setItem('id_akun', resp.id_akun);
                window.localStorage.setItem('jenis_petani', resp.jenis_petani);
                if (localStorage.usergroup == "penjual") {
                    localStorage.setItem("id_usaha", resp.data_usaha.id_usaha);
                    localStorage.setItem("data_usaha", JSON.stringify(resp.data_usaha));
                }
                var keranjang = JSON.stringify(Array());
                window.localStorage.setItem('keranjang', JSON.parse(keranjang));
                console.log(window.localStorage.getItem(usergroup));
                console.log(window.localStorage.getItem(username));
                setTimeout(redirectPage, 1000);
            } else {
                M.toast({ html: 'Anda gagal masuk' });
            }
        }
    });
}

function redirectPage() {
    var usergroup = window.localStorage.getItem('usergroup');
    if (usergroup == "penjual") {
        window.location.href = "../penjual/index.html";
    } else if (usergroup == "pembeli") {
        window.location.href = "../pembeli/index.html";
    }
}
console.log('sukses_login' + window.localStorage.getItem('sukses_login'));