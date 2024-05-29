import { Component, OnInit } from '@angular/core';
import { CrudService } from '../service/crud.service';
import { Router } from '@angular/router';
import { Annonce } from '../Entites/Annonce.Entites';

@Component({
  selector: 'app-liste-annonces-public',
  templateUrl: './liste-annonces-public.component.html',
  styleUrls: ['./liste-annonces-public.component.css']
})
export class ListeAnnoncesPublicComponent implements OnInit {
  listAnnonce: Annonce[];
  searchQuery: string = '';
  selectedCountry: string = '';
  activeAnnonce: string = '';

  constructor(private service: CrudService, private router: Router) { }

  ngOnInit(): void {
    this.getAnnonces();
  }

  detailannonce(id: number): void {
    this.router.navigate(['/detailannonce', id]);
  }

  searchAnnonces(): void {
    this.getAnnonces(); // Recharge les annonces à chaque recherche
  }

  private getAnnonces(): void {
    this.service.getAnnonce().subscribe(annonces => {
      this.listAnnonce = annonces.filter(annonce => {
        return (this.searchQuery.trim() === '' || annonce.type_d_hebergement?.toLowerCase().includes(this.searchQuery.toLowerCase())) &&
               (this.selectedCountry === '' || annonce.pays === this.selectedCountry);
      });
    });
  }

  get filteredAnnonce(): Annonce[] {
    let filtered = this.listAnnonce;

    if (this.activeAnnonce) {
      filtered = filtered.filter(annonce => annonce.type_d_hebergement === this.activeAnnonce);
    }

    return filtered;
  }
}
