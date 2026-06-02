<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import { login } from "../services/auth";

const router = useRouter();

const email = ref("");
const password = ref("");

const handleLogin = async () => {

  try {

    const res = await login({
      email: email.value,
      password: password.value,
    });

    localStorage.setItem("token", res.data.token);
    if (res.data.user) {
      localStorage.setItem("user_info", JSON.stringify(res.data.user));
    }

    router.push("/dashboard");

  } catch (err) {

    alert("Login failed");

  }
};
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <section class="auth-brand">
        <p class="brand-chip">ANALYTICS HUB</p>
        <h1>Welcome Back</h1>
        <p>
          Sign in to monitor your KPIs, track live growth, and keep every dashboard in sync.
        </p>
      </section>

      <section class="auth-form-wrap">
        <h2>Login</h2>

        <label>
          <span>Email</span>
          <input
            v-model="email"
            type="email"
            placeholder="name@company.com"
            autocomplete="email"
          />
        </label>

        <label>
          <span>Password</span>
          <input
            type="password"
            v-model="password"
            placeholder="Enter your password"
            autocomplete="current-password"
          />
        </label>

        <button @click="handleLogin">
          Continue
        </button>

        <p class="auth-switch">
          New here?
          <RouterLink to="/signup">Create an account</RouterLink>
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Space+Grotesk:wght@400;500;600;700&display=swap");

.auth-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at 14% 18%, rgba(20, 184, 166, 0.3), transparent 36%),
    radial-gradient(circle at 88% 80%, rgba(249, 115, 22, 0.28), transparent 40%),
    linear-gradient(130deg, #062631 0%, #0a2533 36%, #1f2937 100%);
  font-family: "Space Grotesk", "Segoe UI", sans-serif;
}

.auth-card {
  width: min(920px, 100%);
  min-height: 540px;
  border-radius: 26px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  box-shadow: 0 30px 90px rgba(3, 8, 20, 0.55);
  background: rgba(245, 252, 250, 0.95);
}

.auth-brand {
  background: linear-gradient(170deg, #0f766e 0%, #0f766e 22%, #155e75 100%);
  color: #f0fdfa;
  padding: 44px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
}

.brand-chip {
  width: fit-content;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 11px;
  letter-spacing: 1.6px;
  font-weight: 700;
  background: rgba(240, 253, 250, 0.15);
  border: 1px solid rgba(240, 253, 250, 0.24);
}

.auth-brand h1 {
  font-family: "DM Serif Display", Georgia, serif;
  font-size: clamp(2.1rem, 4vw, 3rem);
  line-height: 1.1;
  letter-spacing: 0.3px;
}

.auth-brand p {
  max-width: 34ch;
  color: rgba(240, 253, 250, 0.9);
  font-size: 0.97rem;
}

.auth-form-wrap {
  padding: 44px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 18px;
  color: #0f172a;
}

.auth-form-wrap h2 {
  font-size: 1.55rem;
  margin-bottom: 2px;
  color: #0f172a;
}

label {
  display: grid;
  gap: 8px;
}

label span {
  font-size: 0.84rem;
  color: #475569;
  font-weight: 600;
}

input {
  width: 100%;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #0f172a;
  padding: 12px 14px;
  font-size: 0.95rem;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

input:focus {
  outline: none;
  border-color: #0f766e;
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.18);
}

button {
  margin-top: 6px;
  width: 100%;
  border: none;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 0.96rem;
  font-weight: 700;
  color: #f8fafc;
  background: linear-gradient(130deg, #0f766e, #0f766e 45%, #115e59);
  cursor: pointer;
  transition: transform 150ms ease, filter 150ms ease;
}

button:hover {
  transform: translateY(-1px);
  filter: brightness(1.03);
}

.auth-switch {
  margin-top: 2px;
  color: #64748b;
  font-size: 0.9rem;
}

.auth-switch a {
  margin-left: 4px;
  color: #0f766e;
  font-weight: 700;
  text-decoration: none;
}

.auth-switch a:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .auth-card {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .auth-brand,
  .auth-form-wrap {
    padding: 30px;
  }

  .auth-brand p {
    max-width: 100%;
  }
}
</style>