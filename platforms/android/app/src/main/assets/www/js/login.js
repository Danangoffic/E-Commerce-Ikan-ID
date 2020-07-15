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
                M.toast({ html: 'Anda berhasil masuk!' });
                // alert('Anda berhasil masuk');
                //   window.location.reload();
                setTimeout(function(){location.reload()}, 1000);
            } else {
                M.toast({ html: 'Anda gagal masuk' });
            }
        }
    });
}