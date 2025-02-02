let tamanhoMatriz=20;
let qtdePalavras=12;
let listaPalavras=[];
let lista=[];
let matrizLetras=[];
let auxMatriz=[];

 function listaHTML(sentido){
	switch (sentido) {
  case 1:
    tipoSentido = 'horizontal';
    break;
  case tamanhoMatriz:
    tipoSentido = 'vertical';
    break;
  case tamanhoMatriz - 1:
    tipoSentido = 'diagonal Esquerda';
    break;
  case tamanhoMatriz + 1:
    tipoSentido = 'diagonal Direita';
    break;
  default:
    alert('sentido inválido');
}

 return tipoSentido;
}

async function inserirPalavra(){
    const url = "https://api.dicionario-aberto.net/random";
    try {

       const response = await fetch(url);
       if (!response.ok) {
         throw new Error(`Response status: ${response.status}`);
       }

       let json = await response.json();
	     let palavra= (json.word.length < tamanhoMatriz) && json.word ;
       let inverso= Math.random()>=0.5;
       let sentidos=[1, (tamanhoMatriz), (tamanhoMatriz-1), (tamanhoMatriz+1)]; //1, 20, 19,21
	     let sentido=sentidos[Math.floor(Math.random()*sentidos.length)];
	     let inicio= posicaoInicial(palavra, sentido);
	   
	     let meuSentido=listaHTML(sentido);
	     lista.push({palavra, meuSentido, inicio});
		
       if(inverso){
        palavra=palavra.split("").reverse().join("");
       }
       
       return {palavra, inverso, sentido, inicio };
    } catch (error) {
        console.error(error.message);
    }

}

 function posicaoInicial(palavra,sentido){
	 
  let inicio= Math.floor(Math.random()*(tamanhoMatriz**2));
  let finalPalavraHorizontal=inicio%tamanhoMatriz+tamanhoPalavra;
  let diagonalEsquerda= tamanhoMatriz-1;
  let diagonalDireita = tamanhoMatriz+1;
  let tamanhoPalavra = palavra.length;

  
  
  if(sentido==tamanhoMatriz && inicio+(tamanhoMatriz*(tamanhoPalavra-1)) >= tamanhoMatriz**2){  
    inicio -= inicio+(tamanhoMatriz*(tamanhoPalavra))-tamanhoMatriz**2;
  }
  
  if(sentido==diagonalEsquerda && (inicio+((tamanhoPalavra-1)*tamanhoMatriz)-tamanhoPalavra) > tamanhoMatriz**2){
    inicio = inicio + tamanhoPalavra -((tamanhoPalavra-1)*tamanhoMatriz);
  }
  
  if(sentido==diagonalDireita && (inicio+(tamanhoPalavra-1)*(tamanhoMatriz+1))> tamanhoMatriz**2 ){
    inicio += -1*((tamanhoPalavra-1)*(tamanhoMatriz+1));
  }
  
  let comeco=inicio;
  for(let j=0;j<palavra.length;j++){
	if(sentido==1 &&  finalPalavraHorizontal > tamanhoMatriz){
        inicio -= finalPalavraHorizontal-tamanhoMatriz; 
	}else if(sentido==tamanhoMatriz-1 && j<palavra.length-1 && comeco % tamanhoMatriz ==	tamanhoMatriz-1){
		inicio += palavra.length-j; 
	}else if(sentido==tamanhoMatriz+1 && comeco > inicio && comeco % tamanhoMatriz == 0){
		inicio -= palavra.length-j; 
	}else{
		comeco+=sentido;
	}
 }
  
  return inicio;
}


async function bancoPalavras(){
	
  let i=0;
   
  do{
	  
	
    let palavraData = await inserirPalavra();
    document.body.querySelector('ol').innerHTML+=`<li>${lista[i].palavra}</li>`;
    if (palavraData) {
      listaPalavras.push(palavraData); // lista das palavras do jogo
    };
    i++;
  }while(i < qtdePalavras);
  return listaPalavras;
}

async function tratarColisoes(){
  await bancoPalavras();
  for(let i=0;i<listaPalavras.length;i++){
    let {palavra, inverso, sentido, inicio}=listaPalavras[i];
	let comeco=inicio;
    let k=0;
	
    for(let j=0;j<palavra.length;j++){
	
      //verificar se a posicao já esta ocupada
	  if((auxMatriz.indexOf(comeco) > -1) && palavra[comeco]!=palavra[j]){
        posicaoInicial(palavra,sentido);
		break;
		
      }else{
		auxMatriz.push(comeco);  
        comeco += (sentido);	
	  } 	
    }
    console.log(auxMatriz);	
  }
}

async function Main(){
	await bancoPalavras();
  await tratarColisoes()

	try{
				
		for(let i=0;i<listaPalavras.length;i++){
			let {palavra, inverso, sentido, inicio}=listaPalavras[i];

			for(let j=0;j<palavra.length;j++){

				if(!matrizLetras[inicio] || matrizLetras[inicio]===palavra[i]){
				
					matrizLetras[inicio]=palavra[j];
				
				}
				inicio += (sentido);	
			} 
		}
		
		const tblElement = document.createElement('table');
		for(let i=0;i<tamanhoMatriz**2;i++){
			const tdElement = document.createElement('td');
			
			if(!matrizLetras[i]){
				let ascii=Math.floor(Math.random() * (90 - 65) + 65);
				let texto= String.fromCharCode(ascii);
				matrizLetras[i]=texto;
			}

			if (matrizLetras[i]===matrizLetras[i].toLowerCase()) {
				tdElement.style.color = "blue";
			}
			tdElement.appendChild(document.createTextNode(`${matrizLetras[i]}`));

			//tdElement.innerHTML+=`<sup>${i}</sup>`
			tblElement.appendChild(tdElement);
			if ((i + 1) % 20 === 0) {
				tblElement.appendChild(document.createElement('tr'));
			}
		}
		document.body.appendChild(tblElement);
		
	}catch(error){
		 console.error(error.message);
	}
}

Main();

