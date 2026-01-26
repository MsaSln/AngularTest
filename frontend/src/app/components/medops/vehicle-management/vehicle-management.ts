import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService, PaginatedResponse } from '../../../services/medops/vehicle.service';
import { WindowManagerService } from '../../../services/window-manager.service';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { Vehicle, CreateVehicleDto, UpdateVehicleDto } from '../../../models/medops';

interface VehicleFormData {
  plateProvince?: string;
  plateLetters?: string;
  plateNumbers?: string;
  vehicleNumber?: string;
  brand?: string;
  model?: string;
  phoneTelsiz?: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-vehicle-management',
  standalone: true,
  imports: [CommonModule, FormsModule, HasPermissionDirective],
  templateUrl: './vehicle-management.html',
  styleUrl: './vehicle-management.css',
})
export class VehicleManagement implements OnInit {
  vehicles = signal<Vehicle[]>([]);
  showVehicleForm = signal<boolean>(false);
  editingVehicle = signal<Vehicle | null>(null);
  loading = signal<boolean>(false);

  // Vehicle view modal
  showVehicleView = signal<boolean>(false);
  viewingVehicle = signal<Vehicle | null>(null);

  // Pagination
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  totalItems = signal<number>(0);
  pageSize = 10;

  // Filters
  searchTerm = signal<string>('');
  activeFilter = signal<boolean | undefined>(undefined);

  // Form data
  vehicleForm = signal<VehicleFormData>({
    plateProvince: '',
    plateLetters: '',
    plateNumbers: '',
    vehicleNumber: '',
    brand: '',
    model: '',
    phoneTelsiz: ''
  });

  constructor(
    private vehicleService: VehicleService,
    private windowManagerService: WindowManagerService
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.loading.set(true);
    this.vehicleService.getAll(
      this.searchTerm() || undefined,
      this.activeFilter(),
      'createdAt',
      'DESC',
      this.currentPage(),
      this.pageSize
    ).subscribe({
      next: (response: PaginatedResponse<Vehicle>) => {
        this.vehicles.set(response.data);
        this.totalPages.set(response.totalPages);
        this.totalItems.set(response.total);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
        alert('Failed to load vehicles');
        this.loading.set(false);
      }
    });
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadVehicles();
  }

  onFilterChange(): void {
    this.currentPage.set(1);
    this.loadVehicles();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadVehicles();
    }
  }

  openVehicleForm(vehicle?: Vehicle): void {
    if (vehicle) {
      this.editingVehicle.set(vehicle);
      this.vehicleForm.set({
        plateProvince: vehicle.plateProvince,
        plateLetters: vehicle.plateLetters,
        plateNumbers: vehicle.plateNumbers,
        vehicleNumber: vehicle.vehicleNumber,
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        phoneTelsiz: vehicle.phoneTelsiz || '',
        isActive: vehicle.isActive
      });
    } else {
      this.editingVehicle.set(null);
      this.resetVehicleForm();
    }
    this.showVehicleForm.set(true);
  }

  closeVehicleForm(): void {
    this.showVehicleForm.set(false);
    this.editingVehicle.set(null);
    this.resetVehicleForm();
  }

  resetVehicleForm(): void {
    this.vehicleForm.set({
      plateProvince: '',
      plateLetters: '',
      plateNumbers: '',
      vehicleNumber: '',
      brand: '',
      model: '',
      phoneTelsiz: ''
    });
  }

  saveVehicle(): void {
    const form = this.vehicleForm();

    // Validation
    if (!form.plateProvince?.trim() || !form.plateLetters?.trim() || !form.plateNumbers?.trim()) {
      alert('Lütfen plaka bilgilerini eksiksiz giriniz');
      return;
    }

    if (!form.vehicleNumber?.trim()) {
      alert('Lütfen araç numarasını giriniz');
      return;
    }

    // Validate plate format
    if (!/^\d{2,3}$/.test(form.plateProvince)) {
      alert('Plaka il kodu 2-3 rakam olmalıdır');
      return;
    }

    if (!/^[A-Z]{1,5}$/.test(form.plateLetters.toUpperCase())) {
      alert('Plaka harfleri 1-5 büyük harf olmalıdır');
      return;
    }

    if (!/^\d{1,5}$/.test(form.plateNumbers)) {
      alert('Plaka numarası 1-5 rakam olmalıdır');
      return;
    }

    const editingVehicle = this.editingVehicle();

    if (editingVehicle) {
      // Update existing vehicle
      const updateDto: UpdateVehicleDto = {
        plateProvince: form.plateProvince,
        plateLetters: form.plateLetters.toUpperCase(),
        plateNumbers: form.plateNumbers,
        vehicleNumber: form.vehicleNumber,
        brand: form.brand || undefined,
        model: form.model || undefined,
        phoneTelsiz: form.phoneTelsiz || undefined,
        isActive: form.isActive
      };

      this.vehicleService.update(editingVehicle.id, updateDto).subscribe({
        next: () => {
          this.loadVehicles();
          this.closeVehicleForm();
        },
        error: (error) => {
          console.error('Error updating vehicle:', error);
          alert(error.error?.message || 'Araç güncellenirken hata oluştu');
        }
      });
    } else {
      // Create new vehicle
      const createDto: CreateVehicleDto = {
        plateProvince: form.plateProvince,
        plateLetters: form.plateLetters.toUpperCase(),
        plateNumbers: form.plateNumbers,
        vehicleNumber: form.vehicleNumber!,
        brand: form.brand || undefined,
        model: form.model || undefined,
        phoneTelsiz: form.phoneTelsiz || undefined
      };

      this.vehicleService.create(createDto).subscribe({
        next: () => {
          this.loadVehicles();
          this.closeVehicleForm();
        },
        error: (error) => {
          console.error('Error creating vehicle:', error);
          alert(error.error?.message || 'Araç oluşturulurken hata oluştu');
        }
      });
    }
  }

  async viewVehicle(vehicle: Vehicle): Promise<void> {
    const url = `${window.location.origin}/vehicles/${vehicle.id}/view`;
    const width = 1000;
    const height = 800;

    try {
      // Modern API: Window Management API (Chrome 100+, Edge 100+)
      // @ts-ignore - Window Management API henüz TypeScript'te tam desteklenmiyor
      if ('getScreenDetails' in window) {
        // @ts-ignore
        const screenDetails = await window.getScreenDetails();
        // @ts-ignore
        const primaryScreen = screenDetails.screens.find((s: any) => s.isPrimary) || screenDetails.screens[0];

        const left = primaryScreen.availLeft + 50;
        const top = primaryScreen.availTop + 50;

        const features = `width=${width},height=${height},left=${left},top=${top},screenX=${left},screenY=${top}`;
        const popup = window.open(url, '_blank', features);

        if (popup) {
          popup.focus();
          return;
        }
      }
    } catch (error) {
      console.log('Window Management API kullanılamadı, standart yöntem deneniyor...');
    }

    // Fallback: Standart yöntem - Ana ekranı tahmin et
    // Ana ekran genellikle koordinat 0,0'dadır
    const currentScreen = window.screen;
    const isOnPrimaryScreen = currentScreen.availLeft === 0 && currentScreen.availTop === 0;

    let left = 50;
    let top = 50;

    if (!isOnPrimaryScreen) {
      // Eğer şu an ana ekranda değilsek, koordinat 0,0'a (ana ekran) git
      left = -currentScreen.availLeft + 50;
      top = -currentScreen.availTop + 50;
    }

    const features = [
      `width=${width}`,
      `height=${height}`,
      `left=${left}`,
      `top=${top}`,
      `screenX=${left}`,
      `screenY=${top}`,
      'resizable=yes',
      'scrollbars=yes',
      'status=yes',
      'toolbar=no',
      'menubar=no',
      'location=no'
    ].join(',');

    const popup = window.open(url, '_blank', features);

    if (popup) {
      popup.focus();
      // Ek kontrol: 100ms sonra pozisyonu garanti altına al
      setTimeout(() => {
        try {
          popup.moveTo(left, top);
          popup.focus();
        } catch (e) {
          console.log('Pencere pozisyonu ayarlanamadı');
        }
      }, 100);
    } else {
      // Popup engellendi, fallback modal kullan
      console.warn('Popup engellendi, modal açılıyor...');
      this.viewingVehicle.set(vehicle);
      this.showVehicleView.set(true);
    }
  }

  closeVehicleView(): void {
    this.showVehicleView.set(false);
    this.viewingVehicle.set(null);
  }

  deleteVehicle(vehicle: Vehicle): void {
    if (!confirm(`"${vehicle.plate}" plakalı aracı deaktif etmek istediğinizden emin misiniz?`)) {
      return;
    }

    this.vehicleService.delete(vehicle.id).subscribe({
      next: () => {
        this.loadVehicles();
      },
      error: (error) => {
        console.error('Error deleting vehicle:', error);
        alert('Araç deaktif edilirken hata oluştu');
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('tr-TR');
  }
}
