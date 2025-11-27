<template>
  <div class="anunciar-container">
    <h1>Anuncie seu Produto</h1>
    <p class="subtitle">
      Preencha os dados técnicos para que o comprador encontre o produto certo.
    </p>

    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Publicando seu anúncio...</p>
    </div>

    <form @submit.prevent="anunciarProduto" class="anuncio-form">
      <div class="form-grid">
        <!-- Coluna Esquerda -->
        <div class="form-column">
          <div class="form-group">
            <label for="nome">Nome do Produto*</label>
            <input
              v-model="produto.nome"
              id="nome"
              type="text"
              placeholder="Ex: Jogo de Velas NGK"
              required
              maxlength="100"
            />
            <span class="char-counter">{{ produto.nome.length }}/100</span>
          </div>

          <div class="form-group-inline">
            <div class="form-group">
              <label for="categoria">Categoria*</label>
              <select v-model="produto.categoria" id="categoria" required>
                <option value="" disabled selected>Selecione</option>
                <option>Motor e Ignição</option>
                <option>Suspensão</option>
                <option>Freios</option>
                <option>Transmissão</option>
                <option>Elétrica</option>
                <option>Iluminação</option>
                <option>Arrefecimento</option>
                <option>Filtros e Óleos</option>
                <option>Baterias</option>
                <option>Direção</option>
                <option>Estética</option>
                <option>Outros</option>
              </select>
            </div>

            <div class="form-group small-group">
              <label for="estoque">Estoque*</label>
              <input
                v-model.number="produto.estoque"
                id="estoque"
                type="number"
                min="1"
                placeholder="Qtd"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="modelo">Modelo Compatível (Aplicação)*</label>
            <input
              v-model="produto.modelo"
              id="modelo"
              type="text"
              placeholder="Ex: VW Gol G5/G6 1.0 e 1.6"
              required
            />
            <span class="hint">Descreva os veículos e anos compatíveis.</span>
          </div>
          <div class="form-group-inline">
            <div class="form-group">
              <label for="preco">Preço (R$)*</label>
              <input
                id="preco"
                type="text"
                :value="precoVisual"
                @input="formatarMoeda"
                placeholder="0,00"
                required
              />
            </div>

            <div class="form-group">
              <label for="estado">Condição do Produto*</label>
              <select v-model="produto.estado" id="estado" required>
                <option value="" disabled selected>Selecione</option>
                <option value="Nova">Nova</option>
                <option value="Usada">Usada (Original)</option>
                <option value="Recondicionada">Recondicionada</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Coluna Direita -->
        <div class="form-column">
          <div class="form-group">
            <label for="descricao">Descrição Detalhada*</label>
            <textarea
              v-model="produto.descricao"
              id="descricao"
              rows="5"
              placeholder="Detalhes técnicos, marca, número do produto, etc..."
              required
              maxlength="1000"
            ></textarea>
            <span class="char-counter"
              >{{ produto.descricao.length }}/1000</span
            >
          </div>

          <div class="form-group">
            <label for="imagem">Foto do Produto*</label>
            <div class="image-upload-wrapper">
              <input
                type="file"
                @change="selecionarImagem"
                id="imagem"
                accept="image/*"
                required
              />

              <div v-if="imagemPreview" class="img-preview-container">
                <img :src="imagemPreview" alt="Preview" />
                <button type="button" @click="removerImagem" class="remove-btn">
                  <i class="bi bi-trash"></i>
                </button>
              </div>

              <div v-else class="upload-placeholder" @click="triggerFileInput">
                <i class="bi bi-camera"></i>
                <span>Clique para adicionar foto</span>
              </div>
            </div>
            <p v-if="imagemError" class="error-message">{{ imagemError }}</p>
          </div>
        </div>
      </div>

      <button type="submit" :disabled="loading" class="btn-submit">
        <span v-if="!loading">Publicar Produto</span>
        <span v-else>Enviando...</span>
      </button>

      <div v-if="errorMessage" class="error-message alert">
        {{ errorMessage }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useProductStore } from "../stores/product.js";

const router = useRouter(); // Instância para navegação programática
const productStore = useProductStore(); // Instância do store de produtos
// Pega o estado 'loading' do store para desabilitar o botão de envio
const { loading } = storeToRefs(productStore);

// --- Estado do Formulário (Reativo) ---
const produto = ref({
  nome: "",
  categoria: "",
  modelo: "", // Mapeia para CompatibleModel no Backend
  preco: null, // Valor numérico real (ex: 289.90)
  estoque: 1, // Mapeia para StockQuantity
  estado: "", // Valor temporário para a condição do produto
  descricao: "",
  arquivoImagem: null, // Objeto File()
});
const precoVisual = ref(""); // Valor do preço formatado para exibição no input (ex: 289,90)
const imagemPreview = ref(null); // URL temporária para pré-visualização da imagem
const imagemError = ref(null); // Mensagem de erro de validação da imagem
const errorMessage = ref(null); // Mensagem de erro geral do formulário/API

// --- Lógica de Notificação (Toast) ---
// Nota: Em um projeto real, 'useToast' do 'vue-toastification' seria usado diretamente aqui.
const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref(""); // 'success' ou 'error'

// Exibe uma mensagem de notificação temporária (simulação de toast)
const showToastMessage = (message, type) => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  // Oculta o toast após 3 segundos
  setTimeout(() => {
    showToast.value = false;
    toastMessage.value = "";
    toastType.value = "";
  }, 3000);
};

// --- Funções de Imagem ---
// Simula o clique no input de arquivo oculto
const triggerFileInput = () => document.getElementById("imagem").click();

// Limpa o estado da imagem e o input de arquivo
const removerImagem = () => {
  imagemPreview.value = null;
  produto.value.arquivoImagem = null;
  const fileInput = document.getElementById("imagem");
  if (fileInput) fileInput.value = "";
};

// Lida com a seleção de arquivo, valida o tipo/tamanho e gera preview
const selecionarImagem = (event) => {
  const file = event.target.files[0];
  imagemError.value = null;

  if (!file) return;

  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxSize = 2 * 1024 * 1024; // Tamanho máximo de 2MB

  // Validação de tipo de arquivo
  if (!validTypes.includes(file.type)) {
    imagemError.value = "Apenas JPG, PNG ou WEBP.";
    removerImagem();
    return;
  }

  // Validação de tamanho
  if (file.size > maxSize) {
    imagemError.value = "Imagem muito grande (Max 2MB).";
    removerImagem();
    return;
  }

  produto.value.arquivoImagem = file; // Armazena o objeto File
  const reader = new FileReader();
  reader.onload = (e) => {
    imagemPreview.value = e.target.result; // Gera a URL para a pré-visualização
  };
  reader.readAsDataURL(file);
};

// --- Formatação de Moeda ---
// Garante que o input mostre o formato brasileiro e salve o valor float real
const formatarMoeda = (event) => {
  // 1. Limpa o valor, deixando apenas números
  let valor = event.target.value.replaceAll(/\D/g, "");

  if (!valor) {
    produto.value.preco = 0;
    precoVisual.value = "";
    return;
  }

  // 2. Converte para o valor float real (divide por 100 para centavos)
  const numero = Number.parseFloat(valor) / 100;

  // 3. Salva o número REAL que será enviado ao Backend (ex: 289.90)
  produto.value.preco = numero;

  // 4. Atualiza o input com o valor formatado (ex: 289,90)
  precoVisual.value = numero.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// --- Envio do Formulário ---
// Função principal chamada ao submeter o formulário
const anunciarProduto = async () => {
  // Concatena a Condição com a Descrição para enviar ao Backend em um único campo
  const descricaoCompleta = `Condição: ${produto.value.estado}.\n${produto.value.descricao}`;

  // Prepara o objeto payload com os nomes de campo esperados pelo Backend
  const payload = {
    name: produto.value.nome,
    description: descricaoCompleta,
    price: produto.value.preco,
    stockQuantity: produto.value.estoque,
    category: produto.value.categoria,
    compatibleModel: produto.value.modelo,
    imageFile: produto.value.arquivoImagem,
  };

  try {
    errorMessage.value = null;
    // Chama a action do store, que trata a conversão para FormData e o envio
    await productStore.addProduct(payload);
    showToastMessage("Produto anunciado com sucesso!", "success");
    router.push("/produtos"); // Redireciona para a lista de produtos
  } catch (error) {
    console.error("Erro:", error);

    const msg = "Erro ao publicar. Verifique os dados e tente novamente.";

    // 1. Mostra o Toast
    showToastMessage(msg, "error");

    // 2. ATUALIZA A VARIÁVEL DO DOM (Isso fará o teste passar)
    errorMessage.value = msg;
  }
};
</script>

<style scoped>
.anunciar-container {
  width: 1200px;
  margin: 40px auto;
  padding: 40px;
  background-color: var(--color-card-background);
  border-radius: 12px;
  box-shadow: 0 4px 20px var(--color-card-shadow);
  color: var(--color-text);
}

h1 {
  text-align: center;
  font-size: 2rem;
  color: var(--color-heading);
  margin-bottom: 5px;
}

.subtitle {
  text-align: center;
  color: var(--color-text-light);
  margin-bottom: 30px;
  font-size: 0.95rem;
}

.anuncio-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.anuncio-form .btn-submit {
  width: 50%;
  margin: 20px auto 0;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group-inline {
  display: flex;
  gap: 20px;
}

.form-group-inline .form-group {
  flex: 1;
}

.small-group {
  flex: 0 0 100px !important; /* Largura fixa para estoque */
}

label {
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

input,
select,
textarea {
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.hint {
  font-size: 0.8rem;
  color: var(--color-text-light);
  margin-top: 4px;
}

.char-counter {
  font-size: 0.8rem;
  text-align: right;
  color: var(--color-text-light);
  margin-top: 4px;
}

/* Upload de Imagem Estilizado */
.image-upload-wrapper {
  position: relative;
}

/* Esconde o input file original */
input[type="file"] {
  display: none;
}

.upload-placeholder {
  border: 2px dashed var(--color-border);
  border-radius: 8px;
  height: 175px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text-light);
  transition: all 0.2s;
  background-color: var(--color-background-mute);
}

.upload-placeholder:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.upload-placeholder i {
  font-size: 2rem;
  margin-bottom: 10px;
}

.img-preview-container {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  max-height: 300px;
}

.img-preview-container img {
  width: 100%;
  height: auto;
  display: block;
}

.remove-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.remove-btn:hover {
  background: rgba(220, 53, 69, 0.9);
}

.btn-submit {
  background-color: var(--color-primary);
  color: white;
  padding: 15px;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.btn-submit:disabled {
  background-color: var(--color-border);
  cursor: not-allowed;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
  border-radius: 12px;
  color: white;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

.error-message.alert {
  margin-top: 15px;
  text-align: center;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 600px) {
  .anunciar-container {
    padding: 20px;
    margin: 20px 10px;
  }
  .form-group-inline {
    flex-direction: column;
    gap: 20px;
  }
  .small-group {
    flex: 1 !important;
  }
}
</style>
