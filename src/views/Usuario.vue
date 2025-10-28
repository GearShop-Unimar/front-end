<template>
  <div class="profile-page-container">
    <aside class="profile-nav">
      <ul>
        <li>
          <router-link to="/perfil" class="nav-link">
            <i class="bi bi-person-fill"></i> Minha Conta
          </router-link>
        </li>
        <li>
          <router-link to="/meus-produtos" class="nav-link">
            <i class="bi bi-box-seam-fill"></i> Meus Anúncios
          </router-link>
        </li>
        <li>
          <router-link to="/pedidos" class="nav-link">
            <i class="bi bi-receipt"></i> Meus Pedidos
          </router-link>
        </li>
        <li>
          <a
            href="#"
            @click.prevent="authStore.logout()"
            class="nav-link logout"
          >
            <i class="bi bi-box-arrow-left"></i> Sair
          </a>
        </li>
      </ul>
    </aside>

    <main class="profile-content">
      <h1>Meu Perfil</h1>
      <p class="profile-subtitle">Gerencie as informações da sua conta</p>

      <form class="profile-form" @submit.prevent="saveChanges">
        <div class="avatar-upload-section">
          <img
            :src="profilePicturePreview || 'https://i.pravatar.cc/150'"
            alt="Foto de perfil"
            class="profile-avatar"
            @error="onImageError"
          />
          <div class="avatar-controls">
            <input
              type="file"
              @change="handleFileChange"
              accept="image/png, image/jpeg"
              id="fileInput"
              ref="fileInputRef"
              style="display: none"
            />
            <button
              type="button"
              class="btn btn-secondary"
              @click="$refs.fileInputRef.click()"
            >
              Trocar foto
            </button>
            <p>PNG ou JPG, max 5MB.</p>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="name">Nome</label>
            <input
              type="text"
              id="name"
              v-model="userData.name"
              placeholder="Seu nome completo"
            />
          </div>
          <div class="form-group">
            <label for="email">E-mail</label>
            <input type="email" id="email" v-model="userData.email" disabled />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="phone">Telefone</label>
            <input
              type="text"
              id="phone"
              v-model="userData.phoneNumber"
              placeholder="(XX) XXXXX-XXXX"
              @input="formatPhone"
              maxlength="15"
            />
          </div>
          <div class="form-group">
            <label for="cpf">CPF</label>
            <input
              type="text"
              id="cpf"
              v-model="userData.cpf"
              placeholder="XXX.XXX.XXX-XX"
              @input="formatCPF"
              maxlength="14"
            />
          </div>
        </div>

        <h2>Endereço</h2>

        <div class="form-row">
          <div class="form-group">
            <label for="rua">Rua</label>
            <input type="text" id="rua" v-model="userData.rua" />
          </div>
          <div class="form-group small-numero">
            <label for="numero">Número</label>
            <input type="text" id="numero" v-model="userData.numeroCasa" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="cep">CEP</label>
            <input
              type="text"
              id="cep"
              v-model="userData.cep"
              placeholder="XXXXX-XXX"
              @input="formatCEP"
              maxlength="9"
            />
          </div>
          <div class="form-group">
            <label for="cidade">Cidade</label>
            <input type="text" id="cidade" v-model="userData.cidade" />
          </div>
          <div class="form-group small-estado">
            <label for="estado">Estado</label>
            <input
              type="text"
              id="estado"
              v-model="userData.estado"
              maxlength="2"
              placeholder="UF"
            />
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">
            Salvar Alterações
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";

const API_URL = import.meta.env.VITE_API_URL;
const authStore = useAuthStore();
const toast = useToast();

const userData = ref({});
const profilePictureFile = ref(null);
const profilePicturePreview = ref(null);
const fileInputRef = ref(null);
const defaultAvatar = "https://i.pravatar.cc/150";

function formatPhoneValue(value = "") {
  let v = value.replace(/\D/g, "").substring(0, 11);
  if (v.length > 10) {
    v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  } else if (v.length > 6) {
    v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
  } else if (v.length > 2) {
    v = v.replace(/^(\d{2})(\d{0,4})$/, "($1) $2");
  }
  return v;
}
function formatCEPValue(value = "") {
  return value.replace(/\D/g, "").replace(/^(\d{5})(\d{3})$/, "$1-$2");
}
function formatCPFValue(value = "") {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}
const formatPhone = (event) => {
  userData.value.phoneNumber = formatPhoneValue(event.target.value);
};
const formatCEP = (event) => {
  userData.value.cep = formatCEPValue(event.target.value);
};
const formatCPF = (event) => {
  userData.value.cpf = formatCPFValue(event.target.value);
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("O arquivo é muito grande (máximo 5MB).");
      return;
    }
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      toast.error("Formato de arquivo inválido. Apenas JPG ou PNG.");
      return;
    }

    profilePictureFile.value = file;
    profilePicturePreview.value = URL.createObjectURL(file);
  }
};

const resetForm = () => {
  if (authStore.user) {
    userData.value = { ...authStore.user };

    userData.value.phoneNumber = formatPhoneValue(authStore.user.phoneNumber);
    userData.value.cpf = formatCPFValue(authStore.user.cpf);
    userData.value.cep = formatCEPValue(authStore.user.cep);

    if (authStore.user.id) {
      profilePicturePreview.value = `${API_URL}/images/user/${authStore.user.id}`;
    } else {
      profilePicturePreview.value = defaultAvatar;
    }
  } else {
    console.warn("Nenhum usuário autenticado encontrado na store.");
  }
};

const onImageError = () => {
  profilePicturePreview.value = defaultAvatar;
};

const saveChanges = async () => {
  const userId = authStore.user?.id;
  const token = authStore.token;

  if (!userId || !token) {
    toast.error("Sua sessão expirou. Faça login novamente.");
    return;
  }

  let newImagePath = authStore.user.profilePicture || "";

  try {
    if (profilePictureFile.value) {
      const formData = new FormData();
      formData.append("file", profilePictureFile.value);

      const imageResponse = await fetch(`${API_URL}/images/user/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!imageResponse.ok) {
        throw new Error("Falha ao enviar a nova foto.");
      }

      const imageResult = await imageResponse.json();
      newImagePath = imageResult.newImagePath;
      profilePicturePreview.value = `${API_URL}${newImagePath.replace(
        "/api",
        ""
      )}`;
      profilePictureFile.value = null;
    }

    const dataToSend = {
      name: userData.value.name,
      email: userData.value.email,
      phoneNumber: (userData.value.phoneNumber || "").replace(/\D/g, ""),
      cpf: (userData.value.cpf || "").replace(/\D/g, ""),
      estado: (userData.value.estado || "").toUpperCase(),
      cidade: userData.value.cidade,
      cep: (userData.value.cep || "").replace(/\D/g, ""),
      rua: userData.value.rua,
      numeroCasa: userData.value.numeroCasa,
      profilePicture: newImagePath.startsWith("/api")
        ? newImagePath
        : authStore.user.profilePicture || "",
    };

    await authStore.updateUserProfile(dataToSend);
  } catch (error) {
    console.error("Erro ao salvar alterações:", error);
    toast.error(error.message || "Falha ao salvar. Tente novamente.");
  }
};

onMounted(resetForm);
</script>

<style scoped>
.profile-page-container {
  display: flex;
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: calc(100vh - 80px);
}

.profile-nav {
  flex: 0 0 280px;
  background-color: var(--color-card-background);
  border-radius: 12px;
  box-shadow: 0 4px 12px var(--color-card-shadow);
  padding: 20px;
  height: fit-content;
}

.profile-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  color: var(--color-text);
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.5rem;
  transition: all 0.2s ease;
}

.nav-link i {
  font-size: 1.8rem;
  color: var(--color-text);
  opacity: 0.8;
  transition: all 0.2s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: var(--color-background-mute);
  color: var(--color-primary);
}

.nav-link:hover i,
.nav-link.router-link-active i {
  color: var(--color-primary);
  opacity: 1;
}

.nav-link.logout:hover {
  color: #ff4d4d;
  background-color: hsla(0, 100%, 65%, 0.1);
}
.nav-link.logout:hover i {
  color: #ff4d4d;
}

.profile-content {
  flex: 1;
  background-color: var(--color-card-background);
  border-radius: 12px;
  box-shadow: 0 4px 12px var(--color-card-shadow);
  padding: 40px;
}

.profile-content h1 {
  color: var(--color-heading);
  font-size: 2.4rem;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 5px;
}

.profile-subtitle {
  font-size: 1.5rem;
  color: var(--color-text);
  opacity: 0.8;
  margin-bottom: 30px;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.profile-form h2 {
  color: var(--color-heading);
  font-size: 1.8rem;
  font-weight: 600;
  margin-top: 15px;
  margin-bottom: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-border);
}

.avatar-upload-section {
  display: flex;
  align-items: center;
  gap: 25px;
  padding-bottom: 30px;
  border-bottom: 1px solid var(--color-border);
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--color-primary);
}

.avatar-controls .btn-secondary {
  width: auto;
  padding: 10px 20px;
  font-size: 1.4rem;
  margin-bottom: 10px;
}

.avatar-controls p {
  font-size: 1.2rem;
  color: var(--color-text);
  opacity: 0.7;
  margin: 0;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group.small-numero {
  flex: 0 0 120px;
}

.form-group.small-estado {
  flex: 0 0 80px;
}

.form-group label {
  color: var(--color-heading);
  font-weight: 600;
  font-size: 1.4rem;
  margin-bottom: 8px;
}

.form-group input {
  padding: 12px 15px;
  border: 1px solid var(--color-border);
  background-color: var(--color-background-mute);
  color: var(--color-text);
  border-radius: 8px;
  font-size: 1.5rem;
  width: 90%;
  transition: all 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
  background-color: var(--color-card-background);
  box-shadow: 0 0 0 3px hsla(24, 100%, 50%, 0.15);
}

.form-group input:disabled {
  background-color: var(--color-border);
  opacity: 0.7;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.form-actions .btn-primary {
  width: auto;
  padding: 12px 30px;
  font-size: 1.5rem;
}

.btn {
  border: 2px solid var(--color-primary);
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}
.btn-primary:hover {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: transparent;
  color: var(--color-primary);
}
.btn-secondary:hover {
  background-color: var(--color-primary);
  color: white;
}
</style>
