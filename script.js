const firebaseConfig = {
    apiKey: "AIzaSyA4SarJkRS7fR82s8-cQc6DwSIfIHT9ETI",
    authDomain: "cadastro-58cb0.firebaseapp.com",
    projectId: "cadastro-58cb0",
    storageBucket: "cadastro-58cb0.firebasestorage.app",
    messagingSenderId: "261265375328",
    appId: "1:261265375328:web:7812318e9c88c09aa3c305"
};
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();



// Armazena atividades temporariamente
let atividades = [];

// Definir tipos de atividades por categoria
const tiposPorCategoria = {
    "Extensão": [
        "Projeto de extensão",
        "Atividades culturais",
        "Visitas Técnicas",
        "Visitas a Feiras e Exposições",
        "Cursos de Idiomas",
        "Palestras, Seminários e Congressos Extensionistas (ouvinte)",
        "Palestras, Seminários e Congressos Extensionistas (apresentador)",
        "Projeto Empresa Júnior"
    ],
    "Ensino": [
        "Estágio Extracurricular",
        "Monitoria",
        "Concursos e campeonatos de atividades acadêmicas",
        "Presença comprovada a defesas de TCC do curso de Engenharia de Computação",
        "Cursos Profissionalizantes Específicos na área",
        "Cursos Profissionalizantes em geral"
    ],
    "Pesquisa": [
        "Iniciação Científica",
        "Publicação de artigos em periódicos científicos",
        "Publicação de artigos completos em anais de congressos",
        "Publicação de capítulo de livro",
        "Publicação de resumos de artigos em anais",
        "Registro de patentes como auto/coautor",
        "Premiação resultante de pesquisa científica",
        "Colaborador em atividades como Seminários e Congressos",
        "Palestras, Seminários e Congressos de Pesquisa (ouvinte)",
        "Palestras, Seminários e Congressos de Pesquisa (apresentador)"
    ]
};

// Definir limites e porcentagens para cada tipo de atividade
const limites = {
    "Projeto de extensão": { limite: 40, porcentagem: 0.10 },
    "Atividades culturais": { limite: 5, porcentagem: 0.80 },
    "Visitas Técnicas": { limite: 40, porcentagem: 1.00 },
    "Visitas a Feiras e Exposições": { limite: 5, porcentagem: 0.20 },
    "Cursos de Idiomas": { limite: 20, porcentagem: 0.60 },
    "Palestras, Seminários e Congressos Extensionistas (ouvinte)": { limite: 10, porcentagem: 0.80 },
    "Palestras, Seminários e Congressos Extensionistas (apresentador)": { limite: 15, porcentagem: 1.00 },
    "Projeto Empresa Júnior": { limite: 20, porcentagem: 0.20 },
    "Estágio Extracurricular": { limite: 40, porcentagem: 0.70 },
    "Monitoria": { limite: 40, porcentagem: 0.70 },
    "Concursos e campeonatos de atividades acadêmicas": { limite: 50, porcentagem: 0.70 },
    "Presença comprovada a defesas de TCC do curso de Engenharia de Computação": { limite: 3, porcentagem: 0.50 },
    "Cursos Profissionalizantes Específicos na área": { limite: 40, porcentagem: 0.80 },
    "Cursos Profissionalizantes em geral": { limite: 10, porcentagem: 0.20 },
    "Iniciação Científica": { limite: 40, porcentagem: 0.80 },
    "Publicação de artigos em periódicos científicos": { limite: 10, porcentagem: 1.00 },
    "Publicação de artigos completos em anais de congressos": { limite: 7, porcentagem: 1.00 },
    "Publicação de capítulo de livro": { limite: 7, porcentagem: 1.00 },
    "Publicação de resumos de artigos em anais": { limite: 5, porcentagem: 1.00 },
    "Registro de patentes como auto/coautor": { limite: 40, porcentagem: 1.00 },
    "Premiação resultante de pesquisa científica": { limite: 10, porcentagem: 1.00 },
    "Colaborador em atividades como Seminários e Congressos": { limite: 10, porcentagem: 1.00 },
    "Palestras, Seminários e Congressos de Pesquisa (ouvinte)": { limite: 10, porcentagem: 0.80 },
    "Palestras, Seminários e Congressos de Pesquisa (apresentador)": { limite: 15, porcentagem: 1.00 }
};

// Atualizar tipos de atividades com base na categoria selecionada
document.getElementById('categoria').addEventListener('change', function () {
    const categoria = this.value;
    const tipoSelect = document.getElementById('tipo');
    tipoSelect.innerHTML = '<option value="">Selecione um tipo</option>';

    if (categoria) {
        tipoSelect.disabled = false;
        tiposPorCategoria[categoria].forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo;
            option.textContent = tipo;
            tipoSelect.appendChild(option);
        });
    } else {
        tipoSelect.disabled = true;
    }
});

// Função para calcular horas aproveitadas
function calcularHorasAproveitadas(tipo, horas, total) {
    const { limite, porcentagem } = limites[tipo];
    let horasAproveitadas = horas * porcentagem;

    if (total === limite) return 0;
    if (total + horasAproveitadas > limite) {
        return limite - total;
    }
    return horasAproveitadas;
}

// Carregar atividades do Firestore
async function carregarAtividades() {
    atividades = [];
    const snapshot = await db.collection('pessoas').get();
    snapshot.forEach(doc => {
        atividades.push({ id: doc.id, ...doc.data() });
    });
    atualizarResumo();
}

// Salvar atividades no Firestore
async function salvarAtividades(novasAtividades) {
    try {
        for (let atividade of novasAtividades) {
            await db.collection('pessoas').add(atividade);
        }
        console.log("Atividades salvas com sucesso!");
        carregarAtividades();
    } catch (error) {
        console.error("Erro ao salvar atividades:", error);
    }
}

// Excluir atividade do Firestore
async function excluirAtividade(id) {
    try {
        await db.collection('pessoas').doc(id).delete();
        alert("Atividade removida!");
        carregarAtividades();
    } catch (error) {
        console.error("Erro ao excluir atividade:", error);
    }
}

// Atualizar resumo na tela
function atualizarResumo() {
    const conteudoResumo = document.getElementById('conteudoResumo');
    conteudoResumo.innerHTML = '';
    const categorias = {};

    atividades.forEach(atividade => {
        const { id, descricao, categoria, tipo, horas } = atividade;
        if (!categorias[categoria]) {
            categorias[categoria] = { totalHoras: 0, totalHorasAproveitadas: 0, tipos: {} };
        }
        categorias[categoria].totalHoras += horas;
        const horasAproveitadas = calcularHorasAproveitadas(tipo, horas, categorias[categoria].totalHorasAproveitadas);
        categorias[categoria].totalHorasAproveitadas += horasAproveitadas;

        if (!categorias[categoria].tipos[tipo]) {
            categorias[categoria].tipos[tipo] = { totalHoras: 0, totalHorasAproveitadas: 0, descricoes: [] };
        }
        categorias[categoria].tipos[tipo].totalHoras += horas;
        categorias[categoria].tipos[tipo].totalHorasAproveitadas += horasAproveitadas;
        categorias[categoria].tipos[tipo].descricoes.push({ descricao, id });
    });

    for (const categoria in categorias) {
        const categoriaDiv = document.createElement('div');
        categoriaDiv.innerHTML = `<h3>${categoria}</h3>
                                  <p>Total de Horas Registradas: ${categorias[categoria].totalHoras}</p>
                                  <p>Total de Horas Aproveitadas: ${categorias[categoria].totalHorasAproveitadas.toFixed(2)}</p>`;
        if (categorias[categoria].totalHorasAproveitadas > 90) {
            categoriaDiv.innerHTML += `<p style="color: red;">Limite de 90 horas aproveitadas excedido!</p>`;
        }

        for (const tipo in categorias[categoria].tipos) {
            const tipoDiv = document.createElement('div');
            tipoDiv.innerHTML = `<h4>${tipo}</h4>
                                 <p>Total de Horas: ${categorias[categoria].tipos[tipo].totalHoras}</p>
                                 <p>Total de Horas Aproveitadas: ${categorias[categoria].tipos[tipo].totalHorasAproveitadas.toFixed(2)}</p>
                                 <ul>`;

            categorias[categoria].tipos[tipo].descricoes.forEach(({ descricao, id }) => {
                tipoDiv.innerHTML += `<li>${descricao} 
                                      <button onclick="excluirAtividade('${id}')">Excluir</button></li>`;
            });

            tipoDiv.innerHTML += `</ul>`;
            categoriaDiv.appendChild(tipoDiv);
        }
        conteudoResumo.appendChild(categoriaDiv);
    }
}

// Listener para o formulário
document.getElementById('formularioAtividade').addEventListener('submit', function (event) {
    event.preventDefault();
    const descricao = document.getElementById('descricao').value;
    const categoria = document.getElementById('categoria').value;
    const tipo = document.getElementById('tipo').value;
    const horas = parseInt(document.getElementById('horas').value);

    if (horas < 0) {
        alert('Por favor, insira um valor positivo para as horas.');
        return;
    }

    const atividade = { descricao, categoria, tipo, horas };
    salvarAtividades([atividade]);
    document.getElementById('formularioAtividade').reset();
});

// Listener para limpar dados (não remove do Firestore)
document.getElementById('limparDados').addEventListener('click', function () {
    atividades = [];
    atualizarResumo();
    alert('Seus dados foram removidos da tela! (Não do banco)');
});

// Atualizar resumo ao carregar a página
window.onload = carregarAtividades;

