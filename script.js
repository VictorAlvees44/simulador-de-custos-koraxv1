const body = document.body

const themeButton = document.getElementById('themeButton')

themeButton.addEventListener('click', () => {

body.classList.toggle('dark-mode')

themeButton.innerHTML =
body.classList.contains('dark-mode')
? '☀️'
: '🌙'

})

let dados = {

mangueiras: [],
terminais: []

}

const urlMangueiras =
'https://docs.google.com/spreadsheets/d/e/2PACX-1vQBIr05e5XTDBezFYlrDwAp4yoPv7yD3mBKFaUsS_iZVdzSHvKEBd4YYrWZ44xicA/pub?gid=2060197991&single=true&output=csv'

const urlTerminais =
'https://docs.google.com/spreadsheets/d/e/2PACX-1vQWjGkv8RIrKAR6qRrLL7WrN_Wbe1ak0EJsF6pTtvmkJYl-ysSavN402W9oWQi2Jw/pub?gid=2028894131&single=true&output=csv'

const listaTerminais = [

'terminalA',
'terminalB',

'terminalExtra1',
'terminalExtra2',
'terminalExtra3',
'terminalExtra4'

]

function carregarDados(){

Papa.parse(urlMangueiras, {

download:true,
header:true,

complete:function(resultado){

    console.log(resultado.data)

dados.mangueiras = resultado.data.filter(
item => item.codigo
)

carregarSelect(
'mangueira',
dados.mangueiras
)

}

})

Papa.parse(urlTerminais, {

download:true,
header:true,

complete:function(resultado){

dados.terminais = resultado.data.filter(
item => item.codigo
)

listaTerminais.forEach(id => {

carregarSelect(
id,
dados.terminais
)

})

}

})

}

carregarDados()

function carregarSelect(id, lista){

const select =
document.getElementById(id)

if(!select) return

select.innerHTML = ''

if(id === 'mangueira'){

select.innerHTML += `

<option value="">
Selecione a mangueira
</option>

`

}else{

select.innerHTML += `

<option value="na">
Não se aplica
</option>

`

}

let options = ''

lista.forEach(item => {

options += `

<option value="${item.codigo}">
${item.codigo}
${item.descricao ? ' - ' + item.descricao : ''}
</option>

`

})

select.innerHTML += options

select.onchange = () => mostrarDescricao(id)

}

const faturamentoSelect =
document.getElementById('faturamento')

if(faturamentoSelect){

faturamentoSelect.addEventListener(
'change',
() => {

const campos = [

'mangueira',

'terminalA',
'terminalB',

'terminalExtra1',
'terminalExtra2',
'terminalExtra3',
'terminalExtra4'

]

campos.forEach(id => {

const campo =
document.getElementById(id)

if(campo){

campo.disabled = false

if(campo.value){

mostrarDescricao(id)

}

}

})


const botao =
document.getElementById('btnCalcular')

if(botao){

botao.disabled = false

botao.style.opacity = '1'

}

}
)

}

function mostrarDescricao(id){

const faturamento =
document.getElementById('faturamento').value

if(!faturamento){

alert(
'Selecione o faturamento primeiro.'
)

return

}
if(
document.getElementById('resultado')
.innerHTML !== ''
){

requestAnimationFrame(() => {
calcular()
})

}

const select =
document.getElementById(id)

if(!select) return

const valorSelecionadoItem =
select.value

const mapaDescricao = {

terminalA:'descTerminalA',
terminalB:'descTerminalB',

terminalExtra1:'descTerminalExtra1',
terminalExtra2:'descTerminalExtra2',
terminalExtra3:'descTerminalExtra3',
terminalExtra4:'descTerminalExtra4'

}

const mapaValor = {

terminalA:'valorTerminalA',
terminalB:'valorTerminalB',

terminalExtra1:'valorTerminalExtra1',
terminalExtra2:'valorTerminalExtra2',
terminalExtra3:'valorTerminalExtra3',
terminalExtra4:'valorTerminalExtra4'

}

if(valorSelecionadoItem === 'na'){

if(mapaDescricao[id]){

document.getElementById(
mapaDescricao[id]
).innerHTML =
'Item opcional.'

}

if(mapaValor[id]){

document.getElementById(
mapaValor[id]
).value = ''

}

return

}

let item

if(id === 'mangueira'){

item =
dados.mangueiras.find(
item =>
item.codigo === valorSelecionadoItem
)

if(!item) return

const valorSelecionado =
Number(
String(
item[faturamento] || 0
).replace(',','.')
)

document.getElementById(
'descMangueira'
).innerHTML = `

<b>
Valor por metro:
${moeda(valorSelecionado)}
</b>

`

document.getElementById(
'valorMangueira'
).value =
moedaInput(valorSelecionado)

return

}

item =
dados.terminais.find(
item =>
item.codigo === valorSelecionadoItem
)

if(!item) return

const valorSelecionado =
Number(
String(
item[faturamento] || 0
).replace(',','.')
)

if(mapaDescricao[id]){

document.getElementById(
mapaDescricao[id]
).innerHTML = `

${item.descricao || ''}

<br><br>

<b>
Valor:
${moeda(valorSelecionado)}
</b>

`

}

if(mapaValor[id]){

document.getElementById(
mapaValor[id]
).value =
moedaInput(valorSelecionado)

}

}

function formatarMoeda(campo){

campo.addEventListener(
'input',
e => {

let valor =
e.target.value.replace(/\D/g,'')

if(valor === ''){

e.target.value = ''
return

}

valor =
(Number(valor) / 100)
.toLocaleString(
'pt-BR',
{
minimumFractionDigits:2
}
)

e.target.value = valor

})

}

document.querySelectorAll(
'input[type="text"]'
).forEach(input => {

if(
!input.hasAttribute('readonly')
){

formatarMoeda(input)

}

})

function moeda(valor){

return valor.toLocaleString(
'pt-BR',
{
style:'currency',
currency:'BRL'
}
)

}

function moedaInput(valor){

return Number(valor)
.toLocaleString(
'pt-BR',
{
minimumFractionDigits:2
}
)

}

function valor(id){

const campo =
document.getElementById(id)

if(!campo) return 0

let v = campo.value

if(!v) return 0

v = String(v)

.replace(/\s/g,'')
.replace(/\./g,'')
.replace(',','.')

const numero = Number(v)

if(isNaN(numero)){

return 0

}

return numero

}


function calcular(){

const mm =
Number(
document.getElementById(
'milimetros'
).value
)

if(!mm){

alert(
'Digite o comprimento da mangueira.'
)

return

}

const valorMetro =
valor('valorMangueira')

const valorMangueira =
(valorMetro / 1000) * mm

let subtotal =

0

subtotal += valorMangueira

subtotal += valor('valorTerminalA')
subtotal += valor('valorTerminalB')

subtotal += valor('valorTerminalExtra1')
subtotal += valor('valorTerminalExtra2')
subtotal += valor('valorTerminalExtra3')
subtotal += valor('valorTerminalExtra4')

subtotal += valor('prensagem')
subtotal += valor('embalagem')

let desconto =
Number(
document.getElementById(
'desconto'
).value || 0
)

if(
desconto > 20 ||
desconto < 0
){

alert(
'Desconto máximo permitido é 20%'
)

return

}

let valorDesconto =
subtotal * (desconto / 100)

let totalFinal =
subtotal - valorDesconto

document.getElementById(
'resultado'
).innerHTML = `

<div class="resultado-item">
<span>Subtotal</span>
<span>${moeda(subtotal)}</span>
</div>

<div class="resultado-item">
<span>Desconto</span>
<span>${moeda(valorDesconto)}</span>
</div>

<div class="resultado-item">
<span class="total">
TOTAL FINAL
</span>

<span class="total">
${moeda(totalFinal)}
</span>
</div>

`

}

const campoMM =
document.getElementById('milimetros')

const infoMM =
document.getElementById('conversao-mm')

if(campoMM){

campoMM.addEventListener(
'input',
() => {

const mm =
Number(campoMM.value)

if(!mm){

infoMM.innerHTML =
'Digite o comprimento em milímetros.'

return

}

const cm = mm / 10
const metros = mm / 1000

if(metros >= 1){

infoMM.innerHTML = `Equivale a: <b>${metros.toFixed(2)} metros</b>
• ${cm.toFixed(0)} centímetros`

}else{

infoMM.innerHTML = `Equivale a: <b>${cm.toFixed(0)} centímetros</b>`

}

})

}
