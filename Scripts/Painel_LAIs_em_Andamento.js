// ==UserScript==
// @name         Contador LAI Oficial (Projeto Lumen)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Soma automática para o sistema da PMV (Até 10, +10, Vencidas e Total)
// @author       Vinícios Campos
// @match        *://sistemas.vitoria.es.gov.br/sic/admin/pmv/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function executarSoma() {
        const linhas = document.querySelectorAll('tr');
        
        let ate10 = 0;
        let mais10 = 0;
        let vencidas = 0;

        linhas.forEach(linha => {
            const colunas = linha.querySelectorAll('td');
            
            // Filtra linhas que realmente são do grupo LAI
            // Verifica se tem colunas suficientes (agora precisamos de pelo menos 4 colunas de dados)
            if (colunas.length >= 4 && linha.innerText.includes('LAI -')) {
                
                // ParseInt converte o texto para número. O "|| 0" evita erro se o campo estiver vazio.
                // colunas[1] = Até 10 dias
                // colunas[2] = Mais de 10 dias
                // colunas[3] = Vencidas (Assumindo que seja a próxima coluna visual)
                
                ate10 += parseInt(colunas[1].innerText) || 0;
                mais10 += parseInt(colunas[2].innerText) || 0;
                vencidas += parseInt(colunas[3].innerText) || 0;
            }
        });

        // Calcula o total geral de pedidos ativos
        const totalGeral = ate10 + mais10 + vencidas;

        // Se houver algum dado somado, exibe o painel
        if (totalGeral > 0) {
            criarPainel(ate10, mais10, vencidas, totalGeral);
        }
    }

    function criarPainel(a, m, v, t) {
        // Evita criar painéis duplicados se a função rodar duas vezes
        let p = document.getElementById('resumo-lai');
        if (p) p.remove();

        p = document.createElement('div');
        p.id = 'resumo-lai';
        document.body.appendChild(p);
        
        // Estilização do Painel
        p.style = `
            position: fixed; 
            top: 70px; 
            right: 20px; 
            background: white; 
            color: #333; 
            padding: 15px; 
            z-index: 9999; 
            border-radius: 8px; 
            box-shadow: 0 4px 15px rgba(0,0,0,0.2); 
            font-family: 'Segoe UI', Arial, sans-serif; 
            border: 1px solid #ccc;
            border-left: 5px solid #007bff;
            min-width: 180px;
        `;

        p.innerHTML = `
            <div style="font-weight:bold; margin-bottom:10px; font-size:16px; border-bottom:1px solid #eee; padding-bottom:5px;">
                📊 TOTAIS ATIVOS
            </div>
            <div style="font-size:14px; line-height: 1.6;">
                Até 10 dias: <b style="color:green; float:right">${a}</b><br>
                Mais de 10 dias: <b style="color:orange; float:right">${m}</b><br>
                Vencidas: <b style="color:firebrick; float:right">${v}</b>
            </div>
            <hr style="margin: 8px 0; border: 0; border-top: 1px solid #eee;">
            <div style="font-size:15px; font-weight:bold; color:#000;">
                TOTAL GERAL: <span style="float:right">${t}</span>
            </div>
            <div style="text-align:right; margin-top:10px;">
                <button id="btn-fechar-painel" style="cursor:pointer; background:#f0f0f0; border:none; padding:5px 10px; border-radius:4px; font-size:12px;">Fechar</button>
            </div>
        `;

        // Adiciona evento de clique ao botão fechar
        document.getElementById('btn-fechar-painel').onclick = function() {
            p.remove();
        };
    }

    // Aguarda a página carregar e roda a função
    setTimeout(executarSoma, 2000);
})();