<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import { signup } from "../services/auth";

const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");

const handleSignup = async () => {

  try {

    await signup({
      name: name.value,
      email: email.value,
      password: password.value,
    });

    alert("Signup successful");

    router.push("/login");

  } catch (err) {

    alert("Signup failed");

  }
};
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <section class="auth-brand">
        <p class="brand-chip">START TRACKING TODAY</p>
        <h1>Create Your Workspace</h1>
        <p>
          Build your account and get instant access to visualized traffic, revenue, and engagement trends.
        </p>
      </section>

      <section class="auth-form-wrap">
        <h2>Sign Up</h2>

        <label>
          <span>Full Name</span>
          <input
            v-model="name"
            type="text"
            placeholder="Your full name"
            autocomplete="name"
          />
        </label>

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
            placeholder="Create a secure password"
            autocomplete="new-password"
          />
        </label>

        <button @click="handleSignup">
          Create Account
        </button>

        <p class="auth-switch">
          Already have an account?
          <RouterLink to="/login">Back to login</RouterLink>
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
    radial-gradient(circle at 10% 84%, rgba(14, 165, 233, 0.28), transparent 34%),
    radial-gradient(circle at 82% 14%, rgba(251, 146, 60, 0.26), transparent 37%),
    linear-gradient(130deg, #111827 0%, #172554 45%, #082f49 100%);
  font-family: "Space Grotesk", "Segoe UI", sans-serif;
}

.auth-card {
  width: min(940px, 100%);
  min-height: 560px;
  border-radius: 26px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1.08fr 1fr;
  box-shadow: 0 30px 90px rgba(3, 8, 20, 0.58);
  background: rgba(248, 250, 252, 0.96);
}

.auth-brand {
  background: linear-gradient(170deg, #1d4ed8 0%, #1e40af 26%, #0f766e 100%);
  color: #eff6ff;
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
  letter-spacing: 1.5px;
  font-weight: 700;
  background: rgba(239, 246, 255, 0.15);
  border: 1px solid rgba(239, 246, 255, 0.24);
}

.auth-brand h1 {
  font-family: "DM Serif Display", Georgia, serif;
  font-size: clamp(2rem, 4vw, 2.95rem);
  line-height: 1.1;
  letter-spacing: 0.3px;
}

.auth-brand p {
  max-width: 35ch;
  color: rgba(239, 246, 255, 0.9);
  font-size: 0.97rem;
}

.auth-form-wrap {
  padding: 44px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  color: #0f172a;
}

.auth-form-wrap h2 {
  font-size: 1.55rem;
  margin-bottom: 2px;
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
  border-color: #1d4ed8;
  box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.2);
}

button {
  margin-top: 6px;
  width: 100%;
  border: none;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 0.96rem;
  font-weight: 700;
  color: #eff6ff;
  background: linear-gradient(130deg, #1d4ed8, #0f766e);
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
  color: #1d4ed8;
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