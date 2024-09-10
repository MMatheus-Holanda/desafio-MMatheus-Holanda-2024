class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanho: 10, animais: ['macaco', 'macaco', 'macaco'] },
            { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: ['gazela'] },
            { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanho: 9, animais: ['leao'] }
        ];

        this.animais = {
            'LEAO': { tamanho: 3, bioma: ['savana'], carnivoro: true },
            'LEOPARDO': { tamanho: 2, bioma: ['savana'], carnivoro: true },
            'CROCODILO': { tamanho: 3, bioma: ['rio'], carnivoro: true },
            'MACACO': { tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false },
            'GAZELA': { tamanho: 2, bioma: ['savana'], carnivoro: false },
            'HIPOPOTAMO': { tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false }
        };
    }

    analisaRecintos(tipoAnimal, quantidade) {
        if (!this.animais[tipoAnimal]) {
            return { erro: "Animal inválido" };
        }

        if (quantidade <= 0 || !Number.isInteger(quantidade)) {
            return { erro: "Quantidade inválida" };
        }

        const animal = this.animais[tipoAnimal];
        const espacoNecessario = quantidade * animal.tamanho;
        const recintosViaveis = this.recintos.filter(recinto => {
            const biomasRecinto = recinto.bioma.split(' e ').map(b => b.trim());

            // Validar se o bioma do recinto é compatível
            if (!animal.bioma.some(bioma => biomasRecinto.includes(bioma))) {
                return false;
            }

            const espacoOcupadoAtual = recinto.animais.reduce((total, especie) => {
                const especieMaiuscula = especie.toUpperCase();
                const tamanhoAnimal = this.animais[especieMaiuscula] ? this.animais[especieMaiuscula].tamanho : 0;
                return total + tamanhoAnimal;
            }, 0);

            // Verificar se já há espécies diferentes no recinto (espaço extra antes)
            const espacoExtraAntes = recinto.animais.length > 0 && !recinto.animais.every(a => a.toUpperCase() === tipoAnimal) ? 1 : 0;
            const espacoLivre = recinto.tamanho - espacoOcupadoAtual - espacoExtraAntes;

            // Verificar se a adição de novos animais criará uma segunda espécie (espaço extra depois)
            const espacoExtraDepois = recinto.animais.length === 0 || recinto.animais.every(a => a.toUpperCase() === tipoAnimal) ? 0 : 1;
            const espacoNecessarioTotal = espacoNecessario + espacoExtraDepois;

            // Regras específicas para carnívoros
            if (animal.carnivoro && recinto.animais.length > 0 && recinto.animais[0].toUpperCase() !== tipoAnimal) {
                return false;
            }

            if (recinto.animais.length > 0) {
                const especieExistente = recinto.animais[0];
                if (this.animais[especieExistente.toUpperCase()].carnivoro && especieExistente.toUpperCase() !== tipoAnimal) {
                    return false;
                }
            }

            // Regras específicas para macacos (não podem estar sozinhos no recinto vazio)
            if (tipoAnimal === 'MACACO' && recinto.animais.length === 0 && quantidade < 2) {
                return false;
            }

            // Regras específicas para hipopótamos
            if (tipoAnimal === 'HIPOPOTAMO' && recinto.animais.length > 0 && !biomasRecinto.includes('savana') && !biomasRecinto.includes('rio')) {
                return false;
            }

            // Verificar se o espaço livre é suficiente
            if (espacoLivre >= espacoNecessarioTotal) {
                return true;
            }

            return false;
        });

        if (recintosViaveis.length > 0) {
            const resultado = recintosViaveis.map(recinto => {
                const espacoOcupadoAtual = recinto.animais.reduce((total, especie) => {
                    const especieMaiuscula = especie.toUpperCase();
                    const tamanhoAnimal = this.animais[especieMaiuscula] ? this.animais[especieMaiuscula].tamanho : 0;
                    return total + tamanhoAnimal;
                }, 0);

                // Verificar se já há espécies diferentes no recinto (espaço extra antes)
                const espacoExtraAntes = recinto.animais.length > 0 && !recinto.animais.every(a => a.toUpperCase() === tipoAnimal) ? 1 : 0;
                const espacoLivre = recinto.tamanho - espacoOcupadoAtual - espacoExtraAntes;

                // Verificar se a adição de novos animais criará uma segunda espécie (espaço extra depois)
                const espacoExtraDepois = recinto.animais.length === 0 || recinto.animais.every(a => a.toUpperCase() === tipoAnimal) ? 0 : 1;
                const espacoNecessarioTotal = espacoNecessario + espacoExtraDepois;

                const espacoFinalLivre = espacoLivre - espacoNecessarioTotal;

                return `Recinto ${recinto.numero} (espaço livre: ${espacoFinalLivre + espacoExtraDepois} total: ${recinto.tamanho})`;
            }).sort();

            return { recintosViaveis: resultado };
        } else {
            return { erro: "Não há recinto viável" };
        }
    }
}

export { RecintosZoo as RecintosZoo };

const zoo = new RecintosZoo();
const resultado = zoo.analisaRecintos('MACACO', 2);
console.log(resultado);
