let elems = {
  botonCarta: document.querySelector(".botonCarta"),
  botonPlantar: document.querySelector(".botonPlantar"),
  marcador: document.querySelector(".marcador"),
  manoJugador: document.querySelector(".jugador"),
  manoCrupier: document.querySelector(".casa")
};

elems.botonCarta.onclick = repartir;
elems.botonPlantar.onclick = plantarse;

/**Clase que representa una Carta */
class Carta{
  /**
   * Crea una Carta.
   * @param {Number} valor Valor numérico de la carta.
   * @param {String} palo El palo al que pertenece la carta.
   */
  constructor(valor, palo){
      this.valor = valor;
      this.palo = palo;
  }

  /**
   * Metodo para conseguir un simbolo que representa el palo de la carta
   * @return {String}
   */
  getSymbol(){
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

/**Clase que representa una baraja de cartas */
class Baraja{
  /**
   * Crea un contenedor para la baraja.
   */
  constructor(){
    this.baraja = [];
  }

  /**
   * Crea una baraja rellenando el contenedor con instancias de la clase carta.
   */
  barajar(){
    let palo = ["T", "P", "C", "R"];
    let carta;
    palo.forEach(p =>{
      for(let j=1; j<=13; j++){
        carta = new Carta(j, p)
        this.baraja.push(carta);         //Se añade la carta.
      }
    });    //Cada palo se combina con los números del 1 al 13.
  }

  /**
   * Retira una carta al azar de la baraja (y la elimina de ésta).
   * @return {Carta} la carta retirada.
   */
  getCarta(){
    let carta = new Carta();
    let indice_aleatorio = (Math.floor(Math.random()*this.baraja.length));
    carta = this.baraja[indice_aleatorio];
    this.baraja.splice(indice_aleatorio, 1);
    return carta;
  }

}

/**
 * Clase que representa un jugador de blackjack.
 */
class Jugador{

  /**
   * Crea un jugador a partir de un nombre.
   * @param {String} nombre Nombre del jugador a crear.
   */
  constructor(nombre){
    this.nombre = nombre;
    this.mano = [];             //Almacena las cartas que vaya recibiendo el jugador.
    this.plantado = false;      //Si el jugador se planta, cambia a true y deja de recibir cartas.
    this.puntuacion = 0;        //Almacena la suma del valor de las cartas de mano.
  }

  /**
   * Metodo que cambia el estado del jugador cuando no desea recibir más cartas.
   */
  plantarse(){
    this.plantado = true;
  }

  /**
   * Metodo para agregar una carta a la mano del jugador.
   * @param {Carta} carta la carta que se desea agregar a la mano.
   */
  addCard(carta){
    this.mano.push(carta);
    this.puntuacion += carta.valor;   //Cada vez que recibe una carta nueva, se suma su valor a puntuacion
    this.drawCard(carta);
  }

  drawCard(carta){
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

/**
 * Clase que representa un crupier
 * @extends Jugador
 */
class Crupier extends Jugador{

  /**
   * Crea un Crupier
   */
  constructor(){
    super("Casa");  //El nombre del crupier siempre es "Casa".
    this.jugadores = [];   //Almacena los jugadores que estén en la partida.

  }

  /**
   * Metodo para agregar un jugador a la partida.
   * @param {Jugador} jugador Jugador que desea unirse a la partida.
   */
  addPlayer(jugador){
    this.jugadores.push(jugador);
  }

  /**
   * Metodo para repartir cartas a los jugadores que no estan plantados.
   * @param {Baraja.baraja} baraja El array que contiene las cartas de la baraja que se usa para repartir.
   */
  repartir(baraja){
    this.jugadores.forEach(j=>{
      if (!j.plantado){
        j.addCard(baraja.getCarta());
      }
    });
      this.addCard(baraja.getCarta());
    }

  /**
   * Metodo para comprobar si la partida ha terminado
   */
  check_status(){  //Llama a "fin_partida" si todos los jugadores y el crupier están plantados.
    elems.marcador.textContent = `${this.jugadores[0].nombre}: ${this.jugadores[0].puntuacion} - ${this.nombre}: ${this.puntuacion}`;
  }

  /**
   * Cuando la partida acaba, se comprueba qué jugador obtuvo una puntuacion mas cercana a 21.
   */
  fin_partida(){
    this.jugadores.forEach(j=>{
      if(j.puntuacion >= 21 && this.puntuacion >= 21){
        elems.marcador.textContent += "Partida nula";
      }else if((j.puntuacion > this.puntuacion || this.puntuacion >= 21) && j.puntuacion <= 21){
        elems.marcador.textContent += "Gana: " + j.nombre;
      }else if((this.puntuacion > j.puntuacion || j.puntuacion >=21) && this.puntuacion <= 21){
        elems.marcador.textContent += "Gana: La " + this.nombre;
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
}


//Inicio partida


