<template>
  <slot v-if="lib === 'svg'"></slot>

  <span
    v-else-if="lib === 'material'"
    :class="materialClass"
    :style="computedStyle"
    :title="title"
    aria-hidden="false"
  >
    {{ name }}
  </span>

  <i
    v-else-if="lib === 'fa'"
    :class="faClass"
    :style="computedStyle"
    :title="title"
    aria-hidden="true"
  ></i>

  <i
    v-else-if="lib === 'bi'"
    :class="biClass"
    :style="computedStyle"
    :title="title"
    aria-hidden="true"
  ></i>

  <span
    v-else
    :class="['icon-fallback', customClass]"
    :style="computedStyle"
    :title="title"
  >
    {{ fallback }}
  </span>
</template>

<script setup>
import { computed, onMounted } from "vue";

const props = defineProps({
  name: { type: String, default: "" },
  lib: { type: String, default: "material" }, // 'material' | 'fa' | 'bi' | 'svg' | 'emoji'
  size: { type: [String, Number], default: "24" },
  color: { type: String, default: "" },
  variant: { type: String, default: "outlined" },
  spin: { type: Boolean, default: false },
  customClass: { type: String, default: "" },
  title: { type: String, default: "" },
  fallback: { type: String, default: "🔷" },
});

const sizeStyle = computed(() => {
  return typeof props.size === "number" ? `${props.size}px` : props.size;
});

const computedStyle = computed(() => {
  const s = {
    fontSize: sizeStyle.value,
    color: props.color || undefined,
    lineHeight: 1,
    display: "inline-block",
    textAlign: "center", // Adicionado para garantir centralização
  };
  if (props.spin) s.animation = "icon-spin 1s linear infinite";
  return s;
});

const materialClass = computed(() => {
  const map = {
    outlined: "material-symbols-outlined",
    rounded: "material-symbols-rounded",
    sharp: "material-symbols-sharp",
    filled: "material-symbols-filled",
  };
  return `${map[props.variant] || map.outlined} ${props.customClass}`.trim();
});

// --- LÓGICA CORRIGIDA DO FONTAWESOME ---
const faClass = computed(() => {
  if (!props.name) return props.customClass;

  let iconClass = props.name;

  // Verifica se é um nome simples (ex: "home") e adiciona prefixos
  // Se já tiver espaço (ex: "fas fa-home"), assume que está completo
  if (!iconClass.includes(" ")) {
    // Se não começar com prefixos conhecidos, adiciona o padrão 'fa fa-'
    if (
      !iconClass.startsWith("fa-") &&
      !iconClass.startsWith("fab") &&
      !iconClass.startsWith("fas")
    ) {
      iconClass = `fa fa-${iconClass}`;
    } else if (iconClass.startsWith("fa-")) {
      iconClass = `fa ${iconClass}`;
    }
  }

  // Concatena sempre com a customClass (o teu código anterior esquecia disto se tivesse espaço)
  return `${iconClass} ${props.customClass}`.trim();
});

const biClass = computed(() => {
  if (!props.name) return props.customClass;
  let iconClass = props.name;

  // Garante que a classe base 'bi' esteja presente
  const classes = iconClass.split(" ");
  if (!classes.includes("bi")) {
    classes.unshift("bi");
  }

  // Se for um nome simples (ex: "house"), adiciona o prefixo "bi-"
  if (classes.length === 1 && !classes[0].startsWith("bi-")) {
    classes[1] = `bi-${classes[0]}`;
    classes[0] = "bi";
  } else if (!iconClass.startsWith("bi-") && !iconClass.includes(" ")) {
    iconClass = `bi bi-${iconClass}`;
    return `${iconClass} ${props.customClass}`.trim();
  }

  return `${classes.join(" ")} ${props.customClass}`.trim();
});

// --- INJEÇÃO DE CSS ---
onMounted(() => {
  // Injeta Material Icons
  if (props.lib === "material") {
    if (!document.getElementById("gf-material-symbols")) {
      const link = document.createElement("link");
      link.id = "gf-material-symbols";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined";
      document.head.appendChild(link);
    }
  }

  // Injeta FontAwesome (NOVO: Garante que o home e search funcionem)
  if (props.lib === "fa") {
    if (!document.getElementById("font-awesome-cdn")) {
      const link = document.createElement("link");
      link.id = "font-awesome-cdn";
      link.rel = "stylesheet";
      // Usando a versão 6 Free que é compatível com 'fas fa-home'
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
      document.head.appendChild(link);
    }
  }

  // Injeta Bootstrap Icons (Opcional, para completar)
  if (props.lib === "bi") {
    if (!document.getElementById("bootstrap-icons-cdn")) {
      const link = document.createElement("link");
      link.id = "bootstrap-icons-cdn";
      link.rel = "stylesheet";
      link.href =
        "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css";
      document.head.appendChild(link);
    }
  }
});
</script>

<style>
@keyframes icon-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.icon-fallback {
  display: inline-block;
}
</style>
