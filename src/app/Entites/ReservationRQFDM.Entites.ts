export class ReservationRQFDM{
    constructor(
        public id?:number,
        public id_client?:number,
        public id_planification?:number,
        public date?:string,
        public montant_paye?:number,
        public etat?:boolean,
        public confirmation?:boolean
        
    ){}
}