document.addEventListener('DOMContentLoaded', () => {
    const showLoginBtn = document.getElementById('showLoginBtn');
    const loginModal = document.getElementById('loginModal');
    const addUserModal = document.getElementById('addUserModal');
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const closeButtons = document.querySelectorAll('.close-button');
    const loginForm = document.getElementById('loginForm');
    const addUserForm = document.getElementById('addUserForm');
    const newUserNameInput = document.getElementById('newUserName');
    const userListDiv = document.getElementById('userList');
    const loginMessage = document.getElementById('loginMessage');
    const totalUsersSpan = document.getElementById('totalUsers');

    const userToDeleteNameSpan = document.getElementById('userToDeleteName');
    const deletePasswordInput = document.getElementById('deletePassword');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const deleteMessage = document.getElementById('deleteMessage');

    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'password123';

    let users = JSON.parse(localStorage.getItem('modsAimUsers')) || [];
    let userToDeleteId = null;

    const saveUsers = () => {
        localStorage.setItem('modsAimUsers', JSON.stringify(users));
    };

    const renderUsers = () => {
        userListDiv.innerHTML = '';
        totalUsersSpan.textContent = users.length;

        if (users.length === 0) {
            userListDiv.innerHTML = '<p style="color: #bbb; font-style: italic; margin-top: 20px;">Belum ada user terdaftar. Silakan tambahkan!</p>';
            // Pastikan event listener tombol hapus di-clear atau tidak diaktifkan jika tidak ada user
            return; 
        }

        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.classList.add('user-card');
            userCard.dataset.userId = user.id;

            userCard.innerHTML = `
                <i class="fas fa-user-circle user-icon"></i>
                <h3>${user.name}</h3>
                <small class="user-id-display">ID: ${user.id}</small>
                <button class="delete-user-btn" data-id="${user.id}">Hapus</button>
            `;
            userListDiv.appendChild(userCard);

            // Tambahkan event listener untuk animasi klik pada kartu user
            userCard.addEventListener('click', (event) => {
                // Pastikan klik bukan dari tombol hapus
                if (!event.target.classList.contains('delete-user-btn')) {
                    userCard.classList.add('clicked');
                    setTimeout(() => {
                        userCard.classList.remove('clicked');
                    }, 600);
                }
            });
        });

        // Setelah semua kartu dirender, tambahkan event listener untuk tombol hapus
        // Ini harus di sini agar tombol yang baru dibuat juga mendapatkan event listener
        document.querySelectorAll('.delete-user-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                userToDeleteId = event.target.dataset.id;
                const userObj = users.find(u => u.id == userToDeleteId); // Gunakan == untuk perbandingan long/number
                if (userObj) {
                    userToDeleteNameSpan.textContent = userObj.name;
                    deleteConfirmModal.style.display = 'flex';
                    deletePasswordInput.value = '';
                    deleteMessage.textContent = '';
                } else {
                    alert('User tidak ditemukan.'); // Debugging: user tidak ditemukan
                }
            });
        });
    };

    renderUsers();

    showLoginBtn.addEventListener('click', () => {
        loginModal.style.display = 'flex';
        loginMessage.textContent = '';
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            loginModal.style.display = 'none';
            addUserModal.style.display = 'none';
            deleteConfirmModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target == loginModal) {
            loginModal.style.display = 'none';
        }
        if (event.target == addUserModal) {
            addUserModal.style.display = 'none';
        }
        if (event.target == deleteConfirmModal) {
            deleteConfirmModal.style.display = 'none';
        }
    });

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;

        if (usernameInput === ADMIN_USERNAME && passwordInput === ADMIN_PASSWORD) {
            loginMessage.textContent = '';
            loginModal.style.display = 'none';
            addUserModal.style.display = 'flex';
            newUserNameInput.value = '';
        } else {
            loginMessage.textContent = 'Username atau password salah!';
        }
    });

    addUserForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const newUserName = newUserNameInput.value.trim();

        if (newUserName) {
            const isNameExists = users.some(user => user.name.toLowerCase() === newUserName.toLowerCase());

            if (!isNameExists) {
                const newId = Date.now(); // Menggunakan timestamp sebagai ID angka
                
                const newUser = {
                    id: newId,
                    name: newUserName
                };
                users.push(newUser);
                saveUsers();
                renderUsers();
                addUserModal.style.display = 'none';
                newUserNameInput.value = '';
            } else {
                alert('Nama user ini sudah ada dalam daftar!');
            }
        } else {
            alert('Nama user tidak boleh kosong!');
        }
    });

    // Event listener untuk tombol Konfirmasi Hapus
    confirmDeleteBtn.addEventListener('click', () => {
        const passwordEntered = deletePasswordInput.value;
        if (passwordEntered === ADMIN_PASSWORD) {
            // Filter user yang akan dihapus dari array
            users = users.filter(user => user.id != userToDeleteId); // Menggunakan != untuk perbandingan fleksibel antara number dan string (dari dataset)
            saveUsers();
            renderUsers();
            deleteConfirmModal.style.display = 'none';
            userToDeleteId = null;
        } else {
            deleteMessage.textContent = 'Password salah!';
        }
    });
});