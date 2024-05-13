export class Saveannonce{
    constructor(
        public id?:number,
        public type_d_hebergement?:string,
        public nb_voyageur?:number,
        public nb_chamber?:number,
        public nb_lits?:number,
        public nb_salles?:number,
        public equipement?:string[],
        public equipement_specail?:string[],
        public equipement_securite?:string[],
        public image?:string,
        public titre?:string,
        public description?:string,
        public reduction_semaine?:boolean,
        public reduction_mois?:boolean,
        public prix?:string,
        public pays?:string,
        public etat?:boolean,
        public ville?:string,
        public code_postale?:string,
        public heure_depart?:string,
        public heure_arriver?:string,
        public date?:string,
        public id_annonceur?:number
    ){}
}