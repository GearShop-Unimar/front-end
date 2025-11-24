import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme;
    }
    const userPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return userPrefersDark ? "dark" : "light";
  };

  const theme = ref(getInitialTheme());

  const isDarkMode = computed(() => theme.value === "dark");

  function applyTheme() {
    document.documentElement.className =
      theme.value === "dark" ? "dark-theme" : "";
  }

  function toggleTheme() {
    theme.value = theme.value === "light" ? "dark" : "light";
    localStorage.setItem("theme", theme.value);
    applyTheme();
  }

  function initTheme() {
    applyTheme();
  }

  return {
    theme,
    isDarkMode,
    toggleTheme,
    initTheme,
    applyTheme, // expor para os testes
  };
});
