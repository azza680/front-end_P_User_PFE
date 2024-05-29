export class Reservation{
    constructor(
        public id?:number,
        public date_arrivee?:string,
        public date_depart?:string,
        public nb_nuit?:number,
        public nb_vacancier?:number,
        public date?:string,
        public montant_paye?:number,
        public etat?:boolean,
        public confirmation?:boolean
        
    ){}
}