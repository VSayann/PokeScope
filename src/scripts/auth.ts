document.addEventListener("DOMContentLoaded", () => {
    const authForm = document.getElementById("auth-form") as HTMLFormElement;
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    const authMessage = document.getElementById("auth-message") as HTMLElement;
    const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement;

    const userKey = "currentUser";

    function saveUser(email: string, password: string) {
        localStorage.setItem(userKey, JSON.stringify({ email, password }));
    }

    function getUser(): { email: string; password: string } | null {
        const user = localStorage.getItem(userKey);
        return user ? JSON.parse(user) : null;
    }

    function updateUI() {
        const user = getUser();
        if (user) {
            authMessage.textContent = `Connecté en tant que ${user.email}`;
            authForm.style.display = "none";
            logoutBtn.style.display = "block";
        } else {
            authMessage.textContent = "";
            authForm.style.display = "block";
            logoutBtn.style.display = "none";
        }
    }

    authForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            authMessage.textContent = "Veuillez remplir tous les champs.";
            return;
        }

        saveUser(email, password);
        updateUI();
    });

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem(userKey);
        updateUI();
    });

    updateUI();
});
