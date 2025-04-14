document.addEventListener('DOMContentLoaded', function() {
    const schedules = JSON.parse(localStorage.getItem('schedules')) || [];

    const gymCount = document.querySelector('.stat-box:nth-child(1) strong');
    const yogaCount = document.querySelector('.stat-box:nth-child(2) strong');
    const zumbaCount = document.querySelector('.stat-box:nth-child(3) strong');

    const classFilter = document.getElementById('class');
    const emailFilter = document.getElementById('email');
    const dateFilter = document.getElementById('date');
    const filterBtn = document.querySelector('.filter-btn');
    const tableBody = document.querySelector('tbody');
    
    const editPopup = document.getElementById('editPopup');
    const editForm = document.getElementById('editForm');
    const cancelEditBtn = document.getElementById('cancelEdit');
    
    const deletePopup = document.getElementById('deletePopup');
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    const cancelDeleteBtn = document.getElementById('cancelDelete');
    
    let currentScheduleId = null;

    function updateStats() {
        const stats = schedules.reduce((acc, schedule) => {
            switch(parseInt(schedule.classId)) {
                case 1: 
                    acc.gym++;
                    break;
                case 3: 
                    acc.yoga++;
                    break;
                case 2: 
                    acc.zumba++;
                    break;
            }
            return acc;
        }, { gym: 0, yoga: 0, zumba: 0 });

        gymCount.textContent = stats.gym;
        yogaCount.textContent = stats.yoga;
        zumbaCount.textContent = stats.zumba;
    }

    function getClassName(classId) {
        switch (parseInt(classId)) {
            case 1: return 'GYM';
            case 2: return 'Zumba';
            case 3: return 'Yoga';
            default: return 'Unknown';
        }
    }
  function validateScheduleData(formData) {
    const errors = [];
    
    const nameValue = formData.get('userId');
    if (!nameValue || nameValue.trim() === '') {
        Swal.fire({
            position: "top-center",
            icon: "error",
            title: "Vui lòng nhập họ tên",
            showConfirmButton: false,
            timer: 1500,
        });
        errors.push("Họ tên không được để trống");
        return errors; 
    } else {
        const nameRegex = /^[A-Za-zÀ-ỹ]+(?:\s[A-Za-zÀ-ỹ]+)*$/;
        if (!nameRegex.test(nameValue)) {
            Swal.fire({
                position: "top-center",
                icon: "error",
                title: "Họ tên không hợp lệ",
                showConfirmButton: false,
                timer: 1500,
            });
            errors.push("Họ tên không hợp lệ");
            return errors; 
        }
    }

    const emailValue = formData.get('email');
    if (!emailValue || emailValue.trim() === '') {
        Swal.fire({
            position: "top-center",
            icon: "error",
            title: "Vui lòng nhập email",
            showConfirmButton: false,
            timer: 1500,
        });
        errors.push("Email không được để trống");
        return errors; 
    } else {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(emailValue)) {
            Swal.fire({
                position: "top-center",
                icon: "error",
                title: "Email không hợp lệ",
                showConfirmButton: false,
                timer: 1500,
            });
            errors.push("Email không hợp lệ");
            return errors; 
        }
    }
    return errors;
}

editForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const errors = validateScheduleData(formData);
    
  
    if (errors.length > 0) {
        
        return; 
    }
    
    const updatedSchedule = {
        id: formData.get('id'),
        classId: parseInt(formData.get('classId')),
        date: formData.get('date'),
        time: formData.get('time'),
        userId: formData.get('userId').trim(),
        email: formData.get('email').trim()
    };
    
    const index = schedules.findIndex(schedule => schedule.id == updatedSchedule.id);
    if (index !== -1) {
        schedules[index] = updatedSchedule;
        saveSchedules();
        editPopup.style.display = 'none';
        Swal.fire({
            position: "top-center",
            icon: "success",
            title: "Lịch tập cập nhật thành công",
            showConfirmButton: false,
            timer: 1500,
        });  
    }
});
    function loadStatistics() {
        const schedules = JSON.parse(localStorage.getItem("schedules")) || [];
        let gymCount = 0,
            yogaCount = 0,
            zumbaCount = 0;
        schedules.forEach((s) => {
            switch (parseInt(s.classId)) {
                case 1:
                    gymCount++;
                    break;
                case 3:
                    yogaCount++;
                    break;
                case 2:
                    zumbaCount++;
                    break;
            }
        });

        document.querySelector(
            ".stat-box:nth-child(1) strong"
        ).textContent = gymCount;
        document.querySelector(
            ".stat-box:nth-child(2) strong"
        ).textContent = yogaCount;
        document.querySelector(
            ".stat-box:nth-child(3) strong"
        ).textContent = zumbaCount;

        const chartCanvas = document.getElementById("classChart");
        if (chartCanvas) {
            const chartInstance = Chart.getChart(chartCanvas);
            if (chartInstance) {
                chartInstance.destroy();
            }
        }

        new Chart(
            chartCanvas.getContext("2d"),
            {
                type: "bar",
                data: {
                    labels: ["Gym", "Yoga", "Zumba"],
                    datasets: [
                        {
                            label: "Số lượng lịch tập",
                            data: [gymCount, yogaCount, zumbaCount],
                            backgroundColor: [
                                "#3498db",
                                "#2ecc71",
                                "#e74c3c",
                            ],
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { stepSize: 1 },
                        },
                        x: {
                            grid: {
                                display: false,
                            },
                        },
                    },
                    barPercentage: 0.7, 
                    categoryPercentage: 0.8,
                },
            }
        );
    }
    
    function findScheduleById(id) {
        return schedules.find(schedule => schedule.id == id);
    }
    
    function populateEditForm(schedule) {
        document.getElementById('scheduleId').value = schedule.id;
        document.getElementById('editClassId').value = schedule.classId;
        document.getElementById('editDate').value = schedule.date;
        document.getElementById('editTime').value = schedule.time;
        document.getElementById('editUserId').value = schedule.userId;
        document.getElementById('editEmail').value = schedule.email;
    }
    
    function handleEditClick(e) {
        if (e.target.classList.contains('edit-btn')) {
            const scheduleId = e.target.getAttribute('data-id');
            const schedule = findScheduleById(scheduleId);
            
            if (schedule) {
                populateEditForm(schedule);
                editPopup.style.display = 'flex';
            }
        }
    }
    
    function handleDeleteClick(e) {
        if (e.target.classList.contains('delete-btn')) {
            const scheduleId = e.target.getAttribute('data-id');
            currentScheduleId = scheduleId;
            deletePopup.style.display = 'flex';
        }
    }
    
    function saveSchedules() {
        localStorage.setItem('schedules', JSON.stringify(schedules));
        updateStats();
        renderScheduleTable(schedules);
        loadStatistics();
    }
    
    function deleteSchedule() {
        const index = schedules.findIndex(schedule => schedule.id == currentScheduleId);
        if (index !== -1) {
            schedules.splice(index, 1);
            saveSchedules();
            Swal.fire({
                position: "top-center",
                icon: "success",
                title: "Lịch tập xoá thành công",
                showConfirmButton: false,
                timer: 1500,
            });  
        }
        deletePopup.style.display = 'none';
        currentScheduleId = null;
    }

    function renderScheduleTable(schedules) {
        tableBody.innerHTML = '';
        if (schedules.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="6" class="no-data">Không có lịch tập nào</td>';
            tableBody.appendChild(row);
            return;
        }
        
        schedules.forEach(schedule => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${getClassName(schedule.classId)}</td>
                <td>${schedule.date}</td>
                <td>${schedule.time}</td>
                <td>${schedule.userId}</td>
                <td>${schedule.email}</td>
                <td>
                    <button class="edit-btn" data-id="${schedule.id}">Sửa</button>
                    <button class="delete-btn" data-id="${schedule.id}">Xóa</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    filterBtn.addEventListener('click', function() {
        const classValue = classFilter.value;
        const emailValue = emailFilter.value.toLowerCase();
        const dateValue = dateFilter.value;

        const filteredSchedules = schedules.filter(schedule => {
            const matchClass = classValue === 'all' || 
                             (classValue === 'gym' && parseInt(schedule.classId) === 1) ||
                             (classValue === 'yoga' && parseInt(schedule.classId) === 3) ||
                             (classValue === 'zumba' && parseInt(schedule.classId) === 2);

            const matchEmail = !emailValue || schedule.email.toLowerCase().includes(emailValue);
            const matchDate = !dateValue || schedule.date === dateValue;

            return matchClass && matchEmail && matchDate;
        });

        renderScheduleTable(filteredSchedules);
    });
    
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const errors = validateScheduleData(formData);
    
        if (errors.length > 0) {
            Swal.fire({
              position: "top-center",
              icon: "error",
              title: "Vui lòng nhập thông tin hợp lệ",
              showConfirmButton: false,
              timer: 1500,
            });  
            return;
        }
    
        const updatedSchedule = {
            id: formData.get('id'),
            classId: parseInt(formData.get('classId')),
            date: formData.get('date'),
            time: formData.get('time'),
            userId: formData.get('userId'),
            email: formData.get('email')
        };
        
        const index = schedules.findIndex(schedule => schedule.id == updatedSchedule.id);
        if (index !== -1) {
            schedules[index] = updatedSchedule;
            saveSchedules();
            editPopup.style.display = 'none';
            Swal.fire({
                position: "top-center",
                icon: "success",
                title: "Lịch tập cập nhật thành công",
                showConfirmButton: false,
                timer: 1500,
            });  
        }
    });
    
    cancelEditBtn.addEventListener('click', function() {
        editPopup.style.display = 'none';
    });
    
    confirmDeleteBtn.addEventListener('click', deleteSchedule);
    
    cancelDeleteBtn.addEventListener('click', function() {
        deletePopup.style.display = 'none';
        currentScheduleId = null;
    });
    
    tableBody.addEventListener('click', function(e) {
        handleEditClick(e);
        handleDeleteClick(e);
    });

    updateStats();
    loadStatistics();
    renderScheduleTable(schedules);
});