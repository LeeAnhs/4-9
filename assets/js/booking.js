document.addEventListener('DOMContentLoaded', function() {

    const ClassType = {
        GYM: 1,
        ZUMBA: 2,
        YOGA: 3
    };

    const initialSchedules = [
        {
            id: "001",
            userId: "Lê Xuân Ánh",
            classId: ClassType.GYM,
            date: "2024-03-20",
            time: "09:00",
            email: "xxxxxx123@gmail.com",
            createdAt: new Date("2024-03-19T08:00:00"),
            updatedAt: new Date("2024-03-19T08:00:00")
        },
        {
            id: "002",
            userId: "Jimmy Gigity",
            classId: ClassType.ZUMBA,
            date: "2024-03-21",
            time: "12:30",
            email: "gigity@gmail.com",
            createdAt: new Date("2024-03-19T10:00:00"),
            updatedAt: new Date("2024-03-19T11:00:00")
        }
    ];

    let schedules = [];

    const popup = document.querySelector(".popup");
    const overlay = document.querySelector(".popup-overlay");
    const closeBtn = document.querySelector(".close-btn");
    const scheduleForm = document.getElementById("schedule-form");
    const editPopup = document.querySelector(".edit-popup");
    const deletePopup = document.querySelector(".delete-popup");
    let currentRow = null;
    function saveToLocalStorage() {
        localStorage.setItem('schedules', JSON.stringify(schedules));
    }

    function loadFromLocalStorage() {
        const savedSchedules = localStorage.getItem('schedules');
        if (savedSchedules) {
            const parsedSchedules = JSON.parse(savedSchedules);
            parsedSchedules.forEach(schedule => {
                schedule.createdAt = new Date(schedule.createdAt);
                schedule.updatedAt = new Date(schedule.updatedAt);
            });
            schedules = parsedSchedules;
        } else {
            schedules = [...initialSchedules];
            saveToLocalStorage();
        }
    }

    function getClassName(classId) {
        switch (classId) {
            case ClassType.GYM:
                return "GYM";
            case ClassType.ZUMBA:
                return "Zumba";
            case ClassType.YOGA:
                return "Yoga";
            default:
                return "Unknown";
        }
    }

    function getClassId(className) {
        switch (className.toUpperCase()) {
            case "GYM":
                return ClassType.GYM;
            case "ZUMBA":
                return ClassType.ZUMBA;
            case "YOGA":
                return ClassType.YOGA;
            default:
                return null;
        }
    }

    // function validateSchedule(schedule) {
    //     if (!schedule.userId || !schedule.classId || !schedule.date || !schedule.time || !schedule.email) {
    //         Swal.fire({
    //           position: "top-center",
    //           icon: "error",
    //           title: "Vui lòng điền đầy đủ thông tin",
    //           showConfirmButton: false,
    //           timer: 1500,
    //         });
    //         return false;
    //     }

    //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     if (!emailRegex.test(schedule.email)) {
    //         Swal.fire({
    //           position: "top-center",
    //           icon: "error",
    //           title: "Vui lòng điền email hợp lệ",
    //           showConfirmButton: false,
    //           timer: 1500,
    //         });
    //         return false;
    //     }
    //     const isDuplicate = schedules.some(s => 
    //         s.date === schedule.date && 
    //         s.time === schedule.time && 
    //         s.classId === schedule.classId &&
    //         s.id !== schedule.id
    //     );

    //     if (isDuplicate) {
    //         Swal.fire({
    //           position: "top-center",
    //           icon: "error",
    //           title: "Lịch học đã tồn tại",
    //           showConfirmButton: false,
    //           timer: 1500,
    //         });
    //         return false;
    //     }

    //     return true;
    // }
 
    function validateSchedule(schedule) {
        const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/;
        if (!nameRegex.test(schedule.userId)) {
            Swal.fire({
                position: "top-center",
                icon: "error",
                title: "Tên chỉ được phép nhập chữ",
                showConfirmButton: false,
                timer: 1500,
            });
            return false;
        }
        if (!schedule.userId || !schedule.classId || !schedule.date || !schedule.time || !schedule.email) {
            Swal.fire({
                position: "top-center",
                icon: "error",
                title: "Vui lòng điền đầy đủ thông tin",
                showConfirmButton: false,
                timer: 1500,
            });
            return false;
        }
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(schedule.email)) {
            Swal.fire({
                position: "top-center",
                icon: "error",
                title: "Vui lòng điền email hợp lệ",
                showConfirmButton: false,
                timer: 1500,
            });
            return false;
        }
    
        const isDuplicate = schedules.some(s => 
            s.date === schedule.date && 
            s.time === schedule.time && 
            s.classId === schedule.classId &&
            s.id !== schedule.id
        );
    
        if (isDuplicate) {
            Swal.fire({
                position: "top-center",
                icon: "error",
                title: "Lịch học đã tồn tại",
                showConfirmButton: false,
                timer: 1500,
            });
            return false;
        }
    
        return true;
    }
    
    

    function renderSchedules() {
        const tableBody = document.querySelector("tbody");
        tableBody.innerHTML = '';
        
        schedules.forEach(schedule => {
            const row = document.createElement("tr");
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

    document.querySelector(".new-schedule-btn").addEventListener("click", function() {
        popup.style.display = "block";
        overlay.style.display = "block";
    });

    closeBtn.addEventListener("click", function() {
        popup.style.display = "none";
        overlay.style.display = "none";
    });

    overlay.addEventListener("click", function() {
        popup.style.display = "none";
        overlay.style.display = "none";
        editPopup.style.display = "none";
        deletePopup.style.display = "none";
    });

    scheduleForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const inputs = scheduleForm.querySelectorAll("input");
        const select = scheduleForm.querySelector("select");

        const newSchedule = {
            id: `${String(schedules.length + 1).padStart(3, "0")}`,
            userId: inputs[2].value,
            classId: getClassId(select.value),
            date: inputs[0].value,
            time: inputs[1].value,
            email: inputs[3].value,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        if (validateSchedule(newSchedule)) {
            schedules.push(newSchedule);
            saveToLocalStorage();
            renderSchedules();
            scheduleForm.reset();
            popup.style.display = "none";
            overlay.style.display = "none";
        }
    });

    document.querySelector("tbody").addEventListener("click", function(e) {
        if (e.target.classList.contains("edit-btn")) {
            const scheduleId = e.target.dataset.id;
            const schedule = schedules.find(s => s.id === scheduleId);
            if (schedule) {
                currentRow = e.target.closest("tr");
                document.getElementById("edit-class").value = getClassName(schedule.classId);
                document.getElementById("edit-date").value = schedule.date;
                document.getElementById("edit-time").value = schedule.time;
                document.getElementById("edit-name").value = schedule.userId;
                document.getElementById("edit-email").value = schedule.email;
                
                editPopup.style.display = "block";
                overlay.style.display = "block";
            }
        } else if (e.target.classList.contains("delete-btn")) {
            currentRow = e.target.closest("tr");
            deletePopup.style.display = "block";
            overlay.style.display = "block";
        }
    });

    document.getElementById("edit-form").addEventListener("submit", function(event) {
        event.preventDefault();
        if (currentRow) {
            const scheduleId = currentRow.querySelector(".edit-btn").dataset.id;
            const scheduleIndex = schedules.findIndex(s => s.id === scheduleId);
            
            if (scheduleIndex !== -1) {
                const updatedSchedule = {
                    ...schedules[scheduleIndex],
                    userId: document.getElementById("edit-name").value,
                    classId: getClassId(document.getElementById("edit-class").value),
                    date: document.getElementById("edit-date").value,
                    time: document.getElementById("edit-time").value,
                    email: document.getElementById("edit-email").value,
                    updatedAt: new Date()
                };

                if (validateSchedule(updatedSchedule)) {
                    schedules[scheduleIndex] = updatedSchedule;
                    saveToLocalStorage();
                    renderSchedules();
                    editPopup.style.display = "none";
                    overlay.style.display = "none";
                }
            }
        }
    });

    document.getElementById("confirm-delete").addEventListener("click", function() {
        if (currentRow) {
            const scheduleId = currentRow.querySelector(".delete-btn").dataset.id;
            const scheduleIndex = schedules.findIndex(s => s.id === scheduleId);
            if (scheduleIndex !== -1) {
                schedules.splice(scheduleIndex, 1);
                saveToLocalStorage();
                renderSchedules();
            }
        }
        deletePopup.style.display = "none";
        overlay.style.display = "none";
    });

    document.getElementById("cancel-delete").addEventListener("click", function() {
        deletePopup.style.display = "none";
        overlay.style.display = "none";
    });

    document.querySelectorAll(".close-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            editPopup.style.display = "none";
            deletePopup.style.display = "none";
            overlay.style.display = "none";
        });
    });

    loadFromLocalStorage();
    renderSchedules();
});
