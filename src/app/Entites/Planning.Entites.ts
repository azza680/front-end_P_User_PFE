export class Planning{
    constructor(
        public id?: number,
        public heureDisponible?: string,
        public jour?: string,
        public adresse?: string,
        public prixParHeure?: string,
        public id_fdm?: number,  // Assurez-vous que cela est défini comme number
        public gouvernorat?: string
    ){}
}