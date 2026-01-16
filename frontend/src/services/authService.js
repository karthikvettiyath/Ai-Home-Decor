// Mock Auth Service

const USERS_KEY = 'ai_home_decor_users';
const CURRENT_USER_KEY = 'ai_home_decor_current_user';

export const authService = {
    // Simulate delay
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    async register(name, email, password) {
        await this.delay(500);
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');

        if (users.find(u => u.email === email)) {
            throw new Error('User already exists');
        }

        const newUser = { id: Date.now(), name, email, password, role: 'user' };
        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        // Auto login after register
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
        return newUser;
    },

    async login(email, password) {
        await this.delay(500);
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            throw new Error('Invalid credentials');
        }

        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        return user;
    },

    logout() {
        localStorage.removeItem(CURRENT_USER_KEY);
    },

    getCurrentUser() {
        return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    },

    isAuthenticated() {
        return !!localStorage.getItem(CURRENT_USER_KEY);
    }
};
