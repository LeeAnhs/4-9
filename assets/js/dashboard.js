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

    function updateStats() {
        const stats = schedules.reduce((acc, schedule) => {
            switch(schedule.classId) {
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
        switch (classId) {
            case 1: return 'GYM';
            case 2: return 'Zumba';
            case 3: return 'Yoga';
            default: return 'Unknown';
        }
    }
    function loadStatistics() {
        const schedules =
            JSON.parse(localStorage.getItem("schedules")) || [];
        let gymCount = 0,
            yogaCount = 0,
            zumbaCount = 0;
        schedules.forEach((s) => {
            switch (s.classId) {
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

        new Chart(
            document.getElementById("classChart").getContext("2d"),
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
    window.onload = loadStatistics;
    

    function renderScheduleTable(schedules) {
        tableBody.innerHTML = '';
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
                             (classValue === 'gym' && schedule.classId === 1) ||
                             (classValue === 'yoga' && schedule.classId === 3) ||
                             (classValue === 'zumba' && schedule.classId === 2);

            const matchEmail = !emailValue || schedule.email.toLowerCase().includes(emailValue);
            const matchDate = !dateValue || schedule.date === dateValue;

            return matchClass && matchEmail && matchDate;
        });

        renderScheduleTable(filteredSchedules);
    });


    updateStats();
    renderScheduleTable(schedules);
});