
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const adminLink = document.getElementById('adminLink');
    const authLink = document.getElementById('authLink');
    if (currentUser) {   
        authLink.textContent = 'Đăng xuất';
        authLink.href = '#';
        if (currentUser.role === 'admin') {
            adminLink.style.display = 'block';
        }
        authLink.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.reload();
        });
    } else {
        adminLink.style.display = 'none';
        authLink.textContent = 'Đăng nhập';
        authLink.href = '/pages/auth/login.html';
    }
});
