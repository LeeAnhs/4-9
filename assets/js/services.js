document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const adminLink = document.querySelector('#adminLink');
    const authLink = document.querySelector('#authLink');
    if (adminLink && authLink) {
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
    }
    initializeServices();
    if (document.getElementById('servicesTableBody')) {
        updateServicesTable();
    }
});

function initializeServices() {
    let services = JSON.parse(localStorage.getItem('services') || '[]');
    if (services.length === 0) {
        const defaultServices = [
            {
                id: '1',
                name: 'Gym',
                description: 'Tập luyện với các thiết bị hiện đại',
                image: 'https://t3.ftcdn.net/jpg/05/62/71/86/360_F_562718625_BM93noP9JDAR8kiBPfRy0h4WTvUwYXNH.jpg'
            },
            {
                id: '2',
                name: 'Yoga',
                description: 'Thư giãn và cân bằng tâm trí',
                image: 'https://static.vecteezy.com/system/resources/previews/023/221/657/non_2x/yoga-day-banner-design-file-vector.jpg'
            },
            {
                id: '3',
                name: 'Zumba',
                description: 'Đốt cháy calories với những điệu nhảy sôi động',
                image: 'https://img.freepik.com/free-psd/zumba-lifestyle-banner-template_23-2149193901.jpg'
            }
        ];
        localStorage.setItem('services', JSON.stringify(defaultServices));
    }
}

function updateServicesTable() {
    const tbody = document.getElementById('servicesTableBody');
    if (!tbody) return;

    const services = JSON.parse(localStorage.getItem('services') || '[]');
    if (services.length > 0) {
        tbody.innerHTML = services.map(service => `
            <tr>
                <td>${service.name}</td>
                <td>${service.description}</td>
                <td>
                    <img src="${service.image}" alt="${service.name}" class="w-20 h-20 object-cover rounded"/>
                </td>
                <td>
                    <button onclick="editService('${service.id}')" class="text-blue-600 hover:text-blue-800 mr-2">
                        Sửa
                    </button>
                    <button onclick="openDeleteModal('${service.id}')" class="text-red-600 hover:text-red-800">
                        Xóa
                    </button>
                </td>
            </tr>
        `).join('');
    } else {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-4">Không có dịch vụ nào</td>
            </tr>
        `;
    }
}

function openServiceModal() {
    const modal = document.getElementById('serviceModal');
    const form = document.getElementById('serviceForm');
    const modalTitle = document.getElementById('modalTitle');
    if (form) form.reset();
    if (modalTitle) modalTitle.textContent = 'Thêm dịch vụ mới';
    document.getElementById('serviceId').value = '';
    if (modal) modal.style.display = 'flex';
    clearErrorMessages();
}

function closeServiceModal() {
    const modal = document.getElementById('serviceModal');
    if (modal) modal.style.display = 'none';
}

function clearErrorMessages() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
}

function editService(id) {
    const services = JSON.parse(localStorage.getItem('services') || '[]');
    const service = services.find(s => s.id === id);
    if (!service) return;

    const modal = document.getElementById('serviceModal');
    const form = document.getElementById('serviceForm');
    const modalTitle = document.getElementById('modalTitle');
    if (form) {
        form.name.value = service.name;
        form.description.value = service.description;
        form.image.value = service.image;
        form.id.value = service.id;
    }
    if (modalTitle) modalTitle.textContent = 'Chỉnh sửa dịch vụ';
    if (modal) modal.style.display = 'flex';
    clearErrorMessages();
}

document.addEventListener('DOMContentLoaded', function() {
    const serviceForm = document.getElementById('serviceForm');
    if (serviceForm) {
        serviceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            
            const name = this.name.value.trim();
            const description = this.description.value.trim();
            const image = this.image.value.trim();
            
            if (!name) {
                document.getElementById('name-error').textContent = 'Vui lòng nhập tên dịch vụ';
                isValid = false;
            } else {
                document.getElementById('name-error').textContent = '';
            }
            
            if (!description) {
                document.getElementById('description-error').textContent = 'Vui lòng nhập mô tả';
                isValid = false;
            } else {
                document.getElementById('description-error').textContent = '';
            }
            
            if (!image) {
                document.getElementById('image-error').textContent = 'Vui lòng nhập URL hình ảnh';
                isValid = false;
            } else {
                try {
                    new URL(image);
                    document.getElementById('image-error').textContent = '';
                } catch (e) {
                    document.getElementById('image-error').textContent = 'URL không hợp lệ';
                    isValid = false;
                }
            }
            
            if (!isValid) return;

            const formData = new FormData(this);
            const serviceData = {
                id: formData.get('id') || Date.now().toString(),
                name: formData.get('name'),
                description: formData.get('description'),
                image: formData.get('image')
            };

            let services = JSON.parse(localStorage.getItem('services') || '[]');

            if (formData.get('id')) {
                const index = services.findIndex(s => s.id === formData.get('id'));
                if (index !== -1) {
                    services[index] = serviceData;
                }
            } else {
                services.push(serviceData);
            }

            localStorage.setItem('services', JSON.stringify(services));
            
            updateServicesTable();
            
            closeServiceModal();

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: formData.get('id') ? "Cập nhật dịch vụ thành công" : "Thêm dịch vụ thành công",
                showConfirmButton: false,
                timer: 1500
            });
        });
    }
});

function openDeleteModal(id) {
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.dataset.serviceId = id;
    }
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.style.display = 'none';
        modal.dataset.serviceId = '';
    }
}

function confirmDelete() {
    const modal = document.getElementById('deleteModal');
    const id = modal.dataset.serviceId;
    if (!id) return;

    let services = JSON.parse(localStorage.getItem('services') || '[]');
    services = services.filter(service => service.id !== id);
    localStorage.setItem('services', JSON.stringify(services));

    updateServicesTable();
    closeDeleteModal();

    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Xóa dịch vụ thành công",
        showConfirmButton: false,
        timer: 1500
    });
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../../index.html';
}