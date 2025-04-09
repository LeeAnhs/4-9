function initializeAdmin() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const adminExists = users.some(user => user.role === 'admin');

    if (!adminExists) {
        users.push({
            fullname: 'admin',
            email: 'admin123@gmail.com',
            password: 'admin123',
            role: 'admin'
        });
        localStorage.setItem('users', JSON.stringify(users));
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    const inputName = elementId.replace('-error', '');
    const inputElement = document.querySelector(`input[name="${inputName}"]`);
    
    if (errorElement) {
        errorElement.textContent = message;
    }
    
    if (inputElement) {
        inputElement.classList.add('error-input');
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    const inputElements = document.querySelectorAll('input');
    
    errorElements.forEach(element => {
        element.textContent = '';
    });
    
    inputElements.forEach(input => {
        input.classList.remove('error-input');
    });
}

if (document.getElementById('registerForm')) {
    const registerForm = document.getElementById('registerForm');
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clearErrors();
        const fullname = this.fullname.value.trim();
        const email = this.email.value.trim();
        const password = this.password.value;
        const confirmPassword = this.confirmPassword.value;
        
        let hasError = false;
        
        if (!fullname) {
            showError('fullname-error', 'Họ và tên không được để trống');
            hasError = true;
        }
        
        if (!email) {
            showError('email-error', 'Email không được để trống');
            hasError = true;
        } else if (!isValidEmail(email)) {
            showError('email-error', 'Email không đúng định dạng');
            hasError = true;
        }
        
        if (!password) {
            showError('password-error', 'Mật khẩu không được để trống');
            hasError = true;
        } else if (password.length < 8) {
            showError('password-error', 'Mật khẩu phải có ít nhất 8 ký tự');
            hasError = true;
        }
        
        if (!confirmPassword) {
            showError('confirmPassword-error', 'Vui lòng xác nhận mật khẩu');
            hasError = true;
        } else if (password !== confirmPassword) {
            showError('confirmPassword-error', 'Mật khẩu không khớp');
            hasError = true;
        }
        
        if (!hasError) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            if (users.some(user => user.email === email)) {
                showError('email-error', 'Email đã được sử dụng');
                return;
            }
            
            users.push({
                fullname,
                email,
                password,
                role: 'user'
            });
            
            localStorage.setItem('users', JSON.stringify(users));
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Tài khoản đã được đăng ký thành công",
              showConfirmButton: false,
              timer: 1500,
            });
            localStorage.setItem('currentUser', JSON.stringify({
                fullname,
                email,
                password,
                role: 'user'
            }));
            
            if (email === 'admin123@gmail.com' && password === 'admin123') {
                window.location.href = '../admin/dashboard.html';
            } else {
                window.location.href = '../../index.html';
            }
        }
    });
}

if (document.getElementById('loginForm')) {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        clearErrors();
        
        const email = this.email.value.trim();
        const password = this.password.value;
        
        let hasError = false;
        
        if (!email) {
            showError('email-error', 'Email không được để trống');
            hasError = true;
        }
        
        if (!password) {
            showError('password-error', 'Mật khẩu không được để trống');
            hasError = true;
        }
        
        if (!hasError) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                if (user.role === 'admin') {
                    window.location.href = '../admin/dashboard.html';
                } else {
                    window.location.href = '../../index.html';
                }
            } else {
                showError('email-error', 'Email hoặc mật khẩu không đúng');
            }
        }
    });
}

initializeAdmin();
