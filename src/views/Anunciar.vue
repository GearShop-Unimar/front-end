<template>
  <div class="anunciar-container">
    <h1>Anuncie seu Produto</h1>
    <p class="subtitle">
      Preencha os dados abaixo e conecte seu produto a quem realmente precisa.
    </p>

    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Publicando seu anúncio...</p>
    </div>

    <form @submit.prevent="anunciarProduto" class="anuncio-form">
      <div class="form-group">
        <label for="nome">Nome do Produto*</label>
        <input
          v-model="produto.nome"
          id="nome"
          type="text"
          placeholder="Ex: Motor 1.6 Flex"
          required
          maxlength="60"
        />
        <span class="char-counter">{{ produto.nome.length }}/60</span>
      </div>

      <div class="form-group">
        <label for="categoria">Categoria*</label>
        <select v-model="produto.categoria" id="categoria" required>
          <option value="" disabled selected>Selecione uma categoria</option>
          <option>Motor</option>
          <option>Suspensão</option>
          <option>Freios</option>
          <option>Cambio</option>
          <option>Elétrica</option>
          <option>Carroceria</option>
          <option>Rodas e Pneus</option>
        </select>
      </div>

      <div class="form-group">
        <label for="modelo">Modelo Compatível*</label>
        <input
          v-model="produto.modelo"
          id="modelo"
          type="text"
          placeholder="Ex: Gol 1.6 2010-2015"
          required
        />
      </div>

      <div class="form-group">
        <label for="imagem">Foto do Produto (opcional, máximo 1MB)</label>
        <input
          type="file"
          @change="selecionarImagem"
          id="imagem"
          accept="image/*"
        />
        <div v-if="imagemPreview" class="img-preview">
          <img :src="imagemPreview" alt="Preview da imagem" />
          <button type="button" @click="removerImagem" class="remove-image-btn">
            × Remover
          </button>
        </div>
        <p v-if="imagemError" class="error-message">{{ imagemError }}</p>
      </div>

      <div class="form-group-inline">
        <div class="form-group">
          <label for="preco">Preço (R$)*</label>
          <input
            v-model.number="produto.preco"
            id="preco"
            type="number"
            min="0"
            step="0.01"
            placeholder="Ex: 150.00"
            required
          />
        </div>

        <div class="form-group">
          <label for="estado">Estado do Produto*</label>
          <select v-model="produto.estado" id="estado" required>
            <option value="" disabled selected>Selecione</option>
            <option>Nova</option>
            <option>Usada</option>
            <option>Recondicionada</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="descricao">Descrição*</label>
        <textarea
          v-model="produto.descricao"
          id="descricao"
          rows="4"
          placeholder="Detalhes adicionais sobre o produto..."
          required
          maxlength="500"
        ></textarea>
        <span class="char-counter">{{ produto.descricao.length }}/500</span>
      </div>

      <div class="form-group-inline">
        <div class="form-group">
          <label for="cep">CEP (opcional)</label>
          <input
            v-model="produto.cep"
            id="cep"
            type="text"
            placeholder="Ex: 00000-000"
            v-mask="'#####-###'"
          />
        </div>

        <div class="form-group">
          <label for="telefone">Telefone para Contato*</label>
          <input
            v-model="produto.telefone"
            id="telefone"
            type="tel"
            placeholder="Ex: (11) 99999-9999"
            required
            v-mask="'(##) #####-####'"
          />
        </div>
      </div>

      <button type="submit" :disabled="loading">
        <span v-if="!loading"> Publicar Anúncio</span>
        <span v-else>Processando...</span>
      </button>

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useProductStore } from "../stores/product.js";

const router = useRouter();
const productStore = useProductStore();

const { loading } = storeToRefs(productStore);

const produto = ref({
  nome: "",
  categoria: "",
  modelo: "",
  preco: 0,
  estado: "",
  descricao: "",
  cep: "",
  telefone: "",
  arquivoImagem: null,
});

const imagemPreview = ref(null);
const imagemError = ref(null);
const errorMessage = ref(null);

const isDark = ref(false);

const toggleDark = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add("dark-theme");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark-theme");
    localStorage.setItem("theme", "light");
  }
};

const removerImagem = () => {
  imagemPreview.value = null;
  produto.value.arquivoImagem = null;
  const fileInput = document.getElementById("imagem");
  if (fileInput) {
    fileInput.value = "";
  }
};

const selecionarImagem = (event) => {
  const file = event.target.files[0];
  imagemError.value = null;

  if (!file) {
    removerImagem();
    return;
  }

  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxSize = 1 * 1024 * 1024;

  if (!validTypes.includes(file.type)) {
    imagemError.value = "Formato inválido. Use JPEG, PNG ou WEBP.";
    return;
  }

  if (file.size > maxSize) {
    imagemError.value = "Imagem muito grande. Máximo 1MB.";
    return;
  }

  produto.value.arquivoImagem = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    imagemPreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const anunciarProduto = async () => {
  const payload = {
    name: produto.value.nome,
    description: produto.value.descricao,
    price: produto.value.preco,
    stockQuantity: 1,
    category: produto.value.categoria,
    imageFile: produto.value.arquivoImagem,
  };

  try {
    errorMessage.value = null;

    await productStore.addProduct(payload);

    showSuccessToast("Anúncio publicado com sucesso!");
    router.push("/produtos");
  } catch (error) {
    console.error("Erro ao publicar anúncio:", error);
    errorMessage.value =
      productStore.error || "Erro desconhecido ao publicar anúncio.";
  }
};

const showSuccessToast = (message) => {
  alert(message);
};

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    isDark.value = savedTheme === "dark";
  } else {
    isDark.value =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  if (isDark.value) {
    document.documentElement.classList.add("dark-theme");
  }
});

defineExpose({
  toggleDark,
  isDark,
});
</script>

<style scoped>
.anunciar-container {
  max-width: 700px;
  margin: 100px auto 50px;
  padding: 40px;
  background-color: var(--color-card-background);
  border-radius: 12px;
  box-shadow: 0 4px 20px var(--color-card-shadow);
  font-family: "Rajdhani", sans-serif;
  position: relative;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-background-soft);
  opacity: 0.9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: 12px;
}

.loading-overlay p {
  color: var(--color-text);
}

.loading-spinner {
  border: 4px solid var(--color-border);
  border-radius: 50%;
  border-top: 4px solid var(--color-primary);
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

h1 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 10px;
  color: var(--color-heading);
}

.subtitle {
  text-align: center;
  font-size: 1rem;
  margin-bottom: 30px;
  color: var(--color-text);
}

.anuncio-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
}

.form-group {
  display: flex;
  flex-direction: column;
  position: relative;
}

.form-group-inline {
  display: flex;
  gap: 20px;
}

.form-group-inline .form-group {
  flex: 1;
}

label {
  margin-bottom: 6px;
  font-weight: 600;
  color: var(--color-text);
}

input[type="text"],
input[type="number"],
input[type="file"],
input[type="tel"],
select,
textarea {
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
  background-color: var(--color-background-mute);
  color: var(--color-text);
  transition: border-color 0.2s;
}

input:focus,
select:focus,
textarea:focus {
  border-color: var(--color-primary);
  outline: none;
}

button {
  padding: 12px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

button:disabled {
  background-color: var(--color-border);
  cursor: not-allowed;
}

.img-preview {
  margin-top: 10px;
  position: relative;
}

.img-preview img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  display: block;
}

.remove-image-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.2s;
}

.remove-image-btn:hover {
  background-color: rgba(255, 0, 0, 0.9);
}

.char-counter {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.7;
  text-align: right;
  margin-top: 4px;
}

.error-message {
  color: var(--vt-color-error);
  background-color: #fde8e8;
  padding: 10px;
  border-radius: 5px;
  margin-top: 5px;
  font-size: 0.9rem;
}

html.dark-theme textarea::placeholder {
  color: #a0a0a0;
}
html.dark-theme input::placeholder {
  color: #a0a0a0;
}

@media (max-width: 768px) {
  .anunciar-container {
    margin: 20px 10px;
    padding: 20px;
    max-width: 100%;
    box-shadow: 0 2px 10px var(--color-card-shadow);
  }

  .form-group-inline {
    flex-direction: column;
    gap: 20px;
  }

  h1 {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .anunciar-container {
    padding: 15px;
    margin: 10px 5px;
  }

  h1 {
    font-size: 1.6rem;
  }

  .subtitle {
    font-size: 0.9rem;
    margin-bottom: 20px;
  }

  button {
    font-size: 0.9rem;
  }
}
</style>
