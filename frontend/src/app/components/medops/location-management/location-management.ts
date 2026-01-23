import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocationService, PaginatedResponse } from '../../../services/medops/location.service';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { Location, CreateLocationDto, UpdateLocationDto } from '../../../models/medops';

interface LocationFormData {
  name?: string;
  province?: string;
  district?: string;
  address?: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-location-management',
  standalone: true,
  imports: [CommonModule, FormsModule, HasPermissionDirective],
  templateUrl: './location-management.html',
  styleUrl: './location-management.css',
})
export class LocationManagement implements OnInit {
  locations = signal<Location[]>([]);
  showLocationForm = signal<boolean>(false);
  editingLocation = signal<Location | null>(null);
  loading = signal<boolean>(false);

  // Pagination
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  totalItems = signal<number>(0);
  pageSize = 10;

  // Filters
  searchTerm = signal<string>('');
  activeFilter = signal<boolean | undefined>(undefined);

  // Form data
  locationForm = signal<LocationFormData>({
    name: '',
    province: '',
    district: '',
    address: ''
  });

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.loading.set(true);
    this.locationService.getAll(
      this.searchTerm() || undefined,
      this.activeFilter(),
      'createdAt',
      'DESC',
      this.currentPage(),
      this.pageSize
    ).subscribe({
      next: (response: PaginatedResponse<Location>) => {
        this.locations.set(response.data);
        this.totalPages.set(response.totalPages);
        this.totalItems.set(response.total);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading locations:', error);
        alert('Lokasyonlar yüklenirken hata oluştu');
        this.loading.set(false);
      }
    });
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadLocations();
  }

  onFilterChange(): void {
    this.currentPage.set(1);
    this.loadLocations();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadLocations();
    }
  }

  openLocationForm(location?: Location): void {
    if (location) {
      this.editingLocation.set(location);
      this.locationForm.set({
        name: location.name,
        province: location.province,
        district: location.district,
        address: location.address || '',
        isActive: location.isActive
      });
    } else {
      this.editingLocation.set(null);
      this.resetLocationForm();
    }
    this.showLocationForm.set(true);
  }

  closeLocationForm(): void {
    this.showLocationForm.set(false);
    this.editingLocation.set(null);
    this.resetLocationForm();
  }

  resetLocationForm(): void {
    this.locationForm.set({
      name: '',
      province: '',
      district: '',
      address: ''
    });
  }

  saveLocation(): void {
    const form = this.locationForm();

    // Validation
    if (!form.name?.trim()) {
      alert('Lütfen lokasyon adını giriniz');
      return;
    }

    if (!form.province?.trim()) {
      alert('Lütfen il bilgisini giriniz');
      return;
    }

    if (!form.district?.trim()) {
      alert('Lütfen ilçe bilgisini giriniz');
      return;
    }

    const editingLocation = this.editingLocation();

    if (editingLocation) {
      // Update existing location
      const updateDto: UpdateLocationDto = {
        name: form.name,
        province: form.province,
        district: form.district,
        address: form.address || undefined,
        isActive: form.isActive
      };

      this.locationService.update(editingLocation.id, updateDto).subscribe({
        next: () => {
          this.loadLocations();
          this.closeLocationForm();
        },
        error: (error) => {
          console.error('Error updating location:', error);
          alert(error.error?.message || 'Lokasyon güncellenirken hata oluştu');
        }
      });
    } else {
      // Create new location
      const createDto: CreateLocationDto = {
        name: form.name!,
        province: form.province!,
        district: form.district!,
        address: form.address || undefined
      };

      this.locationService.create(createDto).subscribe({
        next: () => {
          this.loadLocations();
          this.closeLocationForm();
        },
        error: (error) => {
          console.error('Error creating location:', error);
          alert(error.error?.message || 'Lokasyon oluşturulurken hata oluştu');
        }
      });
    }
  }

  deleteLocation(location: Location): void {
    if (!confirm(`"${location.name}" lokasyonunu deaktif etmek istediğinizden emin misiniz?`)) {
      return;
    }

    this.locationService.delete(location.id).subscribe({
      next: () => {
        this.loadLocations();
      },
      error: (error) => {
        console.error('Error deleting location:', error);
        alert('Lokasyon deaktif edilirken hata oluştu');
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('tr-TR');
  }
}
