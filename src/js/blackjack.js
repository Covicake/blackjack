//Elementos HTML que se modifican en tiempo de ejecucion.
let elems = {
  botonCarta: document.querySelector(".botonCarta"),
  botonPlantar: document.querySelector(".botonPlantar"),
  marcador: document.querySelector(".marcador"),
  manoJugador: document.querySelector(".jugador"),
  manoCrupier: document.querySelector(".casa")
};

elems.botonCarta.onclick = repartir;
elems.botonPlantar.onclick = plantarse;


class Carta{
  constructor(valor, palo){
      this.valor = valor;
      this.palo = palo;
  }

  getSymbol(){  //Devuelve un simbolo en funcion del palo de la carta.
    let symbol;
    switch(this.palo){
      case "C":
      symbol = 	"&#x2764";
        break;
      case "R":
      symbol = "&#9830";
        break;
      case "T":
        symbol = "&#9827";
        break;
      default:
        symbol = "&#9824";
        break;
    }
    return symbol;
  }
}

class Baraja{  //Construye y almacena un array de objetos Carta.
  constructor(){
    this.baraja = [];
  }

  barajar(){
    let palo = ["T", "P", "C", "R"];
    let carta;
    palo.forEach(p =>{
      for(let j=1; j<=13; j++){
        carta = new Carta(j, p)
        this.baraja.push(carta);
      }
    });
    this.baraja = _.shuffle(this.baraja);
  }

  getCarta(){  //Devuelve y elimina una carta de la baraja.
    let carta = this.baraja.pop();
    return carta;
  }
}

class Jugador{
  constructor(nombre){
    this.nombre = nombre;
    this.mano = [];
    this.plantado = false;     
    this.puntuacion = 0;       
  }

  plantarse(){
    this.plantado = true;
  }

  addCard(carta){
    this.mano.push(carta);
    this.puntuacion += carta.valor;
    this.drawCard(carta);
  }

  drawCard(carta){  //Representa graficamente la carta modificando el html.
    let card = document.createElement("div");
    card.classList.add("carta");
    elems.manoJugador.appendChild(card);
    let textoSup = document.createElement("div");
    let textoInf = document.createElement("div");

    textoSup.classList.add("texto_superior");
    textoInf.classList.add("texto_inferior");
    
    let symbol = carta.getSymbol();

    textoSup.innerHTML = `${carta.valor} ${symbol}`;
    textoInf.innerHTML = `${carta.valor} ${symbol}`;

    card.appendChild(textoSup);
    card.appendChild(textoInf);
  }
}

class Crupier extends Jugador{
  constructor(){
    super("Casa");
    this.jugadores = [];
  }

  addPlayer(jugador){
    this.jugadores.push(jugador);
  }

  repartir(baraja){
    this.jugadores.forEach(j=>{
      if (!j.plantado){
        j.addCard(baraja.getCarta());
      }
    });
      this.addCard(baraja.getCarta());
    }

  check_status(){
    elems.marcador.textContent = `${this.jugadores[0].nombre}: ${this.jugadores[0].puntuacion} - ${this.nombre}: ${this.puntuacion}`;
  }

  fin_partida(){
    this.jugadores.forEach(j=>{
      if(j.puntuacion >= 21 && this.puntuacion >= 21){
        elems.marcador.textContent += " Partida nula";
      }else if((j.puntuacion > this.puntuacion || this.puntuacion > 21) && j.puntuacion <= 21){
        elems.marcador.textContent += " Gana: " + j.nombre;
      }else if((this.puntuacion > j.puntuacion || j.puntuacion >21) && this.puntuacion <= 21){
        elems.marcador.textContent += " Gana: La " + this.nombre;
      }
    });
    elems.botonCarta.textContent = "Nueva partida";
    elems.botonCarta.onclick = nuevaPartida;
  }

  drawCard(carta){
    let card = document.createElement("div");
    card.classList.add("carta");
    elems.manoCrupier.appendChild(card);

    let textoSup = document.createElement("div");
    let textoInf = document.createElement("div");

    textoSup.classList.add("texto_superior");
    textoInf.classList.add("texto_inferior");
    
    let symbol = carta.getSymbol();

    textoSup.innerHTML = `${carta.valor} ${symbol}`;
    textoInf.innerHTML = `${carta.valor} ${symbol}`;

    card.appendChild(textoSup);
    card.appendChild(textoInf);    
  }
}
//-------------------------------------------INICIO----------------------------------------------
let baraja;
let jugador1;
let crupier;
nuevaPartida();

function repartir(){
  crupier.repartir(baraja);
  crupier.check_status();
}

function plantarse(){
  jugador1.plantarse();
  crupier.fin_partida();
  elems.botonPlantar.onclick = "";
}

function nuevaPartida(){
  baraja = new Baraja();
  baraja.barajar();

  jugador1 = new Jugador("Fernando");
  crupier = new Crupier();
  crupier.addPlayer(jugador1);

  elems.marcador.textContent = "";
  elems.manoCrupier.textContent = "";
  elems.manoJugador.textContent = "";
  elems.botonCarta.textContent = "Pedir carta";
  elems.botonCarta.onclick = repartir;
  elems.botonPlantar.onclick = plantarse;
}