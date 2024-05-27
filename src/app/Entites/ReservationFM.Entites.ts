import { Planning } from "./Planning.Entites";
import { Utilisateur } from "./Utilisateur.Entites";

export class ReservationFM {
    constructor(
      public id?: number,
      public montant_paye?: string,
      public date?: Date,
      public etat?: boolean,
      public confirmation?: boolean,
      public id_planification?: number, 
      public id_client?: number,
      public utilisateur?: Utilisateur,
      public planning?: Planning,
      public planification?: { 
        fdm: { 
          nom: string, 
          prenom: string 
        }, 
        heureDisponible: string,
        jour: string,
        adresse: string,
        prixParHeure: string,
      }
    ) { }

  }