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
    for(let i=0; i<palo.length; i++){    //Cada palo se combina con los números del 1 al 13.
      for(let j=1; j<=13; j++){
        carta = new Carta(j, palo[i])
        this.baraja.push(carta);         //Se añade la carta.
      }
    }
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
  }

  drawCard(carta){
    let card = document.createElement("div");
    card.classList.add("carta");
    elems.manoJugador.appendChild(card);
    let textoSup = document.createElement("div");
    let textoInf = document.createElement("div");

    textoSup.classList.add("texto_superior");
    textoInf.classList.add("texto_inferior");

    textoSup.textContent = `${carta.valor}${carta.palo}`;
    textoInf.textContent = `${carta.valor}${carta.palo}`;

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
    for(let i=0; i<this.jugadores.length; i++){
      if(this.jugadores[i].plantado === false){
        let carta = baraja.getCarta();
        this.jugadores[i].addCard(carta);
        this.jugadores[i].drawCard(carta);
      }
    }
    if(this.plantado===false){
      let carta = baraja.getCarta();
      this.addCard(carta);
      this.drawCard(carta);
    }
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
    let indice = 0;
    for(let i=0; i<this.jugadores.length; i++){
        if(Math.abs(21-this.jugadores[i].puntuacion) < Math.abs(21-this.jugadores[indice].puntuacion)){
          indice = i
        }
    }
    if(Math.abs(21-this.puntuacion) < Math.abs(21-this.jugadores[indice].puntuacion)){
      elems.marcador.textContent += "\n Gana: La " + this.nombre;
      //console.log("Gana: La " + this.nombre);
    }else{
      elems.marcador.textContent += "\n Gana: " + this.jugadores[0].nombre;
      //console.log("Gana: " + this.jugadores[indice].nombre);
    }
  }

  drawCard(carta){
    let card = document.createElement("div");
    card.classList.add("carta", "reves");
    elems.manoCrupier.appendChild(card);
  }


}


//-------------------------------------------INICIO----------------------------------------------

function repartir(){
  crupier.repartir(baraja);
  crupier.check_status();
}

function plantarse(){
  jugador1.plantarse();
  crupier.fin_partida();
}

//Crear baraja
let baraja = new Baraja();
baraja.barajar();

//Creacion jugadores
let jugador1 = new Jugador("Fernando");
let crupier = new Crupier();

crupier.addPlayer(jugador1);

//Inicio partida


