import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../../services/medops/vehicle.service';
import { Vehicle } from '../../../models/medops';

@Component({
  selector: 'app-vehicle-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle-view.html',
  styleUrl: './vehicle-view.css',
})
export class VehicleView implements OnInit {
  vehicle = signal<Vehicle | null>(null);
  loading = signal<boolean>(true);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadVehicle(+id);
    } else {
      this.loading.set(false);
    }
  }

  loadVehicle(id: number): void {
    this.loading.set(true);
    this.vehicleService.getById(id).subscribe({
      next: (vehicle) => {
        this.vehicle.set(vehicle);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading vehicle:', error);
        alert('Araç bilgileri yüklenirken hata oluştu');
        this.loading.set(false);
        this.close();
      }
    });
  }

  close(): void {
    window.close();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
