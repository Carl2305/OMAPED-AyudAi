import { NgFor, NgIf } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';

interface SubMenuItem {
  title: string;
  icon: string;
  link: string;
}

interface MenuItem {
  title: string;
  icon: string;
  link: string;
  submenu: SubMenuItem[] | null;
  expanded?: boolean;
}

interface MenuData {
  menu: MenuItem[];
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  menuData: MenuData = {
    "menu": [
      {
          "title": "Inicio",
          "icon": "fas fa-home",
          "link": "/home",
          "submenu": null
      },
      {
          "title": "Registro de Beneficiarios",
          "icon": "fas fa-credit-card",
          "link": "beneficiary-registration",
          "submenu": null
      },
      {
          "title": "Clasificación y Priorización",
          "icon": "fas fa-shield-alt",
          "link": "classification-prioritization",
          "submenu": null
      },
      {
          "title": "Reportes y Auditoría",
          "icon": "fas fa-file-alt",
          "link": "reports-audit",
          "submenu": null
      }
    ]
  };

  isMobileMenuOpen = false;
  activeMenuItem: string = '/';

  constructor() {}

  ngOnInit(): void {
    // Inicializar el estado expanded de los items
    this.menuData.menu.forEach(item => {
      item.expanded = false;
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    const navTabs = document.getElementById('navTabs');
    if (navTabs) {
      if (this.isMobileMenuOpen) {
        navTabs.classList.add('expanded');
      } else {
        navTabs.classList.remove('expanded');
      }
    }
  }

  toggleSubmenu(item: MenuItem, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (item.submenu && item.submenu.length > 0) {
      // Cerrar todos los otros submenús primero
      this.menuData.menu.forEach(menuItem => {
        if (menuItem !== item) {
          menuItem.expanded = false;
        }
      });

      // Pequeño delay para asegurar que las animaciones se completen en mobile
      if (window.innerWidth <= 1024) {
        setTimeout(() => {
          item.expanded = !item.expanded;
        }, 50);
      } else {
        // Toggle el submenu actual inmediatamente en desktop
        item.expanded = !item.expanded;
      }
    } else {
      // // Si no tiene submenu, cerrar todos los submenús y navegar
      // this.collapseAllSubmenus();

      // Cerrar mobile menu si está abierto
      if (this.isMobileMenuOpen) {
        this.toggleMobileMenu();
      }
      this.setActiveItem(item.link);
    }
  }

  setActiveItem(link: string): void {
    this.activeMenuItem = link;
    // Aquí puedes añadir lógica de navegación si usas Router
    // this.router.navigate([link]);
  }

  navigateToSubmenu(submenuItem: SubMenuItem): void {
    this.setActiveItem(submenuItem.link);
    // Colapsar todos los submenús después de seleccionar
    this.collapseAllSubmenus();
    // Cerrar mobile menu si está abierto
    if (this.isMobileMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  collapseAllSubmenus(): void {
    this.menuData.menu.forEach(item => {
      item.expanded = false;
    });

    // En mobile, forzar un re-render para asegurar que las clases se actualicen
    if (window.innerWidth <= 1024) {
      setTimeout(() => {
        // Trigger change detection
      }, 10);
    }
  }

  isActive(link: string): boolean {
    return this.activeMenuItem === link;
  }

  isParentActive(item: MenuItem): boolean {
    if (this.activeMenuItem === item.link) {
      return true;
    }

    if (item.submenu) {
      return item.submenu.some(subItem => subItem.link === this.activeMenuItem);
    }

    return false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const navContainer = document.querySelector('.nav-container');

    // Verificar si el click fue fuera del menú
    if (navContainer && !navContainer.contains(target)) {
      // Cerrar menú móvil si está abierto
      if (this.isMobileMenuOpen) {
        this.isMobileMenuOpen = false;
        const navTabs = document.getElementById('navTabs');
        if (navTabs) {
          navTabs.classList.remove('expanded');
        }
      }

      // Cerrar todos los submenús
      this.collapseAllSubmenus();
    }
  }
}
