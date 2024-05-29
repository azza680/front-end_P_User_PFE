export class ReservationRq{
    constructor(
    public id?: number,
    public id_client?: number,
    public id_annonce?: number,
    public date_arrivee?: string,
    public date_depart?: string,
    public nb_nuit?: number,
    public nb_vacancier?: number,
    public date?: string,
    public montant_paye?: number,
    public etat?: boolean,
    public confirmation?: boolean,
    public annonce?: any 
 
    ){}
}