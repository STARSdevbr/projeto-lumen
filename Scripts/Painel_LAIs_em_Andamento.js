// ==UserScript==
// @name         Contador LAI Oficial
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Soma automatica para o sistema da PMV
// @author       Gemini
// @match        *://sistemas.vitoria.es.gov.br/sic/admin/pmv/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function executarSoma() {
        const linhas = document.querySelectorAll('tr');
        let ate10 = 0;
        let mais10 = 0;
        let grupos = 0;

        linhas.forEach(linha => {
            const colunas = linha.querySelectorAll('td');
            // Filtra linhas que realmente são do grupo LAI
            if (colunas.length >= 4 && linha.innerText.includes('LAI -')) {
                grupos++;
                // Somando os valores das colunas 2 e 3
                ate10 += parseInt(colunas[1].innerText) || 0;
                mais10 += parseInt(colunas[2].innerText) || 0;
            }
        });

        if (grupos > 0) {
            criarPainel(grupos, ate10, mais10);
        }
    }

    function criarPainel(g, a, m) {
        let p = document.getElementById('resumo-lai');
        if (!p) {
            p = document.createElement('div');
            p.id = 'resumo-lai';
            document.body.appendChild(p);
        }
        p.style = 'position:fixed; top:70px; right:20px; background:white; color:black; padding:15px; z-index:9999; border-radius:8px; box-shadow:0 0 15px rgba(0,0,0,0.3); font-family:Arial; border:2px solid #007bff;';
        p.innerHTML = `
            <div style="font-weight:bold;margin-bottom:5px">📊 TOTAIS ATIVOS</div>
            <div style="font-size:14px">
                Grupos: <b>${g}</b><br>
                Até 10 dias: <b style="color:green">${a}</b><br>
                Mais de 10 dias: <b style="color:red">${m}</b>
            </div>
            <button onclick="this.parentElement.remove()" style="margin-top:8px; cursor:pointer">Fechar</button>
        `;
    }

    // Aguarda a página carregar e roda a função
    setTimeout(executarSoma, 2000);
})();